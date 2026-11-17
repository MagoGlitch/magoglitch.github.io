export interface Project {
  id: string;
  title: string;
  client: string;
  handle: string;
  type: string;
  category: 'Carrosséis' | 'Estáticos' | 'Identidade Visual';
  cover: string;
  slides: string[];
  slideCount: number;
  pdf?: string | null;
  software: string;
  colors: string[];
  description: string;
  highlight: boolean;
}

// Data is loaded from projects-data.js or direct import
declare global {
  interface Window {
    PORTFOLIO_PROJECTS: Project[];
  }
}
