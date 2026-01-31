import { PROJECTS, SKILLS } from '../constants';

describe('constants', () => {
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

  it('exports skills with categories and items', () => {
    expect(SKILLS.length).toBeGreaterThan(0);
    for (const skill of SKILLS) {
      expect(skill.name).toBeTruthy();
      expect(skill.items.length).toBeGreaterThan(0);
    }
  });
});
