import React from "react";

interface ModalProps {
  id: string;
  activeId: string | null;
  onClose: () => void;
  content: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ id, activeId, onClose, content }) => {
  if (activeId !== id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Why it Matters
        </h2>
        <div className="text-sm text-neutral-800 dark:text-neutral-100">
          {content}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-700 text-white py-2 rounded-xl hover:bg-red-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
