import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ExpertService from '../components/ChatBot/services/ExpertService';
import { Message } from '../types/chat';

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  startChat: () => Promise<void>;
  sendMessage: (message: string, expertType: string) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL;

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  const openChat = () => setIsOpen(true);
  const closeChat = () => {
    setIsOpen(false);
    if (messages.length > 0) {
      localStorage.setItem('last_conversation', JSON.stringify(messages));
    }
  };

  const startChat = async () => {
    if (messages.length > 0) return;
    
    setIsLoading(true);
    try {
      const savedConversation = localStorage.getItem('last_conversation');
      if (savedConversation) {
        const parsedMessages = JSON.parse(savedConversation);
        setMessages(parsedMessages);
        setConversationHistory(parsedMessages);
        return;
      }
      
      // API 호출로 초기 메시지 가져오기
      try {
        const response = await fetch(`${API_URL}/api/chatbot/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        const welcomeMessage: Message = {
          id: uuidv4(),
          content: data.answer,
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date(),
          actionCards: data.action_cards,
          exampleQuestions: data.example_questions
        };
        setMessages([welcomeMessage]);
        setConversationHistory([welcomeMessage]);
      } catch (apiError) {
        console.warn('API 연결 실패, 기본 환영 메시지 사용:', apiError);
        // API 실패 시 기본 환영 메시지 사용
        const welcomeMessage: Message = {
          id: uuidv4(),
          content: '원하시는 서비스를 선택해주세요.',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date(),
          // ExpertService를 사용하여 전문가 카드 가져오기
          actionCards: ExpertService.getExpertCardsByRole('user')
        };
        setMessages([welcomeMessage]);
        setConversationHistory([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: '죄송합니다. 채팅을 시작하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, expertType: string) => {
    if (!expertType) {
      const errorMessage: Message = {
        id: uuidv4(),
        content: '전문가를 먼저 선택해주세요.',
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

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
      const updatedHistory: Message[] = [...conversationHistory, userMessage];
      setConversationHistory(updatedHistory);

      // MongoDBService 관련 코드 완전 삭제, 오직 fetch로 백엔드 호출
      const formattedHistory = updatedHistory.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      }));

      let response;
      let data;

      try {
        response = await fetch(`${API_URL}/api/chatbot/conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: formattedHistory,
            expert_type: expertType
          })
        });
        data = await response.json();
      } catch (fetchError) {
        console.error('백엔드 연결 실패:', fetchError);
        const errorMessage: Message = {
          id: uuidv4(),
          content: '죄송합니다. 서버와의 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setConversationHistory(prev => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }
      
      // 응답 데이터 디버깅 로그 추가
      console.log('백엔드 응답 데이터:', data);
      
      const { cleanContent, extractedCards } = extractCardInfoFromText(data.answer || '');
      
      // 카드 데이터 처리 로직 개선
      let cardData = [];
      if (Array.isArray(data.cards) && data.cards.length > 0) {
        console.log('백엔드에서 직접 제공된 카드 데이터:', data.cards);
        cardData = data.cards;
      } else if (extractedCards.length > 0) {
        console.log('텍스트에서 추출된 카드 데이터:', extractedCards);
        cardData = extractedCards;
      } else {
        console.log('카드 데이터가 없거나 형식이 올바르지 않습니다.');
      }
      
      // 카드 데이터에 필수 필드 확인 및 추가
      cardData = cardData.map((card: any, index: number) => {
        // 백엔드에서 오는 다양한 필드명 처리
        const cardContent = (card as any).content || '';
        const cardDescription = (card as any).description || '';
        
        return {
          id: card.id || `card-${index}-${Date.now()}`,
          title: card.title || '제목 없음',
          summary: card.summary || cardDescription || cardContent || '',
          type: card.type || 'policy',
          details: card.details || cardContent || cardDescription || card.summary || '',
          subtitle: card.subtitle,
          source: card.source,
          buttons: card.buttons
        };
      });
      
      const botMessage: Message = {
        id: uuidv4(),
        content: cleanContent || data.answer || '죄송합니다. 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요.',
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date(),
        cards: cardData.length > 0 ? cardData : undefined
      };

      setConversationHistory(prev => [...prev, botMessage]);
      setMessages(prev => [...prev, botMessage]);
      localStorage.setItem('last_conversation', JSON.stringify([...updatedHistory, botMessage]));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setConversationHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 텍스트에서 카드 정보 추출하는 함수
  const extractCardInfoFromText = (text: string) => {
    let cleanContent = text;
    let extractedCards: any[] = [];
    
    // 개선된 구분자 검출 로직
    const hasCardSeparator = text.includes('###정보 카드') || 
                            text.includes('---') || 
                            text.includes('카드 정보:') || 
                            text.includes('[카드]');
    
    if (hasCardSeparator) {
      let parts;
      if (text.includes('###정보 카드')) {
        parts = text.split('###정보 카드');
      } else if (text.includes('---')) {
        parts = text.split('---');
      } else if (text.includes('카드 정보:')) {
        parts = text.split('카드 정보:');
      } else if (text.includes('[카드]')) {
        parts = text.split('[카드]');
      } else {
        parts = [text];
      }
      
      cleanContent = parts[0].trim();
      
      if (parts.length > 1) {
        const cardText = parts[1].trim();
        try {
          // JSON 형식인지 확인
          if ((cardText.startsWith('{') && cardText.endsWith('}')) || 
              (cardText.startsWith('[') && cardText.endsWith(']'))) {
            try {
              const jsonData = JSON.parse(cardText);
              const parsedCards = Array.isArray(jsonData) ? jsonData : [jsonData];
              
              // 카드 데이터 포맷팅
              extractedCards = parsedCards.map((card: any, index: number) => {
                const cardContent = card.content || '';
                const cardDescription = card.description || '';
                
                return {
                  id: card.id || `parsed-card-${index}-${Date.now()}`,
                  title: card.title || '정보 카드',
                  summary: card.summary || cardDescription || cardContent || '요약 정보가 없습니다.',
                  type: card.type || 'policy',
                  details: card.details || cardContent || cardDescription || card.summary || '상세 정보가 없습니다.',
                  subtitle: card.subtitle,
                  source: card.source,
                  buttons: card.buttons
                };
              });
              
              console.log('텍스트에서 추출된 카드 데이터:', extractedCards);
            } catch (e) {
              console.warn('카드 JSON 파싱 실패, 기본 카드 템플릿 사용', e);
              // 파싱 실패 시 기본 카드 생성
              extractedCards = [{
                id: `fallback-card-${Date.now()}`,
                title: '정보 카드',
                summary: '카드 정보를 파싱할 수 없습니다.',
                type: 'policy',
                details: cardText
              }];
            }
          } else {
            // JSON이 아닌 경우 텍스트를 카드 내용으로 사용
            extractedCards = [{
              id: `text-card-${Date.now()}`,
              title: '정보 카드',
              summary: cardText.substring(0, 100) + (cardText.length > 100 ? '...' : ''),
              type: 'policy',
              details: cardText
            }];
          }
        } catch (e) {
          console.error('카드 정보 추출 중 오류 발생', e);
          extractedCards = [];
        }
      }
    }
    return { cleanContent, extractedCards };
  };

  return (
    <ChatContext.Provider value={{ 
      isOpen, 
      messages, 
      isLoading, 
      openChat, 
      closeChat, 
      startChat, 
      sendMessage, 
      setMessages 
    }}>
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