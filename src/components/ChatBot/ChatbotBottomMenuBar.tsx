import React, { useState } from 'react';
import styles from './ChatbotBottomMenuBar.module.css';
import { useAuth } from '../../contexts/user/AuthProvider';
import ExpertService from './services/ExpertService';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onExpertSelect: (type: string) => void;
  currentExpertType: string;
}

const ChatbotBottomMenuBar: React.FC<Props> = ({ isOpen, onToggle, onExpertSelect, currentExpertType }) => {
  const { role } = useAuth();
  const expertCards = ExpertService.getExpertCardsByRole(role);
  const [isHovered, setIsHovered] = useState(false);

  // 현재 선택된 전문가 타입에서 접두사 "장애인 " 제거
  const getDisplayExpertType = (type: string) => {
    if (!type) return '전문가';
    return type.replace('장애인 ', '');
  };

  const renderCurrentExpertText = () => {
    if (!currentExpertType) {
      return '전문가를 선택해주세요.';
    }
    
    return (
      <>
        <span className={styles.expertName}>{getDisplayExpertType(currentExpertType)} </span> 전문가와 대화 중입니다.
      </>
    );
  };

  return (
    <div className={styles.menuBarWrapper}>
      <button
        className={styles.handleButton}
        onClick={onToggle}
        aria-label={isOpen ? '전문가 메뉴 닫기' : '전문가 메뉴 열기'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? 
          '다른 전문가의 도움이 필요하신가요?' : 
          renderCurrentExpertText()}
      </button>
      {isOpen && (
        <div className={styles.expertList}>
          {expertCards.map((expert) => (
            <div
              key={expert.id}
              className={`${styles.expertIconWrapper} ${expert.expert_type === currentExpertType ? styles.currentExpert : ''}`}
              onClick={() => onExpertSelect(expert.expert_type)}
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