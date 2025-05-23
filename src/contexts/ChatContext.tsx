import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ExpertService from '../components/ChatBot/services/ExpertService';
import { Message } from '../types/chat';
import { measureApiResponseTime, useMemoryMonitoring } from '../utils/performance';
import { useAuth } from '../contexts/user/AuthProvider';

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  startChat: () => Promise<void>;
  sendMessage: (message: string, expertType: string) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  pendingAction: {type: string, options?: string[]} | null;
  pendingMessage: string | null;
  handleUserInputForAction: (userInput: string) => Promise<void>;
  setPendingAction: React.Dispatch<React.SetStateAction<{type: string, options?: string[]} | null>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL;

// 메시지 생성 유틸리티 함수
const createMessage = (content: string, sender: 'user' | 'bot', role: 'user' | 'assistant', additionalProps = {}): Message => ({
  id: uuidv4(),
  content,
  sender,
  role,
  timestamp: new Date(),
  ...additionalProps
});

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{type: string, options?: string[]} | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // 메모리 사용량 모니터링
  useMemoryMonitoring();

  const openChat = useCallback(() => setIsOpen(true), []);
  
  const closeChat = useCallback(() => {
    setIsOpen(false);
    if (messages.length > 0) {
      localStorage.setItem('last_conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const startChat = useCallback(async () => {
    if (messages.length > 0) return;
    
    setIsLoading(true);
    try {
      const savedConversation = localStorage.getItem('last_conversation');
      if (savedConversation) {
        const parsedMessages = JSON.parse(savedConversation);
        setMessages(parsedMessages);
        return;
      }
      
      try {
        const response = await measureApiResponseTime(() => 
          fetch(`${API_URL}/api/chatbot/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
        );
        const data = await response.json();
        
        const welcomeMessage = createMessage(
          data.answer,
          'bot',
          'assistant',
          {
            actionCards: data.action_cards,
            exampleQuestions: data.example_questions
          }
        );
        
        setMessages([welcomeMessage]);
      } catch (apiError) {
        console.warn('API 연결 실패, 기본 환영 메시지 사용:', apiError);
        
        const welcomeMessage = createMessage(
          '원하시는 서비스를 선택해주세요.',
          'bot',
          'assistant',
          { actionCards: ExpertService.getExpertCardsByRole('user') }
        );
        
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      const errorMessage = createMessage(
        '죄송합니다. 채팅을 시작하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        'bot',
        'assistant'
      );
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages.length]);

  const { role, name, userId, companyId } = useAuth();

  const sendMessage = useCallback(async (content: string, expertType: string) => {
    if (!expertType) {
      const errorMessage = createMessage(
        '전문가를 먼저 선택해주세요.',
        'bot',
        'assistant'
      );
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = createMessage(content, 'user', 'user');
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formattedHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const user_info = {
        role,
        name,
        userId,
        companyId
      };

      const response = await measureApiResponseTime(() =>
        fetch(`${API_URL}/api/chatbot/conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: formattedHistory,
            expert_type: expertType,
            user_info
          })
        })
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // action 처리
      if (data.action === "request_region") {
        setPendingAction({ type: "region" });
        setPendingMessage(content);
        return;
      }
      if (data.action === "request_industry") {
        setPendingAction({ type: "industry", options: data.industry_options });
        setPendingMessage(content);
        return;
      }
      const { cleanContent, extractedCards } = extractCardInfoFromText(data.answer || '');
      const cardData = processCardData(data.cards || extractedCards);
      
      const botMessage = createMessage(
        cleanContent || data.answer || '죄송합니다. 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요.',
        'bot',
        'assistant',
        { cards: cardData.length > 0 ? cardData : undefined }
      );

      setMessages(prev => [...prev, botMessage]);
      localStorage.setItem('last_conversation', JSON.stringify([...messages, userMessage, botMessage]));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = createMessage(
        '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        'bot',
        'assistant'
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, role, name, userId, companyId]);

  const handleUserInputForAction = async (userInput: string) => {
    if (!pendingAction) return;
    setPendingAction(null);

    // user_info에 입력값을 포함해서 백엔드로 전송
    const userInfo = pendingAction.type === "region"
      ? { address: userInput }
      : { industry: userInput };

    // 기존 메시지와 함께 user_info를 포함해 전송
    const formattedHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/chatbot/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          expert_type: "구직자 현황",
          user_info: userInfo
        })
      });
      const data = await response.json();
      // ... 기존 메시지 처리와 동일하게 처리 ...
      // (카드, 텍스트 등)
    } finally {
      setIsLoading(false);
    }
  };

  // 카드 데이터 처리 함수
  const processCardData = (cards: any[]) => {
    if (!Array.isArray(cards) || cards.length === 0) return [];
    
    return cards.map((card: any, index: number) => ({
      id: card.id || `card-${index}-${Date.now()}`,
      title: card.title || '제목 없음',
      summary: card.summary || card.description || card.content || '',
      type: card.type || 'general',
      details: card.details || card.content || card.description || card.summary || '',
      subtitle: card.subtitle,
      source: card.source,
      buttons: card.buttons
    }));
  };

  // 텍스트에서 카드 정보 추출하는 함수
  const extractCardInfoFromText = (text: string) => {
    let cleanContent = text;
    let extractedCards: any[] = [];
    
    const separators = ['###정보 카드', '---', '카드 정보:', '[카드]'];
    const separator = separators.find(sep => text.includes(sep));
    
    if (separator) {
      const parts = text.split(separator);
      cleanContent = parts[0].trim();
      
      if (parts[1]) {
        try {
          extractedCards = JSON.parse(parts[1].trim());
        } catch {
          // JSON 파싱 실패 시 빈 배열 유지
        }
      }
    }
    
    return { cleanContent, extractedCards };
  };

  const value = useMemo(() => ({
    isOpen,
    messages,
    isLoading,
    openChat,
    closeChat,
    startChat,
    sendMessage,
    setMessages,
    pendingAction,
    pendingMessage,
    handleUserInputForAction,
    setPendingAction
  }), [isOpen, messages, isLoading, openChat, closeChat, startChat, sendMessage, pendingAction, pendingMessage, handleUserInputForAction, setPendingAction]);

  return (
    <ChatContext.Provider value={value}>
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