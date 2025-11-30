import { useEffect, useState } from "react";
import { motion, AnimatePresence, time } from "framer-motion";
import { FiMapPin, FiCalendar, FiClock, FiX } from "react-icons/fi";
import { MdEventAvailable, MdEventBusy } from "react-icons/md";
import Swal from "sweetalert2";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // all, upcoming, past
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ===============================
  // 🔹 Fetch user bookings
  // ===============================
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(9),
        });
        const res = await api.get(
          `/event/getUserBookings/${user.id}?${params.toString()}`,
          {
            withCredentials: true,
          }
        );
        console.log(res);
        // Normalize API response: some endpoints return `event` (lowercase)
        // while the UI expects `Event`. Ensure every booking has `Event`.
        const bookingsData = res.data.bookings || [];
        const events = bookingsData.map((b) => {
          return b.event;
        });
        console.log("events", events);

        setBookings(events);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Bookings",
          text: "Unable to fetch your bookings. Please try again.",
          background: "linear-gradient(to top left, #ec4899, #7e22ce)",
          color: "#fff",
          confirmButtonColor: "#ec4899",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, page]);

  // ===============================
  // 🔹 Filter bookings based on status
  // ===============================
  const getFilteredBookings = () => {
    if (filterStatus === "all") return bookings;

    const now = new Date();
    return bookings.filter((booking) => {
      const eventDateString = booking?.startDate;
      if (!eventDateString) {
        // If there's no date info, only include in "all" view (handled above),
        // but since we are here the filter is upcoming/past, exclude unknown dates.
        return false;
      }

      const eventDate = new Date(eventDateString);
      if (filterStatus === "upcoming") {
        return eventDate > now;
      } else if (filterStatus === "past") {
        return eventDate <= now;
      }
      return true;
    });
  };

  // ===============================
  // 🔹 Cancel booking
  // ===============================
  const handleCancelBooking = async (bookingId, eventTitle) => {
    try {
      const result = await Swal.fire({
        title: "Cancel Booking?",
        text: `Are you sure you want to cancel your booking for "${eventTitle}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Cancel Booking",
        cancelButtonText: "Keep Booking",
        background: "linear-gradient(to top left, #ec4899, #7e22ce)",
        color: "#fff",
      });

      if (result.isConfirmed) {
        setLoading(true);
        await api.delete(`/events/cancelBooking/${bookingId}`, {
          withCredentials: true,
        });

        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        setSelectedBooking(null);

        Swal.fire({
          icon: "success",
          title: "Booking Cancelled",
          text: "Your booking has been cancelled successfully.",
          background: "linear-gradient(to top left, #ec4899, #7e22ce)",
          color: "#fff",
          confirmButtonColor: "#ec4899",
        });
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text: "Unable to cancel your booking. Please try again.",
        background: "linear-gradient(to top left, #ec4899, #7e22ce)",
        color: "#fff",
        confirmButtonColor: "#ec4899",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-600">
          Please log in to view your bookings.
        </h1>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className=" w-full p-6 flex flex-col "
    >
      <div className="max-w-7xl mb-10 ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage your event reservations and bookings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {["all", "upcoming", "past"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
        px-4 sm:px-6 py-2 rounded-lg capitalize font-medium transition-all duration-300
        ${
          filterStatus === status
            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
            : "bg-white text-gray-700 border border-gray-200 hover:border-pink-500"
        }
      `}
            >
              {status === "all" ? "All Bookings" : status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-96"
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md w-full">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Bookings Found
              </h2>
              <p className="text-gray-600">
                {filterStatus === "all"
                  ? "You haven't booked any events yet. Explore events and make your first booking!"
                  : `You have no ${filterStatus} events.`}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBookings.map((booking, index) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  index={index}
                  onCancel={() =>
                    handleCancelBooking(
                      booking.id,
                      booking?.Event?.title ?? "Event"
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className="mt-auto">
        {filteredBookings.length === 0 ? null : (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onCancel={() => {
              handleCancelBooking(
                selectedBooking.id,
                selectedBooking?.Event?.title ?? "Event"
              );
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===============================
// 🔹 Booking Card Component
// ===============================
function BookingCard({ booking, index }) {
  const navigate = useNavigate();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);

  console.log("booking.Event.startDate", booking?.startDate);
  const eventDateString = booking?.startDate;

  const eventDate = eventDateString ? new Date(eventDateString) : null;
  const now = new Date();
  const isUpcoming = eventDate ? eventDate > now : false;
  const time = eventDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  console.log(time);
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await api.get(`/event/getEventUserRating/${booking.id}`);
        if (res.data.userRating) setSelectedStar(res.data.userRating);
      } catch (err) {
        console.error("Failed to fetch user rating:", err);
      }
    };
    fetchRating();
  }, [booking.id]);

  // Handle rating click
  const handleRating = async (star) => {
    try {
      setSelectedStar(star); // optimistic UI
      await api.put("/event/updateEventRating", {
        eventId: booking.id,
        rating: star,
      });
      toast.success("Rating updated successfully!");
    } catch (err) {
      console.error("Failed to update rating:", err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img
          src={
            booking?.image ||
            "https://www.johnacademy.co.uk/wp-content/uploads/2017/06/wedding-event-1.jpg"
          }
          alt={booking?.title}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white ${
              isUpcoming
                ? "bg-linear-to-r from-green-400 to-green-600"
                : "bg-linear-to-r from-gray-400 to-gray-600"
            }`}
          >
            {isUpcoming ? (
              <>
                <MdEventAvailable size={14} /> Upcoming
              </>
            ) : (
              <>
                <MdEventBusy size={14} /> Past
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {booking?.title ?? "Untitled Event"}
        </h3>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          {/* Date */}
          <div className="flex items-center gap-2">
            <FiCalendar className="text-pink-500" size={16} />
            <span>
              {eventDate
                ? eventDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "TBD"}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <FiClock className="text-purple-500" size={16} />
            <span>{time ?? "TBD"}</span>
          </div>

          {/* Location + Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-red-500" size={16} />
              <span>
                {booking?.isOnline ? "🌐 Online" : booking?.city ?? "TBD"}
              </span>
            </div>

            {/* Rating on the right */}
            {!isUpcoming && (
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={16}
                    className={`cursor-pointer transition-colors ${
                      star <= (hoveredStar || selectedStar)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-gray-800 mt-3 pt-3 border-t border-gray-200">
          {booking?.price === 0 ? "Free" : `$${booking?.price}`}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() =>
              navigate(`/bookingDetails/${booking.id}`, { state: { booking } })
            }
            className="flex-1 px-4 py-2 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
