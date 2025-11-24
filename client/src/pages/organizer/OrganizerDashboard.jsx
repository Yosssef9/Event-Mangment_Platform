import { FaCalendarAlt, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
import EventCard from "../../components/EventCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/api";
import OrganizerEventCard from "../../components/OrganizerEventCard";

export default function OrganizerDashboard() {
  const [recentEvents, setRecentEvents] = useState([]);
  const [totalAnalytics, setTotalAnalytics] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchRecentEvents = async () => {
      const res = await api.get(`/event/getRecentEvents`);
      setRecentEvents(res.data);
      console.log(res);
    };

    fetchRecentEvents();
  }, []);
  useEffect(() => {
    const fetchEventsTotalAnalytics = async () => {
      const res = await api.get(`/event/getEventsTotalAnalytics`);
      setTotalAnalytics(res.data);
      console.log(res);
    };

    fetchEventsTotalAnalytics();
  }, []);
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Organizer!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Events Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Events</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {totalAnalytics.totalEvents}
              </h2>
            </div>
            <div className="bg-fuchsia-100 p-3 rounded-full">
              <FaCalendarAlt className="text-2xl text-fuchsia-600" />
            </div>
          </div>
        </motion.div>

        {/* Total Attendees Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Attendees</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {totalAnalytics.totalAttendees}
              </h2>
            </div>
            <div className="bg-pink-100 p-3 rounded-full">
              <FaUsers className="text-2xl text-pink-600" />
            </div>
          </div>
        </motion.div>

        {/* Revenue Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Revenue</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {" "}
                ${totalAnalytics?.totalRevenue?.toLocaleString()}
              </h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-2xl text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Events Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Events</h2>
          <button
            onClick={() => navigate("/organizerMyEvents")}
            className="px-4 py-2 bg-gradient-to-tl cursor-pointer from-pink-400 to-purple-700 text-white rounded-lg hover:opacity-90 transition duration-300"
          >
            My Events
          </button>
        </div>
        {recentEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-96"
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md w-full">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Events Created
              </h2>
              <p className="text-gray-600">
                You haven't created any events yet. Start organizing your first
                event now!
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentEvents.map((event) => (
              <OrganizerEventCard
                key={event.id}
                event={event}
                onView={(event) =>
                  navigate(`/ViewEventDetails/${event.id}`, {
                    state: { event },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
