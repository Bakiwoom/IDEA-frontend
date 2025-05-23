import React from 'react';
import styles from './ChatBot.module.css';

interface ExpertCardType {
  id: string;
  expert_type: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface ExpertCardsProps {
  cards: ExpertCardType[];
  onSelect: (expertType: string) => void;
  role?: string;
}

const ExpertCards: React.FC<ExpertCardsProps> = ({ cards, onSelect, role }) => {
  if (!role || !cards || cards.length === 0) return null;
  return (
    <div className={styles.expertCards}>
      {cards.map((card) => (
        <div
          key={card.id}
          className={styles.expertCard}
          onClick={() => onSelect(card.expert_type)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelect(card.expert_type);
            }
          }}
        >
          <div className={styles.expertIcon}>{card.icon}</div>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ExpertCards; 