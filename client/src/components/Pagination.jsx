import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  const maxVisible = 5;

  const handlePrev = () => onPageChange(Math.max(page - 1, 1));
  const handleNext = () => onPageChange(Math.min(page + 1, totalPages));

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // ✅ First page
    if (start > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
            page === 1
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-200"
          }`}
        >
          1
        </button>
      );

      if (start > 2) {
        pageNumbers.push(<span key="start-ellipsis">…</span>);
      }
    }

    // ✅ Middle pages
    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${
            page === i
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    // ✅ Last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pageNumbers.push(<span key="end-ellipsis">…</span>);
      }

      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
            page === totalPages
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-200"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex gap-2 mt-auto justify-center items-center">
      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`px-4 py-2 rounded-lg transition-colors ${
          page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-600 hover:bg-gray-200"
        }`}
      >
        Prev
      </button>

      {renderPageNumbers()}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded-lg transition-colors ${
          page === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-600 hover:bg-gray-200"
        }`}
      >
        Next
      </button>
    </div>
  );
}
