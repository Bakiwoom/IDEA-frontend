import React, { useState, useEffect } from 'react';
import { PolicyCard as PolicyCardType } from '../../types/chat';
import styles from './PolicyCard.module.css';

interface PolicyCardProps {
  card: PolicyCardType;
  isDragging?: boolean;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ card, isDragging }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (card.source?.url) {
        try {
          const url = new URL(card.source.url);
          const defaultThumbnail = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
          setThumbnailUrl(defaultThumbnail);
        } catch (error) {
          console.error('Error processing URL:', error);
          setThumbnailUrl('/images/policy-default.jpg');
        }
      } else {
        setThumbnailUrl('/images/policy-default.jpg');
      }
    };

    fetchThumbnail();
  }, [card.source?.url]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    if ((e.target as HTMLElement).tagName === 'A') return;
    
    const dx = Math.abs(e.clientX - (dragStart?.x || 0));
    const dy = Math.abs(e.clientY - (dragStart?.y || 0));
    const dragDistance = Math.sqrt(dx * dx + dy * dy);
    
    if (dragDistance < 5) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div 
      className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      <div className={styles.imageContainer}>
        <img 
          src={thumbnailUrl || '/images/policy-default.jpg'} 
          alt=""
          className={styles.cardImage}
          onError={() => setThumbnailUrl('/images/policy-default.jpg')}
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{card.title}</h3>
        <div className={styles.summary}>{card.summary}</div>
        {isExpanded && (
          <div className={styles.details}>{card.details}</div>
        )}
        {card.source && (
          <div className={styles.source}>
            <a 
              href={card.source.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              출처: {card.source.name} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyCard; 