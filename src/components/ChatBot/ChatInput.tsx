import React, { useState, FormEvent, memo } from 'react';
import styles from './ChatBot.module.css';

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
    if (inputMessage.trim() && !isLoading) {
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
          disabled={isLoading}
          aria-label="메시지 입력"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
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
export default ChatInput; 