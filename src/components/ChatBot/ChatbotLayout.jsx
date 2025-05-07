import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import styles from './ChatbotLayout.module.css';

const ChatbotLayout = ({ children }) => {
  const { openChat, isOpen } = useChat();
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const mouseDownPos = useRef({ x: 0, y: 0 });

  // 저장된 위치 불러오기
  useEffect(() => {
    const savedPosition = localStorage.getItem('chatbotPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('chatbotPosition', JSON.stringify(position));
      // 클릭과 드래그 구분 (5px 이하 이동이면 클릭으로 간주)
      const dx = Math.abs(e.clientX - mouseDownPos.current.x);
      const dy = Math.abs(e.clientY - mouseDownPos.current.y);
      if (dx < 5 && dy < 5) {
        openChat();
      }
    }
  };

  // 전역 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  return (
    <div className={styles.chatbotLayout}>
      {children}
      {!isOpen && (
        <div
          className={`${styles.chatbotContainer} ${isDragging ? styles.dragging : ''}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
          onMouseDown={handleMouseDown}
        >
          <img
            src="/images/chatbot.png"
            alt="챗봇"
            className={styles.chatbotIcon}
            style={{ pointerEvents: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotLayout; 