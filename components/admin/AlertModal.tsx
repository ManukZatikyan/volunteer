'use client';

import { useEffect } from 'react';

interface AlertModalProps {
  open: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: number; // Auto close after milliseconds (0 = no auto close)
}

export default function AlertModal({
  open,
  type,
  title,
  message,
  onClose,
  autoClose = 0,
}: AlertModalProps) {
  useEffect(() => {
    if (open && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, onClose]);

  if (!open) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      button: 'bg-green-600 hover:bg-green-700',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      button: 'bg-red-600 hover:bg-red-700',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
  };

  const styles = typeStyles[type];

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-xl max-w-md w-full mx-4`}>
        <div className="p-6">
          <div className="flex items-start">
            <div className={`${styles.iconBg} rounded-full p-2 mr-4`}>
              <span className={`${styles.text} text-xl font-bold`}>
                {icons[type]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className={`${styles.text} text-lg font-semibold mb-2`}>
                {title}
              </h3>
              <p className={`${styles.text} text-sm mb-4`}>
                {message}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className={`${styles.button} px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

