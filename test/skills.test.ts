import { describe, test, expect } from 'bun:test';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SKILLS_DIR = join(__dirname, '..', 'skills');
const EXPECTED_SKILLS = ['plan', 'review', 'fix', 'ship', 'browse', 'qa', 'sync-cookies', 'retro', 'context'];

describe('Skill Files', () => {
  test('all expected skills exist', () => {
    const skills = readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    
    for (const expected of EXPECTED_SKILLS) {
      expect(skills).toContain(expected);
    }
  });

  test('each skill has a SKILL.md file', () => {
    for (const skill of EXPECTED_SKILLS) {
      const skillPath = join(SKILLS_DIR, skill, 'SKILL.md');
      expect(existsSync(skillPath)).toBe(true);
    }
  });

  test('skill files are under 300 lines', () => {
    for (const skill of EXPECTED_SKILLS) {
      const skillPath = join(SKILLS_DIR, skill, 'SKILL.md');
      const content = readFileSync(skillPath, 'utf-8');
      const lines = content.split('\n').length;
      expect(lines).toBeLessThanOrEqual(300);
    }
  });

  test('skill files have required sections', () => {
    const requiredSections = ['Mode:', 'Use when:'];
    
    for (const skill of EXPECTED_SKILLS) {
      const skillPath = join(SKILLS_DIR, skill, 'SKILL.md');
      const content = readFileSync(skillPath, 'utf-8');
      
      for (const section of requiredSections) {
        expect(content).toContain(section);
      }
    }
  });

  test('skill files do not contain Claude-specific syntax', () => {
    const claudeSpecific = ['use the tool', 'call a function', 'function_calls', '<antml:'];
    
    for (const skill of EXPECTED_SKILLS) {
      const skillPath = join(SKILLS_DIR, skill, 'SKILL.md');
      const content = readFileSync(skillPath, 'utf-8').toLowerCase();
      
      for (const phrase of claudeSpecific) {
        expect(content).not.toContain(phrase.toLowerCase());
      }
    }
  });

  test('skill files have output format defined', () => {
    for (const skill of EXPECTED_SKILLS) {
      const skillPath = join(SKILLS_DIR, skill, 'SKILL.md');
      const content = readFileSync(skillPath, 'utf-8');
      
      // Most skills should define output format
      const hasOutputSection = content.includes('## Output') || 
                               content.includes('## Output format') ||
                               content.includes('After') ||
                               skill === 'sync-cookies'; // sync-cookies is simpler
      
      expect(hasOutputSection || skill === 'sync-cookies').toBe(true);
    }
  });
});