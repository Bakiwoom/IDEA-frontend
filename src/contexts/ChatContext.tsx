import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/chat';

// 테스트용 카드 데이터
const testCards = {
  policy: [
    {
      id: 'policy1',
      title: '장애인연금제도',
      subtitle: '기초생활보장제도',
      summary: '장애인연금은 장애로 인한 추가적 비용을 지원하는 제도입니다.',
      type: 'policy' as const,
      details: '장애인연금은 장애로 인한 추가적 비용을 지원하는 제도로, 장애등급 1~2급 장애인에게 월 30만원을 지급합니다. 신청은 읍면동 주민센터에서 가능합니다.',
      source: {
        url: 'https://www.mohw.go.kr',
        name: '보건복지부',
        phone: '129'
      },
      buttons: [
        { type: 'link' as const, label: '자세히 보기', value: 'https://www.mohw.go.kr' },
        { type: 'tel' as const, label: '전화 문의', value: '129' }
      ]
    },
    {
      id: 'policy2',
      title: '장애인활동지원',
      subtitle: '장애인복지법',
      summary: '장애인의 일상생활 및 사회활동 참여를 지원하는 서비스입니다.',
      type: 'policy' as const,
      details: '장애인활동지원은 장애인의 일상생활 및 사회활동 참여를 지원하는 서비스로, 장애등급 1~3급 장애인에게 제공됩니다. 지원시간은 장애등급에 따라 차등 지급됩니다.',
      source: {
        url: 'https://www.mohw.go.kr',
        name: '보건복지부',
        email: 'support@mohw.go.kr'
      }
    },
    {
      id: 'policy3',
      title: '장애인차별금지법',
      subtitle: '장애인권리보장',
      summary: '장애인에 대한 차별을 금지하고 권리를 보장하는 법률입니다.',
      type: 'policy' as const,
      details: '장애인차별금지법은 장애인에 대한 차별을 금지하고 권리를 보장하는 법률로, 교육, 고용, 재화와 용역의 제공 등 모든 영역에서의 차별을 금지합니다.',
      source: {
        url: 'https://www.mohw.go.kr',
        name: '보건복지부'
      }
    }
  ],
  employment: [
    {
      id: 'emp1',
      title: '장애인고용촉진공단',
      subtitle: '취업지원',
      summary: '장애인의 취업을 지원하는 공공기관입니다.',
      type: 'employment' as const,
      details: '장애인고용촉진공단은 장애인의 취업을 지원하는 공공기관으로, 직업상담, 취업알선, 직업훈련 등의 서비스를 제공합니다.',
      source: {
        url: 'https://www.kead.or.kr',
        name: '장애인고용촉진공단',
        phone: '1588-1519'
      }
    },
    {
      id: 'emp2',
      title: '장애인일자리',
      subtitle: '취업정보',
      summary: '장애인을 위한 다양한 일자리 정보를 제공합니다.',
      type: 'employment' as const,
      details: '장애인일자리는 장애인을 위한 다양한 일자리 정보를 제공하는 서비스로, 공공부문 일자리, 민간부문 일자리, 창업지원 등 다양한 정보를 제공합니다.',
      source: {
        url: 'https://www.kead.or.kr',
        name: '장애인고용촉진공단'
      }
    },
    {
      id: 'emp3',
      title: '장애인직업재활',
      subtitle: '직업훈련',
      summary: '장애인의 직업재활을 위한 훈련 프로그램을 제공합니다.',
      type: 'employment' as const,
      details: '장애인직업재활은 장애인의 직업재활을 위한 훈련 프로그램을 제공하는 서비스로, 직업평가, 직업훈련, 취업알선 등의 서비스를 제공합니다.',
      source: {
        url: 'https://www.kead.or.kr',
        name: '장애인고용촉진공단'
      }
    }
  ],
  welfare: [
    {
      id: 'welfare1',
      title: '장애인복지시설',
      subtitle: '복지서비스',
      summary: '장애인의 복지증진을 위한 시설을 안내합니다.',
      type: 'welfare' as const,
      details: '장애인복지시설은 장애인의 복지증진을 위한 시설로, 주간보호시설, 거주시설, 단기보호시설 등이 있습니다.',
      source: {
        url: 'https://www.mohw.go.kr',
        name: '보건복지부',
        phone: '129'
      }
    },
    {
      id: 'welfare2',
      title: '장애인복지카드',
      subtitle: '복지혜택',
      summary: '장애인의 복지혜택을 제공하는 카드 서비스입니다.',
      type: 'welfare' as const,
      details: '장애인복지카드는 장애인의 복지혜택을 제공하는 카드 서비스로, 교통비, 문화생활비, 의료비 등 다양한 혜택을 제공합니다.',
      source: {
        url: 'https://www.mohw.go.kr',
        name: '보건복지부'
      }
    },
    {
      id: 'welfare3',
      title: '장애인복지지원',
      subtitle: '지원사업',
      summary: '장애인의 복지증진을 위한 다양한 지원사업을 안내합니다.',
      type: 'welfare' as const,
      details: '장애인복지지원은 장애인의 복지증진을 위한 다양한 지원사업을 안내하는 서비스로, 생활지원, 의료지원, 교육지원 등 다양한 지원사업을 제공합니다.',
      source: {
        url: 'https://www.mohw.go.kr',
        name: '보건복지부'
      }
    }
  ]
};

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

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  const startChat = async () => {
    if (messages.length > 0) return;
    
    setIsLoading(true);
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
        actionCards: data.action_cards
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error starting chat:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: '죄송합니다. 채팅을 시작하는 중 오류가 발생했습니다.',
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
      console.error('전문가 타입이 지정되지 않았습니다.');
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
      // 이전 대화 내용을 포함한 메시지 배열 생성
      const conversationHistory = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // 대화 이력을 포함하여 API 호출
      const response = await fetch('http://localhost:8082/api/chatbot/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          expert_type: expertType
        })
      });

      const data = await response.json();
      console.log('서버 응답 데이터:', data);

      // 응답 텍스트에서 카드 정보 분리
      const { cleanContent, extractedCards } = extractCardInfoFromText(data.answer || '');
      
      // 서버 응답 카드 데이터 또는 텍스트에서 추출한 카드 데이터 사용
      const cardData = Array.isArray(data.cards) && data.cards.length > 0 
        ? data.cards 
        : extractedCards.length > 0 
          ? extractedCards 
          : generateCardsBasedOnExpertType(expertType, content);

      // 서버 응답 데이터 구조 확인
      const botMessage: Message = {
        id: uuidv4(),
        content: cleanContent || data.answer || '응답을 받지 못했습니다.',
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date(),
        cards: cardData
      };

      // 로그로 카드 데이터 확인
      console.log('최종 카드 데이터:', botMessage.cards);

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

  // 텍스트에서 카드 정보 추출하는 함수
  const extractCardInfoFromText = (text: string) => {
    let cleanContent = text;
    let extractedCards: any[] = [];

    // '###정보 카드' 또는 '---' 구분자가 있는지 확인
    if (text.includes('###정보 카드') || text.includes('---')) {
      const parts = text.includes('###정보 카드') 
        ? text.split('###정보 카드') 
        : text.split('---');
      
      cleanContent = parts[0].trim();
      
      // 구분자 이후 텍스트에서 JSON 형식의 카드 정보 추출 시도
      if (parts.length > 1) {
        const cardText = parts[1].trim();
        try {
          // 기본 카드 템플릿 생성
          const cardTemplate = {
            id: uuidv4(),
            title: '관련 정보',
            type: 'policy',
            summary: '챗봇이 제공하는 관련 정보입니다.',
            details: cardText,
          };
          
          extractedCards = [cardTemplate];
          
          // 만약 카드 텍스트에 JSON 형식이 포함되어 있으면 파싱 시도
          const jsonMatch = cardText.match(/\{[\s\S]*\}/) || cardText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              const jsonData = JSON.parse(jsonMatch[0]);
              if (Array.isArray(jsonData)) {
                extractedCards = jsonData;
              } else {
                extractedCards = [jsonData];
              }
            } catch (e) {
              console.warn('카드 JSON 파싱 실패, 기본 카드 템플릿 사용', e);
            }
          }
        } catch (e) {
          console.error('카드 정보 추출 중 오류 발생', e);
        }
      }
    }

    return { cleanContent, extractedCards };
  };

  // 전문가 유형에 따라 카드 생성
  const generateCardsBasedOnExpertType = (expertType: string, query: string) => {
    const expertTypeMap: Record<string, string> = {
      '장애인 정책': 'policy',
      '장애인 취업': 'employment',
      '장애인 복지': 'welfare',
      '장애인 창업': 'startup',
      '장애인 의료': 'medical',
      '장애인 교육': 'education',
      '전문 상담': 'counseling'
    };
    
    const cardType = expertTypeMap[expertType] || 'policy';
    
    // 기존 테스트 카드 데이터 사용
    if (testCards[cardType as keyof typeof testCards]) {
      return testCards[cardType as keyof typeof testCards];
    }
    
    // 기본 카드 생성 (테스트 데이터가 없는 경우)
    return [{
      id: uuidv4(),
      title: `${expertType} 관련 정보`,
      type: cardType,
      summary: `${expertType}와 관련된 정보를 제공합니다.`,
      details: `사용자 질문: "${query}"에 대한 ${expertType} 정보입니다. 자세한 정보는 관련 기관 웹사이트를 참조하세요.`,
      source: {
        name: '장애인 복지 정보 포털',
        url: 'https://www.bokjiro.go.kr/'
      }
    }];
  };

  return (
    <ChatContext.Provider value={{ isOpen, messages, isLoading, openChat, closeChat, startChat, sendMessage, setMessages }}>
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