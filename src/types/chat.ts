export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  role?: string;
  cards?: PolicyCard[];
}

export interface PolicyCard {
  id: string;
  title: string;
  summary: string;
  type: 'policy' | 'job' | 'welfare';
  details: string;
  imageUrl?: string;
  source?: {
    url: string;
    name: string;
  };
}

export type ChatRole = 'user' | 'assistant';

export interface ChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
} 