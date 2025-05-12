import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ExpertService from '../components/ChatBot/services/ExpertService';
import { Message } from '../types/chat';
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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL;

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { role } = useAuth();
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
        setIsLoading(false);
        return;
      }
      
      // 비회원인 경우 기본 환영 메시지 표시
      if (!role) {
        const welcomeMessage: Message = {
          id: uuidv4(),
          content: '안녕하세요! IDEA-AI 챗봇입니다. 👋\n\n' +
                  '저는 장애인 복지 정보와 취업 정보를 안내해드리는 AI 도우미입니다.\n\n' +
                  '더 자세한 정보와 맞춤 서비스를 이용하시려면 로그인이 필요합니다. 😊\n\n' +
                  '• 장애인 회원: 맞춤형 복지/취업 정보 안내\n' +
                  '• 기업 회원: 장애인 채용 정보 및 지원제도 안내',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        setConversationHistory([welcomeMessage]);
        setIsLoading(false);
        return;
      }
      
      // role이 설정될 때까지 대기
      if (role === '') {
        const loadingMessage: Message = {
          id: uuidv4(),
          content: '사용자 정보를 불러오는 중입니다...',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages([loadingMessage]);
        setIsLoading(false);
        return;
      }
      
      // API 호출
      try {
        const userType = role === 'COMPANY' ? 'company' : 'disabled';
        const response = await fetch(`${API_URL}/api/chatbot/start?user_type=${userType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          console.error('API 에러:', response.status, response.statusText);
          throw new Error('챗봇 서비스 연결에 실패했습니다.');
        }
        
        const data = await response.json();
        
        // 응답 데이터 유효성 검사
        if (!data || typeof data.answer !== 'string') {
          throw new Error('서버 응답 형식이 올바르지 않습니다.');
        }
        
        const welcomeMessage: Message = {
          id: uuidv4(),
          content: data.answer || '안녕하세요! IDEA-AI 챗봇입니다. 무엇을 도와드릴까요?',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date(),
          actionCards: Array.isArray(data.action_cards) ? data.action_cards : [],
          exampleQuestions: Array.isArray(data.example_questions) ? data.example_questions : []
        };
        setMessages([welcomeMessage]);
        setConversationHistory([welcomeMessage]);
      } catch (apiError) {
        console.error('API 연결 실패:', apiError);
        
        // 사용자에게 보여줄 에러 메시지
        const errorMessage: Message = {
          id: uuidv4(),
          content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. 🔄\n\n' +
                   '문제가 지속되면 관리자에게 문의해 주세요.',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date(),
          actionCards: [
            {
              id: 'help',
              title: '도움말',
              expert_type: 'help',
              description: '챗봇 이용에 문제가 있을 때 도움을 드립니다.',
              icon: '❓'
            }
          ]
        };
        setMessages([errorMessage]);
        setConversationHistory([errorMessage]);
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
    // 비회원인 경우 로그인 안내 메시지 표시
    if (!role) {
      const userMessage: Message = {
        id: uuidv4(),
        content,
        sender: 'user',
        role: 'user',
        timestamp: new Date(),
      };
      
      const loginGuideMessage: Message = {
        id: uuidv4(),
        content: '죄송합니다. 맞춤형 상담 서비스를 이용하시려면 로그인이 필요합니다. 🔒\n\n' +
                '로그인하시면 다음과 같은 서비스를 이용하실 수 있습니다:\n\n' +
                '• 맞춤형 복지 정보 안내\n' +
                '• 취업 정보 및 구직 지원\n' +
                '• 전문가 상담 서비스\n' +
                '• 개인 맞춤 추천 서비스',
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage, loginGuideMessage]);
      return;
    }

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
            expert_type: expertType,
            user_type: role === 'COMPANY' ? 'company' : 'disabled'
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