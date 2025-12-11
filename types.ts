export enum Domain {
  HOME = 'HOME',
  SCIENCE = 'SCIENCE',
  EDUCATION = 'EDUCATION',
  ACCESSIBILITY = 'ACCESSIBILITY',
  HEALTH = 'HEALTH',
  BUSINESS = 'BUSINESS',
  TECHNOLOGY = 'TECHNOLOGY'
}

export interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
  attachment?: string; // base64 image or audio
  type?: 'text' | 'image' | 'audio' | 'code' | 'search-result';
  meta?: any;
}

export interface SearchSource {
  title: string;
  uri: string;
}

export interface GroundingMetadata {
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
}

export interface GeneratedContent {
  text: string;
  groundingMetadata?: GroundingMetadata;
}