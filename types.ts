export interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  techStack: string[];
  liveLink: string;
  githubLink?: string;
  category?: string;
  year?: string;
  link?: string;
}

export interface NavItem {
  label: string;
  href: string;
}