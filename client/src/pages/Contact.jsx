import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast.success("Message sent! Thank you.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className=" w-full flex items-start justify-center ">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            className="border border-gray-300 rounded-lg px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none transition-all duration-300"
          />

          <button
            type="submit"
            className="cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 rounded-xl text-lg hover:opacity-90 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
