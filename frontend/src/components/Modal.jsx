import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1"
          >
            <FaTimes size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;