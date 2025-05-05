import React, { useState, useRef, useEffect, FormEvent, memo, useCallback } from 'react';
import { Message } from '../../types/chat';
import { useChat } from '../../contexts/ChatContext';
import styles from './ChatBot.module.css';
import { format } from 'date-fns';
import { ChatBotIcon } from '../Icons/ChatBotIcon';
import PolicyCard from '../Chatbot/PolicyCard';
import ChatbotBottomMenuBar from './ChatbotBottomMenuBar';

// Message 컴포넌트를 분리하고 메모이제이션 적용
const ChatMessage = memo(({ message, isUser }: { message: Message; isUser: boolean }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const cardsViewportRef = useRef<HTMLDivElement>(null);

  // 카드 데이터 디버깅
  useEffect(() => {
    if (message.cards && message.cards.length > 0) {
      console.log('메시지에 카드 데이터 있음:', message.cards);
    }
  }, [message.cards]);

  // 카드 인덱스 clamp 함수
  const clampIndex = (idx: number) => {
    if (!message.cards) return 0;
    return Math.max(0, Math.min(idx, message.cards.length - 1));
  };

  // 상세 펼침 인덱스 상태 추가
  const [expandedCardIndex, setExpandedCardIndex] = useState(-1);

  // handleIndicatorClick을 useCallback으로 감싸기
  const handleIndicatorClick = useCallback((idx: number) => {
    if (!message.cards) return;
    const containerWidth = cardsViewportRef.current?.offsetWidth || 0;
    setCurrentCardIndex(idx);
    setPrevTranslate(-(idx * containerWidth));
    setCurrentTranslate(-(idx * containerWidth));
    if (cardsViewportRef.current) {
      cardsViewportRef.current.style.transform = `translateX(${-idx * containerWidth}px)`;
    }
    setExpandedCardIndex(-1); // 카드 이동 시 상세 닫기
  }, [message.cards]);

  // Shift+휠로 카드 넘기기
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!message.cards || message.cards.length <= 1) return;
      if (!e.shiftKey) return;
      e.preventDefault();
      if (e.deltaY > 0 && currentCardIndex < message.cards.length - 1) {
        handleIndicatorClick(currentCardIndex + 1);
      } else if (e.deltaY < 0 && currentCardIndex > 0) {
        handleIndicatorClick(currentCardIndex - 1);
      }
    };
    const ref = cardsViewportRef.current;
    if (ref) {
      ref.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (ref) ref.removeEventListener('wheel', handleWheel);
    };
  }, [currentCardIndex, message.cards, handleIndicatorClick]);

  // 정규식을 사용하여 '---'나 '###정보 카드' 같은 구분자가 있는 경우 메시지 내용에서 분리
  const getCleanMessage = (content: string) => {
    // 구분자로 분리되어 있는 경우 첫 번째 부분만 반환
    if (content.includes('---')) {
      return content.split('---')[0].trim();
    }
    if (content.includes('###정보 카드')) {
      return content.split('###정보 카드')[0].trim();
    }
    return content;
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setDragged(false);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !message.cards) return;

    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 8) setDragged(true); // 8px 이상 움직이면 드래그로 간주
    const containerWidth = cardsViewportRef.current?.offsetWidth || 0;
    const cardCount = message.cards.length;

    // 현재 카드 인덱스 기준으로 이동
    let newTranslate = prevTranslate + diff;

    // translateX 한계값 계산
    const minTranslate = -((cardCount - 1) * containerWidth); // 마지막 카드
    const maxTranslate = 0; // 첫 카드

    // 한계값으로 clamp
    newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

    setCurrentTranslate(newTranslate);

    if (cardsViewportRef.current) {
      cardsViewportRef.current.style.transform = `translateX(${newTranslate}px)`;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || !message.cards) return;
    setIsDragging(false);

    const containerWidth = cardsViewportRef.current?.offsetWidth || 0;
    const moveThreshold = containerWidth * 0.1; // 10% 이상 드래그 시 카드 전환
    const diff = currentTranslate - prevTranslate;

    let newIndex = currentCardIndex;
    if (Math.abs(diff) > moveThreshold) {
      if (diff > 0 && currentCardIndex > 0) {
        newIndex = currentCardIndex - 1;
      } else if (diff < 0 && currentCardIndex < message.cards.length - 1) {
        newIndex = currentCardIndex + 1;
      }
    }
    newIndex = clampIndex(newIndex);

    // 새 위치로 부드럽게 이동
    const newTranslate = -(newIndex * containerWidth);
    setCurrentCardIndex(newIndex);
    setPrevTranslate(newTranslate);
    setCurrentTranslate(newTranslate);
    setExpandedCardIndex(-1); // 카드 이동 시 상세 닫기

    if (cardsViewportRef.current) {
      cardsViewportRef.current.style.transform = `translateX(${newTranslate}px)`;
    }
    setTimeout(() => setDragged(false), 0); // 드래그 종료 후 클릭 방지
  };

  // 카드가 바뀔 때 항상 0번 카드로 이동 및 translateX 초기화
  useEffect(() => {
    if (message.cards && message.cards.length > 0) {
      setCurrentCardIndex(0);
      setPrevTranslate(0);
      setCurrentTranslate(0);
      setExpandedCardIndex(-1); // 카드 바뀔 때 상세 닫기
      if (cardsViewportRef.current) {
        cardsViewportRef.current.style.transform = `translateX(0px)`;
      }
    }
  }, [message.cards]);

  useEffect(() => {
    const handleResize = () => {
      if (!message.cards || !cardsViewportRef.current) return;
      const containerWidth = cardsViewportRef.current.offsetWidth;
      const newTranslate = -(currentCardIndex * containerWidth);
      setPrevTranslate(newTranslate);
      setCurrentTranslate(newTranslate);
      cardsViewportRef.current.style.transform = `translateX(${newTranslate}px)`;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentCardIndex, message.cards]);

  const cleanContent = getCleanMessage(message.content);

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.userMessage : styles.botMessage}`}>
      {/* 메시지 말풍선 부분 */}
      {cleanContent && (
        <div className={styles.messageRow}>
          {!isUser && <ChatBotIcon />}
          <div className={styles.message}>
            <div className={styles.messageContent}>
              {cleanContent}
            </div>
          </div>
          <div className={styles.timestamp}>
            {format(new Date(message.timestamp), 'HH:mm')}
          </div>
        </div>
      )}
      
      {/* 카드 부분 - 별도 UI로 표시 */}
      {message.cards && message.cards.length > 0 && (
        <div className={styles.cardsContainer}>
          <div
            ref={cardsViewportRef}
            className={`${styles.cardsViewport} ${isDragging ? styles.dragging : ''}`}
            onMouseDown={handleDragStart}
            onMouseMove={isDragging ? handleDragMove : undefined}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={isDragging ? handleDragMove : undefined}
            onTouchEnd={handleDragEnd}
          >
            {message.cards.map((card, idx) => (
              <div key={card.id || Math.random().toString()} className={styles.cardItem}>
                <PolicyCard
                  card={card}
                  isDragging={isDragging}
                  isExpanded={expandedCardIndex === idx}
                  onExpand={(expanded) => {
                    if (expanded && !isDragging && !dragged) {
                      setExpandedCardIndex(idx);
                    } else if (!expanded) {
                      setExpandedCardIndex(-1);
                    }
                  }}
                />
              </div>
            ))}
          </div>
          {message.cards.length > 1 && (
            <div className={styles.cardIndicators}>
              {message.cards.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.cardIndicator} ${index === currentCardIndex ? styles.active : ''}`}
                  onClick={() => handleIndicatorClick(index)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

// 입력 컴포넌트 분리
const ChatInput = memo(({ 
  isLoading, 
  onSendMessage,
  currentExpertType 
}: { 
  isLoading: boolean;
  onSendMessage: (message: string, expertType: string) => void;
  currentExpertType: string;
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading && currentExpertType) {
      onSendMessage(inputMessage.trim(), currentExpertType);
      setInputMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className={styles.input}
          disabled={isLoading || !currentExpertType}
          aria-label="메시지 입력"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim() || !currentExpertType}
          className={`${styles.sendButton} ${inputMessage.trim() ? styles.active : ''}`}
          aria-label="메시지 전송"
        >
          전송
        </button>
      </div>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';

interface ExpertQuestion {
  id: string;
  question: string;
  expert_type: string;
  category?: string;
}

const ChatBot: React.FC = () => {
  const { isOpen, messages, isLoading, closeChat, sendMessage, startChat, setMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // localStorage에서 테마 설정을 가져오거나, 시스템 설정을 사용
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isLargeFont, setIsLargeFont] = useState<boolean>(() => {
    const savedSize = localStorage.getItem('fontSize');
    return savedSize ? savedSize === '2' : false;
  });

  // 크기 조절 상태 관리
  const [size, setSize] = useState({
    width: localStorage.getItem('chatWidth') || '400px',
    height: localStorage.getItem('chatHeight') || '600px'
  });

  const [currentExpertType, setCurrentExpertType] = useState<string>('');
  const [showTutorial, setShowTutorial] = useState(true);
  const [isExpertBarOpen, setIsExpertBarOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setIsClosing(false);
      startChat(); // 채팅 시작 시 전문가 카드 로드
    }
  }, [isOpen, startChat]);

  // 채팅 시작 시 한 번만 실행되는 useEffect
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startChat();
    }
  }, [isOpen, messages.length, startChat]);

  useEffect(() => {
    // 테마 변경 시 localStorage에 저장하고 data-theme 속성 업데이트
    const theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', isLargeFont ? '2' : '1');
    document.documentElement.setAttribute('data-font-scale', isLargeFont ? '2' : '1');
  }, [isLargeFont]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 첫 방문 시 튜토리얼 표시 (isFirstVisit 제거, showTutorial만 사용)
  useEffect(() => {
    if (!localStorage.getItem('chatbot_visited') && isOpen) {
      localStorage.setItem('chatbot_visited', 'true');
      setShowTutorial(true);
    }
  }, [isOpen]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleResize = () => {
    if (chatContainerRef.current) {
      const { width, height } = chatContainerRef.current.getBoundingClientRect();
      setSize({ width: `${width}px`, height: `${height}px` });
      localStorage.setItem('chatWidth', `${width}px`);
      localStorage.setItem('chatHeight', `${height}px`);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsAnimating(false);
      closeChat();
    }, 400);
  };

  const toggleFontSize = () => {
    setIsLargeFont(prev => !prev);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // 튜토리얼 닫기
  const closeTutorial = () => {
    setShowTutorial(false);
  };

  // 전문가 선택 시 인사말 개선
  const handleExpertSelect = (expertType: string) => {
    // '정책', '정책 전문가', '장애인 정책' 등 모두 '정책 전문가'로 통일
    const normalizedType = ['정책', '정책 전문가', '장애인 정책'].includes(expertType) ? '정책 전문가' : expertType;
    const introMessage = getExpertGreeting(normalizedType);
    const followUpMessage: Message = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      content: '어떤 도움이 필요하신가요? 아래 예시 질문을 선택하거나 직접 질문해 주세요.',
      sender: 'bot' as const,
      role: 'assistant' as const,
      timestamp: new Date(),
      exampleQuestions: getExampleQuestions(normalizedType)
    };

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        content: introMessage,
        sender: 'bot' as const,
        role: 'assistant' as const,
        timestamp: new Date(),
      },
      followUpMessage
    ]);
  };

  const getExpertGreeting = (expertType: string): string => {
    const expertIntro: Record<string, string> = {
      '장애인 취업': '안녕하세요! 장애인 취업 전문가입니다. 취업 준비부터 일자리 매칭까지, 어떤 도움이 필요하신가요?',
      '장애인 복지': '안녕하세요! 장애인 복지 전문가입니다. 장애인 수당, 지원금, 혜택 등 복지 정책에 대해 상세히 안내해드립니다.',
      '장애인 창업': '안녕하세요! 장애인 창업 지원 전문가입니다. 창업 준비부터 지원금 신청까지, 어떤 도움이 필요하신가요?',
      '장애인 의료': '안녕하세요! 장애인 의료 전문가입니다. 의료비 지원, 재활치료, 보조기기 지원 등 의료 관련 혜택에 대해 안내해드립니다.',
      '장애인 교육': '안녕하세요! 장애인 교육 전문가입니다. 교육 지원금, 특수교육, 평생교육 등 교육 관련 혜택에 대해 안내해드립니다.',
      '전문 상담': '안녕하세요! 장애인 전문 상담사입니다. 심리 상담, 진로 상담, 가족 상담 등 어떤 상담이 필요하신가요?'
    };
    return expertIntro[expertType] || '안녕하세요! 어떤 도움이 필요하신가요?';
  };

  const getExampleQuestions = (expertType: string): ExpertQuestion[] => {
    const questions: Record<string, string[]> = {
      '정책 전문가': [
        '장애인 관련 법률은 어떤 것이 있나요?',
        '장애인 정책 지원 제도는 무엇이 있나요?',
        '장애인 권리 보장에 대해 알려주세요'
      ],
      '장애인 취업': [
        '장애인 취업 지원금은 어떻게 신청하나요?',
        '장애인 취업 상담은 어디서 받을 수 있나요?',
        '장애인 일자리 매칭 서비스는 어떻게 이용하나요?'
      ],
      '장애인 복지': [
        '장애인 수당은 얼마나 받을 수 있나요?',
        '장애인 지원금 신청 방법을 알려주세요',
        '장애인 혜택은 어떤 것들이 있나요?'
      ],
      '장애인 창업': [
        '장애인 창업 지원금 신청 방법을 알려주세요',
        '장애인 창업 교육 프로그램은 어디서 받을 수 있나요?',
        '장애인 창업 컨설팅은 어떻게 받을 수 있나요?'
      ],
      '장애인 의료': [
        '장애인 의료비 지원은 어떻게 받을 수 있나요?',
        '재활치료 지원금은 얼마나 받을 수 있나요?',
        '보조기기 지원은 어떻게 신청하나요?'
      ],
      '장애인 교육': [
        '장애인 교육 지원금은 어떻게 신청하나요?',
        '특수교육 프로그램은 어디서 받을 수 있나요?',
        '장애인 평생교육 프로그램을 추천해주세요'
      ],
      '전문 상담': [
        '심리 상담은 어디서 받을 수 있나요?',
        '진로 상담 프로그램을 추천해주세요',
        '가족 상담은 어떻게 받을 수 있나요?'
      ]
    };

    return (questions[expertType] || []).map((question, index) => ({
      id: `question-${index}`,
      question,
      expert_type: expertType
    }));
  };

  // 전문가 바 토글
  const toggleExpertBar = () => setIsExpertBarOpen((prev) => !prev);

  // 메뉴바에서 전문가 선택 시 대화 초기화
  const handleExpertSelectFromBar = (expertType: string) => {
    setCurrentExpertType(expertType);
    const introMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      content: getExpertGreeting(expertType),
      sender: 'bot' as const,
      role: 'assistant' as const,
      timestamp: new Date(),
    };
    const followUpMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      content: '어떤 도움이 필요하신가요? 아래 예시 질문을 선택하거나 직접 질문해 주세요.',
      sender: 'bot' as const,
      role: 'assistant' as const,
      timestamp: new Date(),
      exampleQuestions: getExampleQuestions(expertType)
    };
    setMessages([introMessage, followUpMessage]);
    setIsExpertBarOpen(false);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      ref={chatContainerRef}
      className={`${styles.chatContainer} ${isAnimating ? styles.visible : ''} ${isClosing ? styles.closing : ''}`}
      style={{ width: size.width, height: size.height }}
      onTransitionEnd={() => setIsAnimating(false)}
    >
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.chatbotIcon} aria-label="챗봇 아이콘">
          <img
            src="/images/chatbot.png"
            alt="챗봇"
            width="28"
            height="28"
          />
        </div>
        <div className={styles.headerControls}>
          <button
            onClick={toggleFontSize}
            className={styles.fontSizeButton}
            aria-label={isLargeFont ? '글자 크기 작게' : '글자 크기 크게'}
          >
            {isLargeFont ? '글자 작게' : '글자 크게'}
          </button>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="대화창 닫기"
          >
            ✕
          </button>
        </div>
      </div>
      {/* 메시지 영역 */}
      <div className={styles.messageArea} role="log" aria-live="polite">
        {messages.map((message: Message) => (
          <div key={message.id}>
            <ChatMessage 
              message={message} 
              isUser={message.sender === 'user'} 
            />
            {message.actionCards && message.actionCards.length > 0 && (
              <div className={styles.expertCards}>
                {message.actionCards.map((card) => (
                  <div
                    key={card.id}
                    className={styles.expertCard}
                    onClick={() => handleExpertSelect(card.expert_type)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleExpertSelect(card.expert_type);
                      }
                    }}
                  >
                    <div className={styles.expertIcon}>{card.icon}</div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                ))}
              </div>
            )}
            {message.exampleQuestions && message.exampleQuestions.length > 0 && (
              <div className={styles.exampleQuestions}>
                <h3 className={styles.exampleQuestionsTitle}>자주 묻는 질문</h3>
                <div className={styles.questionsList}>
                  {message.exampleQuestions.map((question) => (
                    <button
                      key={question.id}
                      className={styles.questionButton}
                      onClick={() => {
                        setCurrentExpertType(question.expert_type);
                        sendMessage(question.question, question.expert_type);
                      }}
                    >
                      {question.question}
                      {question.category && (
                        <span className={styles.questionCategory}>#{question.category}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className={styles.loadingWrapper} aria-label="메시지 전송 중">
            <div className={styles.loadingDots}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* 하단 고정: 전문가 메뉴바 + 입력창 */}
      <div className={styles.inputAreaWrapper}>
        <ChatbotBottomMenuBar
          isOpen={isExpertBarOpen}
          onToggle={toggleExpertBar}
          onExpertSelect={handleExpertSelectFromBar}
          currentExpertType={currentExpertType}
        />
        <ChatInput
          isLoading={isLoading}
          onSendMessage={sendMessage}
          currentExpertType={currentExpertType}
        />
      </div>
      {/* 튜토리얼 오버레이 */}
      {showTutorial && (
        <div className={styles.tutorialOverlay}>
          <div className={styles.tutorialContent}>
            <h3>챗봇 사용 가이드</h3>
            <p>1. 원하는 전문가를 선택해주세요</p>
            <p>2. 예시 질문을 선택하거나 직접 질문해주세요</p>
            <p>3. 전문가가 상세한 답변을 제공해드립니다</p>
            <button onClick={closeTutorial}>시작하기</button>
          </div>
        </div>
      )}

      <div className={styles.resizeHandle} onMouseDown={(e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = chatContainerRef.current?.offsetWidth || 0;
        const startHeight = chatContainerRef.current?.offsetHeight || 0;
        const containerRight = chatContainerRef.current?.getBoundingClientRect().right || 0;
        const containerBottom = chatContainerRef.current?.getBoundingClientRect().bottom || 0;

        const handleMouseMove = (e: MouseEvent) => {
          if (chatContainerRef.current) {
            // 마우스 이동 거리 계산
            const dx = startX - e.clientX;
            const dy = startY - e.clientY;
            
            // 새로운 너비와 높이 계산 (최소/최대 크기 제한 적용)
            const newWidth = Math.min(
              Math.max(320, startWidth + dx),
              window.innerWidth * 0.9
            );
            const newHeight = Math.min(
              Math.max(400, startHeight + dy),
              window.innerHeight * 0.9
            );

            // 우측 하단 기준으로 위치 유지
            const newRight = containerRight;
            const newBottom = containerBottom;

            // 스타일 적용
            chatContainerRef.current.style.width = `${newWidth}px`;
            chatContainerRef.current.style.height = `${newHeight}px`;
            chatContainerRef.current.style.right = `${window.innerWidth - newRight}px`;
            chatContainerRef.current.style.bottom = `${window.innerHeight - newBottom}px`;
          }
        };
        
        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          handleResize();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }} />
    </div>
  );
};

export default ChatBot; 