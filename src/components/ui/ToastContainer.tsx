import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Toast, { ToastType } from './Toast';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

// Container for multiple toast notifications
const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  // Return null if no toasts
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

// Custom hook to manage toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    ),
  };
};

export default ToastContainer;