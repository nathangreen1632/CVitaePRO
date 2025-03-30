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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-lg text-black font-semibold mb-4">Why it Matters</h2>
        <div className="text-sm text-gray-700">{content}</div>
        <button
          className="mt-6 w-full bg-gray-800 text-white py-2 px-4 rounded-xl hover:bg-gray-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
