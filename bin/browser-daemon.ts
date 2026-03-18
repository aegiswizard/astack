#!/usr/bin/env bun
/**
 * Browser Daemon for Astack
 * 
 * A persistent Chromium process (via Playwright) that provides fast browser
 * automation for /browse and /qa commands.
 * 
 * Usage:
 *   bun run bin/browser-daemon.ts
 *   # or after build:
 *   ./bin/browser-daemon
 * 
 * Environment:
 *   BROWSER_PORT          - HTTP server port (default: 3777)
 *   BROWSER_IDLE_TIMEOUT  - Idle timeout in ms (default: 1800000 = 30 min)
 *   BROWSER_STATE_DIR     - Cookie/storage directory (default: .browser-state)
 *   BROWSER_DEBUG         - Enable verbose logging (default: 0)
 */

import { chromium, Browser, BrowserContext, Page, ConsoleMessage, Request, Response, Dialog } from 'playwright';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { promises as fs } from 'fs';
import { join } from 'path';

// Configuration
const PORT = parseInt(process.env.BROWSER_PORT || '3777', 10);
const IDLE_TIMEOUT_MS = parseInt(process.env.BROWSER_IDLE_TIMEOUT || '1800000', 10); // 30 minutes
const STATE_DIR = process.env.BROWSER_STATE_DIR || '.browser-state';
const DEBUG = process.env.BROWSER_DEBUG === '1';

// State
let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;
let lastActivity = Date.now();

// Buffers
interface ConsoleEntry {
  type: string;
  text: string;
  timestamp: number;
}

interface NetworkEntry {
  method: string;
  url: string;
  status: number;
  timestamp: number;
}

interface DialogEntry {
  type: string;
  message: string;
  timestamp: number;
}

const consoleBuffer: ConsoleEntry[] = [];
const networkBuffer: NetworkEntry[] = [];
const dialogBuffer: DialogEntry[] = [];
const MAX_BUFFER_SIZE = 1000;

// Logging
function log(message: string): void {
  if (DEBUG) {
    console.error(`[browser-daemon] ${new Date().toISOString()} ${message}`);
  }
}

function writeToLog(message: string): void {
  const logPath = join(process.cwd(), '.xstack', 'browser.log');
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  
  // Async append - don't block
  fs.appendFile(logPath, line).catch(() => {
    // Ignore log write errors
  });
}

// Browser management
async function ensureBrowser(): Promise<void> {
  if (!browser) {
    log('Starting browser...');
    
    // Ensure state directory exists
    await fs.mkdir(STATE_DIR, { recursive: true });
    await fs.mkdir(join(process.cwd(), '.xstack'), { recursive: true });
    
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ]
    });
    
    context = await browser.newContext({
      storageState: join(STATE_DIR, 'storage.json')
    });
    
    page = await context.newPage();
    
    // Set up event handlers
    page.on('console', (msg: ConsoleMessage) => {
      const entry: ConsoleEntry = {
        type: msg.type(),
        text: msg.text(),
        timestamp: Date.now()
      };
      consoleBuffer.push(entry);
      if (consoleBuffer.length > MAX_BUFFER_SIZE) consoleBuffer.shift();
    });
    
    page.on('request', (req: Request) => {
      const entry: NetworkEntry = {
        method: req.method(),
        url: req.url(),
        status: 0,
        timestamp: Date.now()
      };
      networkBuffer.push(entry);
      if (networkBuffer.length > MAX_BUFFER_SIZE) networkBuffer.shift();
    });
    
    page.on('response', (res: Response) => {
      // Update the last network entry with status
      const lastEntry = networkBuffer[networkBuffer.length - 1];
      if (lastEntry && lastEntry.url === res.url()) {
        lastEntry.status = res.status();
      }
    });
    
    page.on('dialog', async (dialog: Dialog) => {
      const entry: DialogEntry = {
        type: dialog.type(),
        message: dialog.message(),
        timestamp: Date.now()
      };
      dialogBuffer.push(entry);
      if (dialogBuffer.length > MAX_BUFFER_SIZE) dialogBuffer.shift();
      
      // Auto-dismiss dialogs
      await dialog.dismiss();
    });
    
    log('Browser started');
  }
  
  lastActivity = Date.now();
}

async function shutdown(): Promise<void> {
  log('Shutting down...');
  
  if (context) {
    try {
      await context.storageState(join(STATE_DIR, 'storage.json'));
    } catch (e) {
      // Ignore storage state errors
    }
  }
  
  if (browser) {
    await browser.close();
  }
  
  process.exit(0);
}

// Idle timeout check
setInterval(() => {
  if (Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
    log('Idle timeout reached, shutting down');
    shutdown();
  }
}, 60000); // Check every minute

// HTTP server
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    await ensureBrowser();
    
    const body = await parseBody(req);
    const result = await handleCommand(body);
    
    res.writeHead(200);
    res.end(JSON.stringify(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    log(`Error: ${message}`);
    writeToLog(`ERROR: ${message}`);
    
    res.writeHead(500);
    res.end(JSON.stringify({ success: false, error: message }));
  }
});

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

async function handleCommand(cmd: any): Promise<any> {
  if (!page) {
    return { success: false, error: 'Browser not initialized' };
  }
  
  const action = cmd.action;
  log(`Command: ${action}`);
  writeToLog(`COMMAND: ${action}`);
  
  switch (action) {
    case 'goto': {
      const url = cmd.url;
      if (!url) return { success: false, error: 'URL required' };
      
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      return { 
        success: true, 
        title: await page.title(), 
        url: page.url() 
      };
    }
    
    case 'screenshot': {
      const fullPage = cmd.fullPage ?? false;
      const buffer = await page.screenshot({ fullPage });
      return { 
        success: true, 
        data: buffer.toString('base64'),
        mimeType: 'image/png'
      };
    }
    
    case 'snapshot': {
      const snapshot = await page.accessibility.snapshot();
      return { success: true, tree: snapshot };
    }
    
    case 'text': {
      const text = await page.textContent('body');
      return { success: true, text };
    }
    
    case 'html': {
      const html = await page.content();
      return { success: true, html };
    }
    
    case 'click': {
      if (cmd.selector) {
        await page.click(cmd.selector);
      } else if (cmd.role && cmd.name) {
        await page.getByRole(cmd.role, { name: cmd.name }).click();
      } else {
        return { success: false, error: 'selector or role+name required' };
      }
      return { success: true };
    }
    
    case 'fill': {
      const { selector, value } = cmd;
      if (!selector || value === undefined) {
        return { success: false, error: 'selector and value required' };
      }
      await page.fill(selector, value);
      return { success: true };
    }
    
    case 'select': {
      const { selector, value } = cmd;
      if (!selector || !value) {
        return { success: false, error: 'selector and value required' };
      }
      await page.selectOption(selector, value);
      return { success: true };
    }
    
    case 'check':
    case 'uncheck': {
      const { selector } = cmd;
      if (!selector) return { success: false, error: 'selector required' };
      
      if (action === 'check') {
        await page.check(selector);
      } else {
        await page.uncheck(selector);
      }
      return { success: true };
    }
    
    case 'hover': {
      const { selector } = cmd;
      if (!selector) return { success: false, error: 'selector required' };
      await page.hover(selector);
      return { success: true };
    }
    
    case 'press': {
      const { key } = cmd;
      if (!key) return { success: false, error: 'key required' };
      await page.keyboard.press(key);
      return { success: true };
    }
    
    case 'scroll': {
      const direction = cmd.direction || 'down';
      const amount = cmd.amount || 500;
      
      if (direction === 'down' || direction === 'up') {
        await page.evaluate((dir, amt) => {
          window.scrollBy({
            top: dir === 'down' ? amt : -amt,
            behavior: 'smooth'
          });
        }, direction, amount);
      } else if (direction === 'left' || direction === 'right') {
        await page.evaluate((dir, amt) => {
          window.scrollBy({
            left: dir === 'right' ? amt : -amt,
            behavior: 'smooth'
          });
        }, direction, amount);
      }
      return { success: true };
    }
    
    case 'wait': {
      const ms = cmd.ms || 1000;
      await new Promise(resolve => setTimeout(resolve, ms));
      return { success: true };
    }
    
    case 'console': {
      const messages = [...consoleBuffer];
      consoleBuffer.length = 0;
      return { success: true, messages };
    }
    
    case 'network': {
      const requests = [...networkBuffer];
      networkBuffer.length = 0;
      return { success: true, requests };
    }
    
    case 'cookies': {
      const cookies = await context!.cookies();
      return { success: true, cookies };
    }
    
    case 'links': {
      const links = await page.evaluate(() => {
        const anchors = document.querySelectorAll('a[href]');
        return Array.from(anchors).map(a => ({
          text: a.textContent?.trim() || '',
          href: (a as HTMLAnchorElement).href
        }));
      });
      return { success: true, links };
    }
    
    case 'new-tab': {
      const newPage = await context!.newPage();
      // Switch focus to new tab
      const pages = context!.pages();
      return { success: true, tabIndex: pages.length - 1 };
    }
    
    case 'switch-tab': {
      const index = cmd.index;
      if (index === undefined) {
        return { success: false, error: 'index required' };
      }
      const pages = context!.pages();
      if (index < 0 || index >= pages.length) {
        return { success: false, error: `Invalid tab index: ${index}` };
      }
      page = pages[index];
      return { success: true, tabIndex: index };
    }
    
    case 'close-tab': {
      const pages = context!.pages();
      if (pages.length <= 1) {
        return { success: false, error: 'Cannot close last tab' };
      }
      await page.close();
      page = pages[0];
      return { success: true };
    }
    
    case 'back': {
      await page.goBack();
      return { success: true, url: page.url() };
    }
    
    case 'forward': {
      await page.goForward();
      return { success: true, url: page.url() };
    }
    
    case 'reload': {
      await page.reload();
      return { success: true, url: page.url() };
    }
    
    case 'shutdown': {
      // Schedule shutdown after response
      setTimeout(() => shutdown(), 100);
      return { success: true, message: 'Shutting down' };
    }
    
    default:
      return { success: false, error: `Unknown action: ${action}` };
  }
}

// Periodic log flush
setInterval(() => {
  if (consoleBuffer.length > 0 || networkBuffer.length > 0 || dialogBuffer.length > 0) {
    writeToLog(`BUFFER: console=${consoleBuffer.length} network=${networkBuffer.length} dialog=${dialogBuffer.length}`);
  }
}, 1000);

// Start server
server.listen(PORT, () => {
  console.log(`Browser daemon listening on http://localhost:${PORT}`);
  console.log('Commands: goto, screenshot, snapshot, text, html, click, fill, select, press, wait, console, network, cookies, links, new-tab, switch-tab, close-tab, back, forward, reload, shutdown');
  log(`Started on port ${PORT}`);
});

// Handle shutdown signals
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());