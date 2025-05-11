import React, { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '',
  titleClassName = '',
  size = 'md'
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset'; // Re-enable scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Close modal when pressing Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Size mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  if (!isOpen) return null;
  
  // Using createPortal to render modal at the root level of the DOM
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className={`bg-gray-900 text-white rounded-lg shadow-xl w-full mx-4 ${sizeClasses[size]} ${className} overflow-hidden border border-gray-700`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className={`text-xl font-bold ${titleClassName || 'text-blue-400'}`}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;