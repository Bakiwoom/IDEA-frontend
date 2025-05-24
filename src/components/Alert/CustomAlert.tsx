import React, { useState, useEffect } from 'react';
import styles from './CustomAlert.module.css';

// Alert 컴포넌트 props 타입 정의
interface CustomAlertProps {
  message: string;
  buttonText?: string;
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info' | 'warning';
  autoCloseTime?: number; // 자동 닫힘 시간 (ms), 0이면 자동 닫힘 없음
}

// 커스텀 알림창 컴포넌트
const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  buttonText = '확인',
  isOpen,
  onClose,
  type = 'info',
  autoCloseTime = 0,
}) => {
  // 모달 애니메이션 제어를 위한 상태
  const [isVisible, setIsVisible] = useState(false);

  // 자동 닫힘 기능
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      // 자동 닫힘 설정이 있으면 타이머 설정
      if (autoCloseTime > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseTime);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoCloseTime]);

  // 닫기 핸들러: 애니메이션 후 onClose 호출
  const handleClose = () => {
    setIsVisible(false);
    
    // CSS 애니메이션 시간만큼 기다린 후 onClose 호출
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 모달이 닫혀있으면 렌더링 안함
  if (!isOpen) return null;

  return (
    <div className={`${styles.alertOverlay} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.alertContainer} ${styles[type]} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.alertContent}>
          <div className={styles.alertIcon}>
            {type === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
            {type === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
            {type === 'warning' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            )}
            {type === 'info' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </div>
          <p className={styles.alertMessage}>{message}</p>
        </div>
        <div className={styles.alertActions}>
          <button className={styles.alertButton} onClick={handleClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert; 