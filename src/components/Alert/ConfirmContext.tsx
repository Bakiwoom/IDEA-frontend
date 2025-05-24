import React, { createContext, useState, useContext, ReactNode } from 'react';
import ConfirmDialog from './ConfirmDialog';

interface ConfirmContextType {
  confirm: (message: string, confirmCallback: () => void) => void;
}

// Context 생성
const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

// Context Provider 컴포넌트
export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    confirmCallback: () => {},
  });

  const confirm = (message: string, confirmCallback: () => void) => {
    setConfirmState({
      isOpen: true,
      message,
      confirmCallback,
    });
  };

  const handleConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
    confirmState.confirmCallback();
  };

  const handleCancel = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};

// 커스텀 훅
export const useConfirm = (): ConfirmContextType => {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}; 