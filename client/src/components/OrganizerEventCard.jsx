// src/components/EventCard.jsx
export default function OrganizerEventCard({ event, onView }) {
  const isPast = new Date(event.endDate) < new Date();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
          <p className="text-gray-500 text-sm mt-1">
            {event.type || "Conference"}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-white text-sm rounded-full ${
            isPast
              ? "bg-gray-500"
              : "bg-gradient-to-r from-pink-600 to-purple-600"
          }`}
        >
          {isPast ? "Past" : "Upcoming"}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mt-4">
        <p className="text-gray-600 text-sm">
          📅 {new Date(event.startDate).toLocaleDateString()} –{" "}
          {new Date(event.endDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-gray-600 text-sm">
          {event.isOnline
            ? "🌐 Online"
            : `📍 ${event.city || "Unknown"}, ${event.street || ""}`}
        </p>
        <p className="text-gray-600 text-sm">
          👥 {event.capacity ? `${event.capacity} Attendees` : "Unlimited"}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <span className="text-2xl font-bold text-gray-800">
          {event.price > 0 ? `$${event.price}` : "Free"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onView?.(event)}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
