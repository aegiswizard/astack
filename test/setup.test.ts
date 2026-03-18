import { describe, test, expect } from 'bun:test';
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const SETUP_SCRIPT = join(__dirname, '..', 'setup');

describe('Setup Script', () => {
  test('setup script exists', () => {
    expect(existsSync(SETUP_SCRIPT)).toBe(true);
  });

  test('setup script is executable', () => {
    const stats = statSync(SETUP_SCRIPT);
    // Check if any execute bit is set
    expect(stats.mode & 0o111).not.toBe(0);
  });

  test('setup script has shebang', () => {
    const content = readFileSync(SETUP_SCRIPT, 'utf-8');
    expect(content.startsWith('#!/usr/bin/env bash')).toBe(true);
  });

  test('setup script uses strict mode', () => {
    const content = readFileSync(SETUP_SCRIPT, 'utf-8');
    expect(content).toContain('set -euo pipefail');
  });

  test('setup script references all skills', () => {
    const content = readFileSync(SETUP_SCRIPT, 'utf-8');
    const expectedSkills = ['plan', 'review', 'fix', 'ship', 'browse', 'qa', 'sync-cookies', 'retro', 'context'];
    
    for (const skill of expectedSkills) {
      expect(content).toContain(skill);
    }
  });

  test('setup script creates correct symlink paths', () => {
    const content = readFileSync(SETUP_SCRIPT, 'utf-8');
    
    // Should link to ~/.claude/skills/
    expect(content).toContain('.claude/skills');
    expect(content).toContain('ln -s');
  });

  test('setup script mentions astack (not xstack)', () => {
    const content = readFileSync(SETUP_SCRIPT, 'utf-8');
    
    // Should reference 'astack' not 'xstack' (except in .xstack which is correct)
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('.xstack')) continue; // .xstack is the config dir
      expect(line).not.toContain('xstack');
    }
    
    // Should reference 'astack'
    expect(content).toContain('astack');
  });
});