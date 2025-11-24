import React from "react";
import {
  FaBullseye,
  FaUsers,
  FaChartBar,
  FaShieldAlt,
  FaTicketAlt,
  FaComments,
  FaRocket,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-12  w-full">
        {/* Header */}
        <h1 className="text-4xl font-bold text-purple-700 mb-4 text-center">
          About <span className="text-pink-600">Ventro</span>
        </h1>
        <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mb-12">
          <span className="text-pink-600 font-semibold">Ventro</span> is a smart
          event management platform that empowers organizers and gives attendees
          a seamless booking experience — making events easier, smarter, and{" "}
          <span className="text-purple-600 font-semibold">unforgettable</span>.
        </p>

        {/* Mission Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <FaBullseye className="text-pink-600 text-6xl" />
          <div>
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">
              🎯 Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To provide powerful yet simple tools for event organizers, while
              ensuring a fast and{" "}
              <span className="text-green-600 font-semibold">
                secure booking
              </span>{" "}
              experience for attendees. We believe events are not just
              gatherings — they are{" "}
              <span className="text-pink-600 font-semibold">memories</span>.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div
            className="text-center p-6 bg-gray-100 rounded-xl shadow hover:shadow-md hover:scale-105 hover:-translate-y-1 
  transition-all duration-300 ease-out"
          >
            {" "}
            <FaUsers className="mx-auto text-purple-600 text-5xl mb-3" />
            <h3 className="font-bold text-lg text-purple-700">User Friendly</h3>
            <p className="text-gray-700 mt-2">
              Designed to be easy for organizers & attendees.
            </p>
          </div>

          <div
            className="text-center p-6 bg-gray-100 rounded-xl shadow hover:shadow-md hover:scale-105 hover:-translate-y-1 
  transition-all duration-300 ease-out"
          >
            {" "}
            <FaShieldAlt className="mx-auto text-green-600 text-5xl mb-3" />
            <h3 className="font-bold text-lg text-green-700">
              Secure & Reliable
            </h3>
            <p className="text-gray-700 mt-2">
              Payments, accounts & tickets are fully protected.
            </p>
          </div>

          <div
            className="text-center p-6 bg-gray-100 rounded-xl shadow hover:shadow-md hover:scale-105 hover:-translate-y-1 
  transition-all duration-300 ease-out"
          >
            {" "}
            <FaChartBar className="mx-auto text-blue-600 text-5xl mb-3" />
            <h3 className="font-bold text-lg text-blue-700">
              Analytics Insights
            </h3>
            <p className="text-gray-700 mt-2">
              Organizers gain full visibility over event performance.
            </p>
          </div>

          <div
            className="text-center p-6 bg-gray-100 rounded-xl shadow hover:shadow-md hover:scale-105 hover:-translate-y-1 
  transition-all duration-300 ease-out"
          >
            {" "}
            <FaTicketAlt className="mx-auto text-red-600 text-5xl mb-3" />
            <h3 className="font-bold text-lg text-red-700">Smart Ticketing</h3>
            <p className="text-gray-700 mt-2">
              QR tickets with instant check-in & validation.
            </p>
          </div>

          <div
            className="text-center p-6 bg-gray-100 rounded-xl shadow hover:shadow-md hover:scale-105 hover:-translate-y-1 
  transition-all duration-300 ease-out"
          >
            {" "}
            <FaComments className="mx-auto text-yellow-500 text-5xl mb-3" />
            <h3 className="font-bold text-lg text-yellow-600">
              Ratings & Trust
            </h3>
            <p className="text-gray-700 mt-2">
              Attendees can rate events to build trust and improve experiences.
            </p>
          </div>

          <div
            className="text-center p-6 bg-gray-100 rounded-xl shadow hover:shadow-md hover:scale-105 hover:-translate-y-1 
  transition-all duration-300 ease-out"
          >
            <FaRocket className="mx-auto text-indigo-600 text-5xl mb-3" />
            <h3 className="font-bold text-lg text-indigo-700">
              Scalable System
            </h3>
            <p className="text-gray-700 mt-2">
              Built to support events of any size — from small meetups to mega
              concerts.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/events")}
            className="cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-10 rounded-xl text-lg hover:opacity-90 transition"
          >
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );
}
