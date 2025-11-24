import { FaStar } from "react-icons/fa";

export default function StarRatingInteractive({ rating = 0 }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? "text-yellow-400 " : "text-gray-300 "}
        />
      ))}
    </div>
  );
}
