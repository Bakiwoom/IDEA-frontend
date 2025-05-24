import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import styles from './ChatBot.module.css';
import { format } from 'date-fns';
import { ChatBotIcon } from '../Icons/ChatBotIcon';
import Card from './Card';
import { Message, Card as CardType } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = memo(({ message, isUser }: { message: Message; isUser: boolean }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const cardsViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message.cards && message.cards.length > 0) {
      const missingFields = message.cards
        .map((card, idx) => {
          const missing = [];
          if (!card.id) missing.push('id');
          if (!card.title) missing.push('title');
          if (!card.summary) missing.push('summary');
          if (!card.details) missing.push('details');
          if (!card.type) missing.push('type');
          return missing.length > 0 ? `카드 ${idx}: ${missing.join(', ')} 필드 누락` : null;
        })
        .filter(Boolean);
      if (missingFields.length > 0) {
        console.warn('카드 데이터에 필수 필드 누락:', missingFields);
      }
    }
  }, [message.cards]);

  const clampIndex = (idx: number) => {
    if (!message.cards) return 0;
    return Math.max(0, Math.min(idx, message.cards.length - 1));
  };

  const [expandedCardIndex, setExpandedCardIndex] = useState(-1);

  const handleIndicatorClick = useCallback((idx: number) => {
    if (!message.cards) return;
    const containerWidth = cardsViewportRef.current?.offsetWidth || 0;
    setCurrentCardIndex(idx);
    setPrevTranslate(-(idx * containerWidth));
    setCurrentTranslate(-(idx * containerWidth));
    if (cardsViewportRef.current) {
      cardsViewportRef.current.style.transform = `translateX(${-idx * containerWidth}px)`;
    }
    setExpandedCardIndex(-1);
  }, [message.cards]);

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

  const getCleanMessage = (content: string) => {
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
    if (Math.abs(diff) > 8) setDragged(true);
    const containerWidth = cardsViewportRef.current?.offsetWidth || 0;
    const cardCount = message.cards.length;
    let newTranslate = prevTranslate + diff;
    const minTranslate = -((cardCount - 1) * containerWidth);
    const maxTranslate = 0;
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
    const moveThreshold = containerWidth * 0.1;
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
    const newTranslate = -(newIndex * containerWidth);
    setCurrentCardIndex(newIndex);
    setPrevTranslate(newTranslate);
    setCurrentTranslate(newTranslate);
    setExpandedCardIndex(-1);
    if (cardsViewportRef.current) {
      cardsViewportRef.current.style.transform = `translateX(${newTranslate}px)`;
    }
    setTimeout(() => setDragged(false), 0);
  };

  useEffect(() => {
    if (message.cards && message.cards.length > 0) {
      setCurrentCardIndex(0);
      setPrevTranslate(0);
      setCurrentTranslate(0);
      setExpandedCardIndex(-1);
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
      {cleanContent && (
        <div className={styles.messageRow}>
          {!isUser && <ChatBotIcon />}
          <div className={styles.message}>
            <div className={styles.messageContent}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {cleanContent}
              </ReactMarkdown>
            </div>
          </div>
          <div className={styles.timestamp}>
            {format(new Date(message.timestamp), 'HH:mm')}
          </div>
        </div>
      )}
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
            {message.cards.map((card: CardType, idx: number) => (
              <div key={card.id || `card-${idx}-${Date.now()}`} className={styles.cardItem}>
                <Card
                  card={{
                    id: card.id || `card-${idx}-${Date.now()}`,
                    title: card.title || '제목 없음',
                    subtitle: card.subtitle,
                    summary: card.summary || '내용 요약 없음',
                    type: card.type || '',
                    details: card.details || card.summary || '상세 내용 없음',
                    source: card.source,
                    buttons: card.buttons
                  }}
                  isDragging={isDragging}
                  isExpanded={expandedCardIndex === idx}
                  onExpand={(expanded) => {
                    if (expanded && !isDragging && !dragged) {
                      setExpandedCardIndex(idx);
                    } else if (!expanded) {
                      setExpandedCardIndex(-1);
                    }
                  }}
                  dragged={dragged}
                />
              </div>
            ))}
          </div>
          {message.cards.length > 1 && (
            <div className={styles.cardIndicators}>
              {message.cards.map((_: CardType, index: number) => (
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
export default ChatMessage; 