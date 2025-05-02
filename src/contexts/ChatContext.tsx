import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, PolicyCard } from '../types/chat';

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  const sendMessage = async (content: string) => {
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      role: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 백엔드 API 호출
      const response = await fetch('http://localhost:8082/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });

      const data = await response.json();

      // 봇 응답 메시지 생성
      const botMessage: Message = {
        id: uuidv4(),
        content: data.answer,
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date(),
        cards: data.cards?.map((card: any) => ({
          id: card.id,
          title: card.title,
          summary: card.summary,
          type: card.type || 'policy',
          details: card.details,
          source: card.source ? {
            url: card.source.url,
            name: card.source.name
          } : undefined
        }))
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다.',
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ isOpen, messages, isLoading, openChat, closeChat, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 