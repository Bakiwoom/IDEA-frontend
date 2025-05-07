import React from 'react';
import styles from './ChatbotBottomMenuBar.module.css';
import { getExpertCardsByRole } from './expertCardData';
import { useAuth } from '../../contexts/user/AuthProvider';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onExpertSelect: (type: string) => void;
  currentExpertType: string;
}

const ChatbotBottomMenuBar: React.FC<Props> = ({ isOpen, onToggle, onExpertSelect, currentExpertType }) => {
  const { role } = useAuth();
  const expertCards = getExpertCardsByRole(role);

  return (
    <div className={styles.menuBarWrapper}>
      <button
        className={styles.handleButton}
        onClick={onToggle}
        aria-label={isOpen ? '전문가 메뉴 닫기' : '전문가 메뉴 열기'}
      >
        다른 전문가의 도움이 필요하신가요?
      </button>
      {isOpen && (
        <div className={styles.expertList}>
          {expertCards.map((expert) => (
            <div
              key={expert.id}
              className={styles.expertIconWrapper}
              onClick={() => onExpertSelect(expert.title)}
              tabIndex={0}
              aria-label={expert.title}
            >
              <div className={styles.expertIcon}>{expert.icon}</div>
              <div className={styles.tooltip}>
                <strong>{expert.title}</strong>
                <div>{expert.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatbotBottomMenuBar; 