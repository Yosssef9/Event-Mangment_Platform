import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  // Links based on role
  const footerLinks =
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
    <footer className="bg-gradient-to-tl from-pink-400 to-purple-700 text-white py-4">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="text-left">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="py-1 px-3 bg-fuchsia-900 rounded-lg mr-2">E</span>
            ventro
          </h1>
        </div>

        {/* Links */}
        <div className="flex flex-row items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:text-gray-200 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-200 transition">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-gray-200 transition">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-gray-200 transition">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-gray-200 transition">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Copyright */}
      {/* Copyright */}
      {/* Copyright */}
      <div className="mt-2 text-center text-white/70 text-sm">
        &copy; {new Date().getFullYear()} Ventro. All rights reserved. |
        Developed by{" "}
        <a
          href="https://github.com/Yosssef9"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-700 font-bold hover:text-purple-400 transition-colors block sm:inline"
        >
          Yossef Yasser
        </a>
      </div>
    </footer>
  );
}
