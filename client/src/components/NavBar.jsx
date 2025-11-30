import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import defaultIcon from "../assets/defaultIcon.png";

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [activeTab, setActiveTab] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (user?.role === "organizer") {
      if (path.includes("dashboard")) setActiveTab("Dashboard");
      else if (path.includes("myevents")) setActiveTab("My Events");
      else if (path.includes("analytics")) setActiveTab("Analytics");
      else setActiveTab("Dashboard");
    } else {
      if (path === "/") setActiveTab("Home");
      else if (path.includes("events")) setActiveTab("Events");
      else if (path.includes("about")) setActiveTab("About");
      else if (path.includes("contact")) setActiveTab("Contact");
      else setActiveTab("Home");
    }
  }, [location.pathname, user?.role]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks =
    user?.role?.toLowerCase() === "organizer"
      ? [
          { name: "Dashboard", path: "/organizerDashboard" },
          { name: "My Events", path: "/organizerMyEvents" },
          { name: "Analytics", path: "/organizerAnalytics" },
        ]
      : [
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
          { name: "About", path: "/about" },
          { name: "Contact", path: "/contact" },
        ];

  // 📌 Mobile Swipe to open/close sidebar
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      // 🟢 Swipe Right to OPEN (from left edge only)
      if (!mobileMenuOpen && startX < window.innerWidth * 0.75 && diff > 70) {
        setMobileMenuOpen(true);
      }

      // 🔴 Swipe Left to CLOSE (when menu is open)
      if (mobileMenuOpen && diff < -70) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="w-full px-6 md:px-12 lg:px-20 flex justify-between items-center bg-white/90 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.1)] h-20">
        {/* LOGO */}
        <h1 className="flex min-w-[200px] items-center text-xl font-semibold">
          <span className="py-1 px-3 flex justify-center items-center bg-gradient-to-tl from-pink-400 to-purple-700 mr-1 font-bold rounded-lg text-white">
            E
          </span>
          ventro
        </h1>

        {/* LINKS — Desktop only */}
        <div className="hidden md:flex justify-center flex-1 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                activeTab === link.name
                  ? "bg-fuchsia-500 text-white"
                  : "hover:bg-fuchsia-300 hover:text-white"
              } mx-3 rounded-md transition-all duration-300 cursor-pointer px-4 py-2`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* HAMBURGER — Mobile only */}
        <button
          className="md:hidden text-fuchsia-600 text-3xl"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FaBars />
        </button>

        {/* RIGHT SECTION */}
        <div className="hidden md:flex items-center justify-end gap-4">
          {user ? (
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 px-3 py-2 rounded-full border border-fuchsia-500 text-fuchsia-600 hover:bg-fuchsia-500 hover:text-white transition duration-300"
              >
                <img
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-fuchsia-500"
                  src={`${user.profileIcon?.url || defaultIcon}`}
                />
                <span className="font-semibold hidden sm:block">
                  {user.name}
                </span>
                <FaChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-fuchsia-50"
                    >
                      Profile
                    </Link>
                    {user.role === "attendee" && (
                      <Link
                        to="/myBookings"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-fuchsia-50"
                      >
                        My Bookings
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-fuchsia-50 text-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-fuchsia-500 text-fuchsia-600 rounded-md hover:bg-fuchsia-500 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ===== SLIDING SIDEBAR MENU (MOBILE) ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Background dim */}
            {/* Sliding Sidebar - NEW DESIGN */}
            <motion.div
              className="fixed top-0 left-0 bottom-0  w-72 bg-gradient-to-b from-fuchsia-600 to-purple-700 text-white z-50 shadow-2xl flex flex-col overflow-y-auto rounded-r-md"
              style={{ top: 0, bottom: 0, height: "100dvh" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              {/* Header (User info + close button) */}
              <div className="flex justify-between items-center px-4 py-5 border-b border-white/20">
                <h2 className="text-xl font-bold">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl hover:scale-110 transition"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Profile section */}
              {user && (
                <div className="flex flex-col items-center mt-6 mb-4">
                  <img
                    src={user.profileIcon?.url || defaultIcon}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                  />
                  <h3 className="mt-3 font-semibold text-lg">{user.name}</h3>
                </div>
              )}

              {/* Links */}
              <div className="px-3 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      setActiveTab(link.name);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-white/15 hover:bg-white/25 px-4 py-3 rounded-lg font-medium transition flex items-center justify-between"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* User Options */}
              <div className="mt-8 px-3 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-white/15 hover:bg-white/25 px-4 py-3 rounded-lg font-medium transition"
                    >
                      Profile
                    </Link>

                    {user.role === "attendee" && (
                      <Link
                        to="/myBookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="bg-white/15 hover:bg-white/25 px-4 py-3 rounded-lg font-medium transition"
                      >
                        My Bookings
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg font-semibold transition text-white mt-4 shadow-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-sky-500/90 hover:bg-sky-600 text-white px-4 py-3 rounded-lg font-medium transition"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-rose-500/90 hover:bg-rose-600 text-white px-4 py-3 rounded-lg font-medium transition"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
