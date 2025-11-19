'use client';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  variant?: 'error' | 'success' | 'info';
}

export default function AlertModal({
  isOpen,
  title,
  message,
  buttonText = 'OK',
  onClose,
  variant = 'info',
}: AlertModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    error: {
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    success: {
      icon: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    },
    info: {
      icon: 'text-indigo-600',
      button: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className={`text-lg font-medium ${styles.icon} mb-4`}>{title}</h3>
          <p className="text-sm text-gray-500 mb-4 whitespace-pre-line">{message}</p>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-white rounded focus:outline-none focus:ring-2 ${styles.button}`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

