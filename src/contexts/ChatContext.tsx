import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ExpertService, { Message } from '../components/ChatBot/services/ExpertService';

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
        const response = await fetch('http://localhost:8082/api/chatbot/start', {
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
      const formattedHistory = updatedHistory.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      }));
      
      let response;
      let data;
      
      try {
        response = await fetch('http://localhost:8082/api/chatbot/conversation', {
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
        console.warn('백엔드 연결 실패, 테스트 데이터 사용:', fetchError);
        
        // 테스트용 응답 데이터
        const testCardContent = content.toLowerCase().includes('지원금') 
          ? `장애인 고용 지원금에 대한 정보를 알려드리겠습니다.
          
---
[
  {
    "id": "card1",
    "title": "장애인 고용 지원금",
    "subtitle": "고용노동부 장애인 고용 촉진 정책",
    "summary": "장애인을 고용한 사업주에게 지급되는 지원금입니다.",
    "type": "employment",
    "details": "장애인 고용 지원금은 장애인을 고용한 사업주에게 지급되는 지원금으로, 장애인 근로자 1인당 월 30~80만원까지 지원됩니다. 신청 방법은 한국장애인고용공단 지사를 방문하거나 온라인으로 신청 가능합니다.",
    "source": {
      "url": "https://www.kead.or.kr",
      "name": "한국장애인고용공단",
      "phone": "1588-1519"
    },
    "buttons": [
      {
        "type": "link",
        "label": "지원금 신청하기",
        "value": "https://www.kead.or.kr/business/employment.jsp"
      },
      {
        "type": "tel",
        "label": "전화 문의",
        "value": "1588-1519"
      }
    ]
  }
]`
          : content.toLowerCase().includes('복지') 
          ? `장애인 복지 서비스에 대한 정보입니다.
          
---
[
  {
    "id": "card2",
    "title": "장애인 복지 카드",
    "subtitle": "장애인 복지 서비스 이용 안내",
    "summary": "장애인 복지 카드로 이용할 수 있는 서비스입니다.",
    "type": "welfare",
    "details": "장애인 복지 카드는 장애인 등록증과 함께 발급되는 카드로, 교통수단 이용 시 요금 감면, 공공시설 이용료 감면 등 다양한 혜택을 받을 수 있습니다. 주민센터에서 신청 가능합니다.",
    "source": {
      "url": "https://www.bokjiro.go.kr",
      "name": "복지로",
      "phone": "129"
    }
  }
]`
          : content.toLowerCase().includes('테스트') || content.toLowerCase().includes('test')
          ? `다양한 필드 포맷 테스트용 카드입니다.
          
---
[
  {
    "id": "test-card-1",
    "title": "description 필드 테스트",
    "description": "summary 대신 description 필드를 사용한 카드입니다.",
    "type": "policy",
    "content": "details 대신 content 필드를 사용한 상세 내용입니다. 이 카드는 서로 다른 필드 이름을 테스트하기 위한 카드입니다."
  },
  {
    "id": "test-card-2",
    "title": "content만 있는 카드",
    "type": "education",
    "content": "content 필드만 있는 카드입니다. 이 내용이 요약과 상세 정보로 모두 사용됩니다."
  }
]`
          : `질문에 대한 답변입니다. 카드 정보가 없습니다.`;
          
        data = {
          answer: testCardContent
        };
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