import React, { useState, useEffect } from 'react';
import styles from './CustomAlert.module.css';

interface ConfirmDialogProps {
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  isOpen,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  type = 'warning'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.alertOverlay} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.alertContainer} ${styles[type]} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.alertContent}>
          <div className={styles.alertIcon}>
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
          <button className={`${styles.alertButton} ${styles.cancelButton}`} onClick={handleCancel}>
            {cancelText}
          </button>
          <button className={styles.alertButton} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 