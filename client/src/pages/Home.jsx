import React from "react";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("user from home :", user);

  useEffect(() => {
    if (user?.role === "organizer") {
      navigate("/organizerDashboard");
    } else if (user?.role === "attendee" || !user) {
      navigate("/");
    }
  }, [user?.role, navigate]);

  return (
    <>
      {/* ===== Headings ===== */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-gray-800 drop-shadow-md">
        Your Dream Event
      </h1>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-tl from-pink-400 to-purple-700 bg-clip-text text-transparent">
        Starts Here
      </h2>
      {/* ===== Description ===== */}
      <p className="max-w-2xl text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
        Connect with the world’s most trusted event professionals. From weddings
        to corporate events, we make every celebration unforgettable.
      </p>
      {/* ===== Call to Action Button ===== */}
      <Link
        to="/events"
        className="px-8 py-4 bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
      >
        Explore Events
      </Link>

      {/* ===== Popular Categories Section ===== */}
      <div className="text-center mb-16 mt-24 relative">
        <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-sm">
          Popular Categories
        </h2>

        {/* decorative line */}
        <div className="w-24 h-1 mx-auto mb-5 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full"></div>

        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Find the perfect event that matches your interests — from music
          concerts to workshops and sports activities.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
        {[
          { label: "Weddings", icon: "💍", color: "from-pink-400 to-pink-600" },
          {
            label: "Conferences",
            icon: "🎤",
            color: "from-purple-400 to-purple-600",
          },
          {
            label: "Concerts",
            icon: "🎵",
            color: "from-fuchsia-400 to-fuchsia-600",
          },
          { label: "Sports", icon: "⚽", color: "from-blue-400 to-blue-600" },
          {
            label: "Workshops",
            icon: "🧠",
            color: "from-orange-400 to-orange-600",
          },
          { label: "Parties", icon: "🥳", color: "from-teal-400 to-teal-600" },
        ].map((cat, i) => (
          <div
            key={i}
            className={`rounded-2xl text-center p-6 shadow-lg transition transform hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br ${cat.color}`}
          >
            <div className="text-4xl mb-3 drop-shadow-sm">{cat.icon}</div>
            <p className="text-white font-bold text-lg tracking-wide">
              {cat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ===== Featured Event Themes Section ===== */}
      <div className="mt-24 text-center">
        <div className="mb-14">
          {/* icon */}
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white text-3xl shadow-lg mb-5">
            ✨
          </div>

          {/* title */}
          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent text-center tracking-wide">
            Discover Event Inspirations
          </h2>

          {/* description */}
          <p className="text-gray-600 text-lg text-center max-w-xl mx-auto leading-relaxed">
            Browse through creative and trending event ideas to make your next
            occasion truly unique and unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            {
              title: "Birthday Parties",
              img: "/images/home/Birthday-Party-planner.jpg",
            },
            {
              title: "Live Concerts",
              img: "/images/home/live_entertainment_2.jpg",
            },
            {
              title: "Luxury Weddings",
              img: "/images/home/poppati_events_minneapolis_minnesota_wedding_planning_designer_event_planner_destination_weddings_luxury_high_end_wedding_ashley_pachkofsky17.jpg",
            },
            {
              title: "Corporate Conferences",
              img: "/images/home/rows-of-empty-chairs-in-the-large-conference-hall-2022-12-20-12-34-16-utc.jpg",
            },
            {
              title: "Sports Events",
              img: "/images/home/sportevent_1-scaled.jpg",
            },
            {
              title: "Workshops & Training",
              img: "/images/home/workshop-event-ideas-red-chairs-min.webp",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-64 object-cover transition duration-500 group-hover:scale-110"
              />

              {/* dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>

              {/* title */}
              <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xl font-bold drop-shadow-lg">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto my-28  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {[
          { num: "20K+", label: "Active Users", icon: "👥" },
          { num: "1,200+", label: "Events Hosted", icon: "🎉" },
          { num: "450+", label: "Professional Organizers", icon: "🏆" },
          { num: "95%", label: "Positive Reviews", icon: "⭐" },
        ].map((item, i) => (
          <div
            key={i}
            className="backdrop-blur-md bg-white/40 shadow-lg rounded-3xl py-10 px-6 border border-white/50 hover:scale-[1.03] transition-all duration-300"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-4xl font-extrabold text-purple-700">
              {item.num}
            </h3>
            <p className="mt-2 text-gray-700 font-semibold tracking-wide">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* ===== Final CTA / Join Section ===== */}
      <div className="  text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Ready to Be Part of Something Amazing?
        </h2>

        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10">
          Whether you're planning an event or searching for unforgettable
          experiences, join our fast-growing community and unlock a world of
          opportunities.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          {!user && (
            <a
              href="/register"
              className="px-8 py-4 font-semibold rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              Create Free Account
            </a>
          )}
          <Link
            to="/events"
            className="px-8 py-4 font-semibold rounded-full border-2 border-purple-500 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
