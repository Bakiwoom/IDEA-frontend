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

  // 카드 데이터 로깅
  useEffect(() => {
    console.log('PolicyCard에 전달된 카드 데이터:', card);
  }, [card]);

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

  const getCardTypeClass = (type: string = 'policy') => {
    switch (type) {
      case 'policy':
        return styles.badgePolicy;
      case 'employment':
        return styles.badgeEmployment;
      case 'welfare':
        return styles.badgeWelfare;
      case 'startup':
        return styles.badgeStartup;
      case 'medical':
        return styles.badgeMedical;
      case 'education':
        return styles.badgeEducation;
      case 'counseling':
        return styles.badgeCounseling;
      default:
        return styles.badgeDefault;
    }
  };

  const getCardTypeIcon = (type: string = 'policy') => {
    switch (type) {
      case 'policy':
        return '📜';
      case 'employment':
        return '💼';
      case 'welfare':
        return '🏥';
      case 'startup':
        return '🚀';
      case 'medical':
        return '⚕️';
      case 'education':
        return '📚';
      case 'counseling':
        return '💬';
      default:
        return '📋';
    }
  };

  // 필드가 없는 경우 기본값 처리
  const title = card.title || '정보 없음';
  const summary = card.summary || '정보 요약이 없습니다.';
  const details = card.details || '상세 정보가 없습니다.';
  const type = card.type || 'policy';
  const subtitle = card.subtitle || '';
  const sourceName = card.source?.name || '출처 정보 없음';

  // 상세 내용 포맷팅 개선
  const formatDetails = (text: string) => {
    // URL을 하이퍼링크로 변환
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text
      .replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      // 특정 정보 구분을 위한 서식 개선
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')  // *강조* 텍스트
      .replace(/\n\n/g, '</p><p>') // 두 줄 바꿈을 단락으로
      .replace(/\n/g, '<br />'); // 한 줄 바꿈
  };

  const formattedDetails = formatDetails(details);

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardType}>
          <span className={getCardTypeClass(type)}>
            {getCardTypeIcon(type)} {type}
          </span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.summary}>{summary}</div>
        
        {isExpanded && (
          <div className={styles.details}>
            <div 
              className={styles.detailsContent} 
              dangerouslySetInnerHTML={{ __html: `<p>${formattedDetails}</p>` }}
            />
            
            {card.source && (
              <div className={styles.source}>
                {card.source.url && (
                  <a href={card.source.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                    🔗 {sourceName} 바로가기
                  </a>
                )}
                {card.source.email && (
                  <a href={`mailto:${card.source.email}`} className={styles.sourceLink}>
                    📧 이메일 문의: {card.source.email}
                  </a>
                )}
                {card.source.phone && (
                  <a href={`tel:${card.source.phone}`} className={styles.sourceLink}>
                    📞 전화 문의: {card.source.phone}
                  </a>
                )}
              </div>
            )}

            {card.buttons && card.buttons.length > 0 && (
              <div className={styles.buttons}>
                {card.buttons.map((btn, idx) => (
                  <a
                    key={idx}
                    href={btn.type === 'tel' ? `tel:${btn.value}` : 
                          btn.type === 'email' ? `mailto:${btn.value}` : 
                          btn.value}
                    target={btn.type === 'link' ? '_blank' : undefined}
                    rel={btn.type === 'link' ? 'noopener noreferrer' : undefined}
                    className={styles.button}
                    onClick={btn.type === 'share' ? () => navigator.share?.({ title: card.title, url: card.source?.url }) : undefined}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button 
        className={styles.expandButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? '상세 닫기' : '상세 보기'}
      </button>
    </div>
  );
};

export default PolicyCard; 