import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaTimesCircle, FaRegSadTear } from "react-icons/fa";

export default function PaymentCancel() {
  const navigate = useNavigate();

  // Redirect to events page if accessed directly without payment attempt
  useEffect(() => {
    if (!localStorage.getItem("lastBookingDetails")) {
      navigate("/events");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        {/* Cancel Icon */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto"
          >
            <FaTimesCircle className="h-16 w-16 text-red-500 mx-auto" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            Payment Canceled
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-gray-600"
          >
            Your booking was not completed. You can try again anytime.
          </motion.p>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-6 border-t border-b border-gray-200 py-6"
        >
          <div className="flex items-center space-x-3 text-gray-700">
            <FaRegSadTear className="h-5 w-5 text-red-500" />
            <span>Your payment was canceled before completion.</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <FaRegSadTear className="h-5 w-5 text-red-500" />
            <span>No amount has been charged to your account.</span>
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
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Booking Again
          </Link>
          <Link
            to="/"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
