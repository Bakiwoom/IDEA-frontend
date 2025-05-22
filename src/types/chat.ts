export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  role: 'user' | 'assistant';
  timestamp: Date;
  cards?: Card[];
  actionCards?: ExpertCard[];
  exampleQuestions?: ExpertQuestion[];
  action?: {
    type: string;
    target: string;
    keyword?: string;
  };
}

export interface CardButton {
  type: 'link' | 'tel' | 'email' | 'share';
  label: string;
  value: string;
}

export interface Card {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  type: 'employment' | 'jobseeker_stats' | 'policy' | 'welfare' | 'general' | '';
  details: string;
  imageUrl?: string;
  source?: {
    url?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  buttons?: CardButton[];
}

export interface ExpertCard {
  id: string;
  title: string;
  expert_type: string;
  description: string;
  icon?: string;
}

export interface ExpertQuestion {
  id: string;
  expert_type: string;
  question: string;
  category?: string;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
} 