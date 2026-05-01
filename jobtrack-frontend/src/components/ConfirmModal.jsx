import React from "react";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-96 animate-fadeIn">

        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        <p className="text-sm mb-5 text-gray-600 dark:text-gray-300">
          {message}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;