import React from 'react';
import styles from './ChatBotIcon.module.css';

export const ChatBotIcon: React.FC = () => {
  return (
    <img
      src="/images/chatbot.png"
      alt="챗봇"
      className={styles.icon}
      width="24"
      height="24"
    />
  );
}; 