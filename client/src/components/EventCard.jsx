import StarRatingInteractive from "../components/StarRatingInteractive";
import { FiMapPin } from "react-icons/fi";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import api from "../api/api";
export default function EventCard({ event }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const eventEnding = new Date(event.endDate) < new Date();

  const handleBook = async () => {
    try {
      if (!user || user.role !== "attendee") {
        Swal.fire({
          title: "Login Required",
          text: "You need to log in to book this event.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Login Now",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            // ✅ Redirect to login
            navigate("/login");
          }
        });
        return;
      }
      const res = await api.post("/payments/create-checkout-session", {
        eventId: event.id,
        eventTitle: event.title,
        price: event.price,
        userId: user.id,
        userEmail: user.email,
      });
      console.log("res", res);
      // ✅ Redirect directly to Stripe Checkout
      if (res.data.url) {
        localStorage.setItem("lastBookingDetails", JSON.stringify(event));
        window.location.href = res.data.url;
      } else {
        alert("Failed to start payment");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div
      className=" bg-white rounded-xl shadow-md overflow-hidden 
                    hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300"
    >
      <div className="relative">
        {/* ✅ Skeleton placeholder while image is loading */}
        {!imageLoaded && (
          <Skeleton
            height={208} // same height as h-52
            width="100%"
            borderRadius="0.5rem"
          />
        )}

        {/* ✅ Actual image */}
        <img
          src={
            event.image ||
            "https://www.johnacademy.co.uk/wp-content/uploads/2017/06/wedding-event-1.jpg"
          }
          alt={event.title || "Event image"}
          className={`w-full h-52 object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)} // show fallback if fails
        />

        {/* ✅ Overlays */}
        <span className="absolute top-5 left-3 bg-gradient-to-tl from-pink-400 to-purple-700 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
          Featured
        </span>
        <span className="absolute top-5 right-3 bg-white text-gray-600 text-xs font-bold px-2 py-1 rounded-lg shadow-md">
          {event.type}
        </span>
      </div>

      <div className="p-4 pb-6 pt-10">
        <h1 className="text-lg text-start font-semibold mb-2">{event.title}</h1>
        <p className="text-gray-600 text-start text-sm mb-4 wrap-break-word mr-5 leading-normal">
          {event.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-1">
            <StarRatingInteractive rating={Math.floor(event.avgRating)} />
            <span className="text-sm font-medium">{event.avgRating}</span>
            <span className="text-gray-500 text-sm">
              ({event.totalRatings})
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm mr-1">
            {event.isOnline ? (
              "🌐 Online"
            ) : (
              <>
                <FiMapPin />
                <span> {event.city}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[24px] font-bold">
            {event.price === 0
              ? "Free"
              : event.price
              ? `$${event.price}`
              : "Unknown"}{" "}
          </span>
          {eventEnding || event.isSold ? (
            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg  opacity-80">
              Sold Out
            </button>
          ) : (
            <button
              onClick={handleBook}
              className="bg-gradient-to-tl from-pink-400 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-800 transition-colors duration-200 cursor-pointer"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
