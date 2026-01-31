import { PROJECTS, SKILLS } from '../constants';
import { describe, it, expect } from 'vitest';

describe('constants', () => {
  describe('PROJECTS', () => {
    it('exports projects with required fields', () => {
      expect(PROJECTS.length).toBeGreaterThan(0);
      for (const project of PROJECTS) {
        expect(project.id).toBeTruthy();
        expect(project.title).toBeTruthy();
        expect(project.image).toBeTruthy();
        expect(project.techStack.length).toBeGreaterThan(0);
        expect(project.liveLink).toBeTruthy();
      }
    });

    it('has unique project IDs', () => {
      const ids = PROJECTS.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('has valid image paths', () => {
      for (const project of PROJECTS) {
        expect(project.image).toMatch(/^(\/|https?:\/\/)/);
      }
    });
  });

  describe('SKILLS', () => {
    it('exports skills with categories and items', () => {
      expect(SKILLS.length).toBeGreaterThan(0);
      for (const skill of SKILLS) {
        expect(skill.name).toBeTruthy();
        expect(skill.items.length).toBeGreaterThan(0);
      }
    });

    it('has no empty skill items', () => {
      for (const skill of SKILLS) {
        for (const item of skill.items) {
          expect(item.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });
});
