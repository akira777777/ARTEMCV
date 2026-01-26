
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveLink: string;
  githubLink: string;
  image: string;
}

export interface BrandBible {
  name: string;
  suggestedNames: string[];
  mission: string;
  palette: ColorScheme[];
  typography: FontPairing;
  primaryLogoPrompt: string;
  monochromaticLogoPrompt: string;
  simplifiedIconPrompt: string;
  grayscaleLogoPrompt: string;
  secondaryMarkPrompt1: string;
  secondaryMarkPrompt2: string;
  usageNotes: string;
}

export interface ColorScheme {
  hex: string;
  name: string;
  usage: string;
}

export interface FontPairing {
  header: string;
  body: string;
  rationale: string;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingChunk[];
}
