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
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sliding Sidebar */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 h-full w-72 bg-white shadow-lg z-50 p-6 flex flex-col overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              {/* Close button */}
              <button
                className="text-2xl text-fuchsia-600 mb-6 self-end"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTimes />
              </button>

              {/* sidebar links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    setActiveTab(link.name);
                    setMobileMenuOpen(false);
                  }}
                  className="py-4 text-lg font-semibold text-gray-700 border-b hover:text-fuchsia-600"
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-6">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 border-b font-semibold"
                    >
                      Profile
                    </Link>
                    {user.role === "attendee" && (
                      <Link
                        to="/myBookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 border-b font-semibold"
                      >
                        My Bookings
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full py-3 text-left font-semibold text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 border-b font-semibold"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 font-semibold"
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
