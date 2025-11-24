// src/pages/ViewEvent.jsx
import React, { useState, useEffect } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid"; // import icons
import api from "../../api/api";
import { useParams, useLocation } from "react-router-dom";
import { formatDate } from "../../helpers/dateFormat";
import { useNavigate } from "react-router-dom";

const initialAttendees = [
  {
    id: 1,
    name: "Sara Ahmed",
    email: "sara@example.com",
    ticket: "VIP",
    status: "Used",
  },
  {
    id: 2,
    name: "Mona Ali",
    email: "mona@example.com",
    ticket: "General",
    status: "Not Used",
  },
  {
    id: 3,
    name: "Omar Hassan",
    email: "omar@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 4,
    name: "Karim Samir",
    email: "karim@example.com",
    ticket: "VIP",
    status: "Not Used",
  },
  {
    id: 5,
    name: "Aya Mostafa",
    email: "aya@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 6,
    name: "Youssef Tarek",
    email: "youssef@example.com",
    ticket: "VIP",
    status: "Used",
  },
  {
    id: 7,
    name: "Nour Mohamed",
    email: "nour@example.com",
    ticket: "General",
    status: "Not Used",
  },
  {
    id: 8,
    name: "Hana Ibrahim",
    email: "hana@example.com",
    ticket: "VIP",
    status: "Used",
  },
  {
    id: 9,
    name: "Mostafa Adel",
    email: "mostafa@example.com",
    ticket: "General",
    status: "Not Used",
  },
  {
    id: 10,
    name: "Rana Ahmed",
    email: "rana@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 11,
    name: "Mohamed Ziad",
    email: "ziad@example.com",
    ticket: "VIP",
    status: "Used",
  },
  {
    id: 12,
    name: "Salma Nasser",
    email: "salma@example.com",
    ticket: "General",
    status: "Not Used",
  },
  {
    id: 13,
    name: "Hussein Khaled",
    email: "hussein@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 14,
    name: "Laila Magdy",
    email: "laila@example.com",
    ticket: "VIP",
    status: "Not Used",
  },
  {
    id: 15,
    name: "Tamer Yasser",
    email: "tamer@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 16,
    name: "Jana Wael",
    email: "jana@example.com",
    ticket: "VIP",
    status: "Used",
  },
  {
    id: 17,
    name: "Ola Khalifa",
    email: "ola@example.com",
    ticket: "General",
    status: "Not Used",
  },
  {
    id: 18,
    name: "Ahmed Fathy",
    email: "afathy@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 19,
    name: "Nadine Lotfy",
    email: "nadine@example.com",
    ticket: "VIP",
    status: "Not Used",
  },
  {
    id: 20,
    name: "Walid Reda",
    email: "walid@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 21,
    name: "Rashed Omar",
    email: "rashed@example.com",
    ticket: "General",
    status: "Not Used",
  },
  {
    id: 22,
    name: "Malak Hesham",
    email: "malak@example.com",
    ticket: "VIP",
    status: "Used",
  },
  {
    id: 23,
    name: "Basma Ahmed",
    email: "basma@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 24,
    name: "Adham Nour",
    email: "adham@example.com",
    ticket: "VIP",
    status: "Not Used",
  },
  {
    id: 25,
    name: "Hossam Mohamed",
    email: "hossam@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 26,
    name: "Mariam Yassin",
    email: "mariam@example.com",
    ticket: "General",
    status: "Not Used",
  },
  {
    id: 27,
    name: "Farah Ehab",
    email: "farah@example.com",
    ticket: "VIP",
    status: "Used",
  },
  {
    id: 28,
    name: "Khaled Sharif",
    email: "khaled@example.com",
    ticket: "General",
    status: "Used",
  },
  {
    id: 29,
    name: "Nadine Samy",
    email: "nsamy@example.com",
    ticket: "VIP",
    status: "Not Used",
  },
  {
    id: 30,
    name: "Mahmoud Saad",
    email: "mahmoud@example.com",
    ticket: "General",
    status: "Used",
  },
];

// const tickets = [
//   { type: "VIP", sold: 25, remaining: 5, price: 2000 },
//   { type: "General", sold: 80, remaining: 20, price: 1000 },
// ];

export default function ViewEventDetails() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { eventId } = useParams();
  console.log("Event ID:", eventId);
  const location = useLocation();
  const { event } = location.state || {}; // هنا بيجيلك object كامل
  const [attendees, setAttendees] = useState([]);
  const [capacityDetails, setCapacityDetails] = useState({});
  const navigate = useNavigate();

  console.log("Event:", event);
  useEffect(() => {
    const fetchEventDetails = async () => {
      const res = await api.get(`/event/getEventDetails/${eventId}`);
      console.log(res);
      setAttendees(res.data.attendees);
      setCapacityDetails(res.data.capacityDetails);
    };
    if (eventId) fetchEventDetails();
  }, [eventId]);
  // ===== Sorting Function =====
  const sortBy = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...attendees].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setAttendees(sorted);
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen p-6">
      {/* ===== Page Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-pink-700">
            Spring Music Festival
          </h1>
          <p className="text-pink-400 mt-1">Organizer Dashboard</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/TicketScanner")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
          >
            Scan Ticket
          </button>
          <button
            onClick={() =>
              navigate("/organizerAnalytics", { state: { event } })
            }
            className="bg-pink-100 hover:bg-pink-200 text-pink-600 px-4 py-2 rounded-lg"
          >
            Event Analytics
          </button>
        </div>
      </div>

      {/* ===== Main Content Grid ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Event Overview Card ===== */}
        <div className="bg-white rounded-xl shadow-md p-6 min-w-[600px]">
          {/* Event Image */}
          <img
            src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?cs=srgb&dl=pexels-teddy-2263436.jpg&fm=jpg" // replace with your event image URL
            alt="Event"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <h2 className="text-2xl font-semibold text-pink-700 mb-2">
            Event Overview
          </h2>
          <p className="text-pink-500 mb-1">
            <p>Date: {formatDate(event.startDate)}</p>
          </p>
          <p className="text-pink-500 mb-1">
            <span className="font-medium">Location:</span>{" "}
            {event.isOnline ? "Online Event" : event.city}
          </p>

          <p className="text-pink-400 mt-4">{event.description}</p>
        </div>

        {/* ===== Tickets / Pricing Card ===== */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">
            Tickets & Pricing
          </h2>
          <div className="space-y-3">
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="text-pink-600 font-semibold">General</h4>
                <p className="text-pink-500 text-sm">
                  Price: {event.price} EGP
                </p>
                <p className="text-pink-500 text-sm">
                  Sold: {capacityDetails.sold}
                </p>
                <p className="text-pink-500 text-sm">
                  Remaining: {capacityDetails.remaining}
                </p>
              </div>
              <button className="bg-pink-100 hover:bg-pink-200 text-pink-600 px-3 py-1 rounded-md">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* ===== Attendees Card ===== */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">
            Attendees
          </h2>
          <div className=" max-h-[450px] overflow-auto custom-scrollbar">
            {attendees.length === 0 ? (
              <div className="text-center py-10 text-pink-500 font-medium">
                No attendees yet. Invite people to join your event!
              </div>
            ) : (
              <table className="min-w-full  divide-y divide-pink-100">
                <thead>
                  <tr className="bg-pink-50">
                    {["name", "email", "status"].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-center text-pink-600 font-medium cursor-pointer select-none"
                        onClick={() => sortBy(col)}
                      >
                        {col.charAt(0).toUpperCase() + col.slice(1)}{" "}
                        {sortConfig.key === col
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {attendees.map((attendee, index) => (
                    <tr
                      key={attendee.id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white hover:bg-fuchsia-100"
                          : "bg-pink-50 hover:bg-fuchsia-100"
                      } transition-colors duration-300`}
                    >
                      <td className="px-6 py-4 text-pink-600">
                        {attendee.name}
                      </td>
                      <td className="px-6 py-4 text-pink-400">
                        {attendee.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            attendee.status === "Used"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-fuchsia-100 text-fuchsia-700"
                          }`}
                        >
                          {attendee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
