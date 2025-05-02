import React, { useState, useRef, useEffect, FormEvent, memo } from 'react';
import { Message } from '../../types/chat';
import { useChat } from '../../contexts/ChatContext';
import styles from './ChatBot.module.css';
import { format } from 'date-fns';
import { ChatBotIcon } from '../Icons/ChatBotIcon';
import PolicyCard from './PolicyCard';

// Message 컴포넌트를 분리하고 메모이제이션 적용
const ChatMessage = memo(({ message, isUser }: { message: Message; isUser: boolean }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const cardsViewportRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
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
    const containerWidth = cardsViewportRef.current?.offsetWidth || 0;
    
    // 드래그 거리 제한
    const maxDrag = containerWidth * 0.3;
    const limitedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag);
    
    const newTranslate = prevTranslate + limitedDiff;
    setCurrentTranslate(newTranslate);
    
    if (cardsViewportRef.current) {
      cardsViewportRef.current.style.transform = `translateX(${newTranslate}px)`;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || !message.cards) return;
    setIsDragging(false);

    const containerWidth = cardsViewportRef.current?.offsetWidth || 0;
    const moveThreshold = containerWidth * 0.2; // 20% 이상 드래그 시 카드 전환
    const diff = currentTranslate - prevTranslate;

    let newIndex = currentCardIndex;
    if (Math.abs(diff) > moveThreshold) {
      if (diff > 0 && currentCardIndex > 0) {
        newIndex = currentCardIndex - 1;
      } else if (diff < 0 && currentCardIndex < message.cards.length - 1) {
        newIndex = currentCardIndex + 1;
      }
    }

    // 새 위치로 부드럽게 이동
    const newTranslate = -(newIndex * containerWidth);
    setCurrentCardIndex(newIndex);
    setPrevTranslate(newTranslate);
    setCurrentTranslate(newTranslate);
    
    if (cardsViewportRef.current) {
      cardsViewportRef.current.style.transform = `translateX(${newTranslate}px)`;
    }
  };

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

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.userMessage : styles.botMessage}`}>
      <div className={styles.messageRow}>
        {!isUser && <ChatBotIcon />}
        <div className={styles.message}>
          <div className={styles.messageContent}>
            {message.content}
          </div>
        </div>
        <div className={styles.timestamp}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>
      </div>
      
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
            {message.cards.map((card) => (
              <div key={card.id} className={styles.cardItem}>
                <PolicyCard card={card} isDragging={isDragging} />
              </div>
            ))}
          </div>
          {message.cards.length > 1 && (
            <div className={styles.cardIndicators}>
              {message.cards.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.cardIndicator} ${index === currentCardIndex ? styles.active : ''}`}
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
  onSendMessage 
}: { 
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
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
          disabled={isLoading}
          aria-label="메시지 입력"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className={styles.sendButton}
          aria-label="메시지 전송"
        >
          전송
        </button>
      </div>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';

const ChatBot: React.FC = () => {
  const { isOpen, messages, isLoading, closeChat, sendMessage } = useChat();
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

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setIsClosing(false);
    }
  }, [isOpen]);

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

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      ref={chatContainerRef}
      className={`${styles.chatContainer} ${isAnimating ? styles.visible : ''} ${isClosing ? styles.closing : ''}`}
      style={{ width: size.width, height: size.height }}
      onTransitionEnd={() => setIsAnimating(false)}
    >
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

      <div 
        className={styles.messageArea}
        role="log"
        aria-live="polite"
      >
        {messages.map((message: Message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isUser={message.sender === 'user'} 
          />
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

      <ChatInput isLoading={isLoading} onSendMessage={sendMessage} />

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