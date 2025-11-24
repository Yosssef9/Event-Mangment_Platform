import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTicketAlt, FaCalendarAlt } from "react-icons/fa";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  // Redirect to events page if accessed directly without payment
  useEffect(() => {
    if (!localStorage.getItem("lastBookingDetails")) {
      navigate("/events");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        {/* Success Icon */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto"
          >
            <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            Booking Successful!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-gray-600"
          >
            Your ticket has been booked successfully
          </motion.p>
        </div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-6 border-t border-b border-gray-200 py-6"
        >
          <div className="flex items-center space-x-3 text-gray-700">
            <FaTicketAlt className="h-5 w-5 text-pink-500" />
            <span>Check your email for the e-ticket</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <FaCalendarAlt className="h-5 w-5 text-pink-500" />
            <span>Event details and updates will be sent to your email</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col space-y-4"
        >
          <Link
            to="/events"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Browse More Events
          </Link>
          <Link
            to="/"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
