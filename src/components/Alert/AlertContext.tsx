import React, { createContext, useState, useContext, ReactNode } from 'react';
import CustomAlert from './CustomAlert';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, autoCloseTime?: number) => void;
  hideAlert: () => void;
}

// Context 생성
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Context Provider 컴포넌트
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
    type: 'info' as AlertType,
    autoCloseTime: 0
  });

  const showAlert = (message: string, type: AlertType = 'info', autoCloseTime: number = 0) => {
    setAlertState({
      isOpen: true,
      message,
      type,
      autoCloseTime
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={hideAlert}
        autoCloseTime={alertState.autoCloseTime}
      />
    </AlertContext.Provider>
  );
};

// 커스텀 훅
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}; 