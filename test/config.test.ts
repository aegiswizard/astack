import { describe, test, expect } from 'bun:test';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONFIG_EXAMPLE = join(__dirname, '..', '.xstack', 'config.example.json');

describe('Configuration', () => {
  test('config.example.json exists', () => {
    expect(existsSync(CONFIG_EXAMPLE)).toBe(true);
  });

  test('config.example.json is valid JSON', () => {
    const content = readFileSync(CONFIG_EXAMPLE, 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  test('config.example.json has expected fields', () => {
    const content = readFileSync(CONFIG_EXAMPLE, 'utf-8');
    const config = JSON.parse(content);
    
    expect(config).toHaveProperty('test_command');
    expect(config).toHaveProperty('dev_server');
    expect(config).toHaveProperty('skip_eng_review');
    expect(config).toHaveProperty('greptile');
    expect(config).toHaveProperty('model_preference');
  });

  test('model_preference has all skills', () => {
    const content = readFileSync(CONFIG_EXAMPLE, 'utf-8');
    const config = JSON.parse(content);
    
    const expectedSkills = ['plan', 'review', 'fix', 'ship', 'qa', 'retro', 'context'];
    for (const skill of expectedSkills) {
      expect(config.model_preference).toHaveProperty(skill);
    }
  });

  test('config values use snake_case', () => {
    const content = readFileSync(CONFIG_EXAMPLE, 'utf-8');
    const config = JSON.parse(content);
    
    // Keys should be snake_case
    const keys = Object.keys(config);
    for (const key of keys) {
      if (key !== 'model_preference') {
        expect(key).toMatch(/^[a-z_]+$/);
      }
    }
  });
});