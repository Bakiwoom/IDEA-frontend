import React from 'react';
import styles from './ChatbotBottomMenuBar.module.css';

interface ExpertType {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EXPERTS: ExpertType[] = [
  { type: '정책 전문가', icon: <span role="img" aria-label="정책">📄</span>, title: '정책 전문가', description: '장애인 관련 법률 및 제도 안내' },
  { type: '장애인 취업', icon: <span role="img" aria-label="취업">💼</span>, title: '장애인 취업', description: '취업 지원, 일자리 매칭, 상담' },
  { type: '장애인 복지', icon: <span role="img" aria-label="복지">🏥</span>, title: '장애인 복지', description: '수당, 지원금, 복지 혜택' },
  { type: '장애인 창업', icon: <span role="img" aria-label="창업">🚀</span>, title: '장애인 창업', description: '창업 지원, 교육, 컨설팅' },
  { type: '장애인 의료', icon: <span role="img" aria-label="의료">⚕️</span>, title: '장애인 의료', description: '의료비, 재활, 보조기기' },
  { type: '장애인 교육', icon: <span role="img" aria-label="교육">📚</span>, title: '장애인 교육', description: '교육 지원, 특수교육, 평생교육' },
  { type: '전문 상담', icon: <span role="img" aria-label="상담">💬</span>, title: '전문 상담', description: '심리, 진로, 가족 상담' },
];

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onExpertSelect: (type: string) => void;
  currentExpertType: string;
}

const ChatbotBottomMenuBar: React.FC<Props> = ({ isOpen, onToggle, onExpertSelect, currentExpertType }) => {
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
          {EXPERTS.map((expert) => (
            <div
              key={expert.type}
              className={styles.expertIconWrapper}
              onClick={() => onExpertSelect(expert.type)}
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