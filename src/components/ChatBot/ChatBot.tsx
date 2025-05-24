import React, { useState, useRef, useEffect, FormEvent, memo, useCallback } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import styles from './ChatBot.module.css';
import ChatbotBottomMenuBar from './ChatbotBottomMenuBar';
import { useAuth } from '../../contexts/user/AuthProvider';
import ExpertService, { ExpertQuestion } from './services/ExpertService';
import { Message, Card as CardType } from '../../types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ExpertCards from './ExpertCards';
import ExampleQuestions from './ExampleQuestions';
import TutorialOverlay from './TutorialOverlay';
import { withPerformanceTracking, useComponentUpdateTracking, measureRenderTime } from '../../utils/performance';

const ChatBot: React.FC = () => {
  const { isOpen, messages, isLoading, closeChat, sendMessage, startChat, setMessages, pendingAction, handleUserInputForAction, setPendingAction } = useChat();
  const { role, authUser } = useAuth();
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
  const [actionCardsPatched, setActionCardsPatched] = useState(false);
  const navigate = useNavigate();
  const [showSignUpChoice, setShowSignUpChoice] = useState(false);

  // 로그인 안내 메시지
  const loginGuideMessage: Message = {
    id: 'login-guide',
    content: '전문가와의 상담은 로그인 후 이용하실 수 있습니다.\n\n로그인이 필요하거나 회원 정보가 없으신 경우 회원가입을 진행해 주세요.',
    sender: 'bot',
    role: 'assistant',
    timestamp: new Date(),
    actionCards: [],
    exampleQuestions: [
      { id: 'login-1', expert_type: '', question: '로그인 하러 가기', category: '로그인' },
      { id: 'login-2', expert_type: '', question: '회원가입 하러 가기', category: '회원가입' }
    ]
  };

  // 컴포넌트 업데이트 추적
  useComponentUpdateTracking('ChatBot', { isOpen, messages, isLoading });
  
  // 렌더링 시간 측정
  const measureRender = measureRenderTime('ChatBot');
  
  useEffect(() => {
    measureRender();
  });

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setIsClosing(false);
      if (role) {
        startChat(); // 로그인한 경우에만 실행
      }
    }
  }, [isOpen, startChat, role]);

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

  const expertCards = ExpertService.getExpertCardsByRole(role);

  console.log('현재 role:', role, 'expertCards:', expertCards);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      console.log('messages[0].actionCards:', messages[0].actionCards);
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

  // 전문가 선택 핸들러 수정
  const handleExpertSelect = (expertType: string) => {
    // ExpertService를 사용하여 전문가 타입 정규화
    const normalizedType = ExpertService.normalizeExpertType(expertType);
    setCurrentExpertType(normalizedType);
    
    // ExpertService를 사용하여 환영 메시지 생성
    const welcomeMessages = ExpertService.getExpertWelcomeMessages(normalizedType, role);
    setMessages(welcomeMessages);
  };

  // 예시 질문 클릭 핸들러 수정
  const handleExampleQuestionClick = (question: ExpertQuestion) => {
    setCurrentExpertType(question.expert_type);
    sendMessage(question.question, question.expert_type);
  };

  // 전문가 바 토글
  const toggleExpertBar = () => setIsExpertBarOpen((prev) => !prev);

  // 메뉴바에서 전문가 선택 시 대화 초기화
  const handleExpertSelectFromBar = (expertType: string) => {
    // ExpertService를 사용하여 전문가 타입 정규화 및 메시지 생성
    const normalizedType = ExpertService.normalizeExpertType(expertType);
    setCurrentExpertType(normalizedType);
    
    const welcomeMessages = ExpertService.getExpertWelcomeMessages(normalizedType, role);
    setMessages(welcomeMessages);
    setIsExpertBarOpen(false);
  };

  useEffect(() => {
    if (
      isOpen &&
      !actionCardsPatched &&
      messages.length === 1 &&
      messages[0].actionCards &&
      JSON.stringify(messages[0].actionCards) !== JSON.stringify(expertCards)
    ) {
      setMessages(prev => [
        {
          ...prev[0],
          actionCards: expertCards
        }
      ]);
      setActionCardsPatched(true);
    }
  }, [isOpen, expertCards, actionCardsPatched, messages, setMessages]);

  // 챗봇을 닫을 때 플래그 초기화
  useEffect(() => {
    if (!isOpen && actionCardsPatched) {
      setActionCardsPatched(false);
    }
  }, [isOpen, actionCardsPatched]);

  // role이 바뀔 때마다 messages를 올바른 actionCards로 강제 초기화
  useEffect(() => {
    if (!role) {
      setMessages([
        loginGuideMessage
      ]);
    } else {
      setMessages([
        {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
          content: '원하시는 서비스를 선택해주세요.',
          sender: 'bot',
          role: 'assistant',
          timestamp: new Date(),
          actionCards: ExpertService.getExpertCardsByRole(role)
        }
      ]);
    }
    setActionCardsPatched(false);
  }, [role, setMessages]);

  // 메시지 응답 처리
  const handleMessageResponse = (message: Message) => {
    if (message.action && message.action.type === "navigate") {
      const targetUrl = message.action.target;
      const keyword = message.action.keyword || "장애인";
      navigate(`${targetUrl}&keyword=${encodeURIComponent(keyword)}`);
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = async (message: string, expertType: string) => {
    try {
      await sendMessage(message, expertType);
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.action) {
        handleMessageResponse(lastMessage);
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content: "죄송합니다. 요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        sender: 'bot',
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
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
            <ExpertCards
              cards={message.actionCards || []}
              onSelect={handleExpertSelect}
              role={role}
            />
            <ExampleQuestions
              questions={message.exampleQuestions || []}
              onClick={handleExampleQuestionClick}
              role={role}
              setShowSignUpChoice={setShowSignUpChoice}
            />
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
      {/* 회원가입 선택 모달 */}
      {showSignUpChoice && (
        <div className={styles.signUpChoiceModal}>
          <div className={styles.signUpChoiceContent}>
            <h3 className={styles.signUpChoiceTitle}>회원가입 유형 선택</h3>
            <button
              className={styles.questionButton}
              onClick={() => { setShowSignUpChoice(false); window.location.href = '/user/userSignUpPage'; }}
            >
              개인 회원가입
            </button>
            <button
              className={styles.questionButton}
              onClick={() => { setShowSignUpChoice(false); window.location.href = '/user/vendorSignUpPage'; }}
            >
              기업 회원가입
            </button>
            <button
              className={styles.questionButton}
              onClick={() => setShowSignUpChoice(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}
      
      {/* 하단 고정: 전문가 메뉴바 + 입력창 */}
      <div className={styles.inputAreaWrapper}>
        {/* 전문가 메뉴바: 로그인한 경우에만 노출 */}
        {role && (
          <ChatbotBottomMenuBar
            isOpen={isExpertBarOpen}
            onToggle={toggleExpertBar}
            onExpertSelect={handleExpertSelectFromBar}
            currentExpertType={currentExpertType}
          />
        )}
        <ChatInput
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          currentExpertType={currentExpertType}
        />
      </div>
      {/* 튜토리얼 오버레이 */}
      <TutorialOverlay show={showTutorial} onClose={closeTutorial} />

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

export default withPerformanceTracking(ChatBot); 