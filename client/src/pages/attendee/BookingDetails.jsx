import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import {
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";

export default function BookingDetails() {
  const [userTicket, setUserTicket] = useState({});
  const location = useLocation();
  const { booking } = location.state || {};

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!booking?.id) return;

        const { data } = await api.get(`/ticket/getMyTicket`, {
          params: { eventId: booking.id },
        });

        setUserTicket(data.userTicket);
      } catch (err) {
        console.error("Error fetching ticket:", err);
      }
    };

    fetchTicket();
  }, [booking?.id]);

  if (!booking) return <p className="text-center mt-10">No booking found.</p>;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  return (
    <div className="  my-10 p-6 bg-white shadow-xl rounded-2xl">
      {/* Event Image */}
      <img
        src={booking.image}
        alt={booking.title}
        className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
      />

      {/* Event Info */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">{booking.title}</h1>
        <p className="text-gray-700 mb-4">{booking.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" />
            <span>{formatDate(booking.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-green-500" />
            <span>{formatDate(booking.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTicketAlt className="text-purple-500" />
            <span>{booking.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaGlobe className="text-yellow-500" />
            <span>{booking.isOnline ? "Online" : "Offline"}</span>
          </div>
          {booking.city && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span>{booking.city}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-semibold">Price:</span>{" "}
            {booking.price > 0 ? `$${booking.price}` : "Free"}
          </div>
        </div>
      </div>

      {/* Ticket QR */}
      <div className="flex flex-col items-center mt-6">
        {userTicket.qrCode ? (
          <>
            <div className="p-4 bg-gray-100 rounded-xl shadow-md">
              <img
                src={userTicket.qrCode}
                alt="Ticket QR Code"
                className="w-64 h-64"
              />
            </div>
            <span
              className={`mt-3 px-4 py-1 rounded-full text-white font-semibold ${
                userTicket.status === "valid" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {userTicket.status === "valid" ? "Valid Ticket" : "Used"}
            </span>
          </>
        ) : (
          <p className="text-gray-500 mt-3">Loading QR code...</p>
        )}
      </div>
    </div>
  );
}
