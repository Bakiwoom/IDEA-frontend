import React from 'react';
import styles from './ChatBot.module.css';

interface TutorialOverlayProps {
  show: boolean;
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className={styles.tutorialOverlay}>
      <div className={styles.tutorialContent}>
        <h3>챗봇 사용 가이드</h3>
        <p>1. 원하는 전문가를 선택해주세요</p>
        <p>2. 예시 질문을 선택하거나 직접 질문해주세요</p>
        <p>3. 전문가가 상세한 답변을 제공해드립니다</p>
        <button onClick={onClose}>시작하기</button>
      </div>
    </div>
  );
};

export default TutorialOverlay; 