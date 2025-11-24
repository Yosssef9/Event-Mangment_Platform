import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import api from "../../api/api";
import { useLocation } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function OrganizerAnalytics() {
  const [totalAnalytics, setTotalAnalytics] = useState();
  const location = useLocation();
  const event = location.state?.event;
  console.log(event);

  useEffect(() => {
    const fetchData = async () => {
      if (event) {
        const res = await api.get(`/event/getEventAnalytics/${event.id}`);
        setTotalAnalytics(res.data);
        console.log(res);
      } else {
        const res = await api.get(`/event/getEventsTotalAnalytics`);
        setTotalAnalytics(res.data);
        console.log(res);
      }
    };

    fetchData();
  }, [event]); // حط event كاعتماد عشان لو اتغير، يعمل fetch

  const overallStats = {
    attendees: totalAnalytics?.totalAttendees || 0,
    checkedIn: totalAnalytics?.soldTickets || 0,
    revenue: totalAnalytics?.totalRevenue || 0,
  };

  const lineData = {
    labels: totalAnalytics?.top5Events?.map((e) => e.title) || [],
    datasets: [
      {
        label: "Check-ins per Event",
        data: totalAnalytics?.top5Events?.map((e) => e.soldTickets) || [],
        borderColor: "#ec4899",
        backgroundColor: "rgba(236,72,153,0.2)",
        tension: 0.4,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: ["Sold Tickets", "Remaining Tickets"],
    datasets: [
      {
        data: [
          totalAnalytics?.soldTickets || 0,
          totalAnalytics?.remainingTickets || 0,
        ],
        backgroundColor: ["#ec4899", "#f472b6"],
      },
    ],
  };

  const yMax = Math.max(
    ...(totalAnalytics?.top5Events?.map((e) => e.soldTickets) || [0])
  );

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      {/* ===== Header & Event Selector ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-700">
          📊 Analytics Dashboard
        </h1>
        {event ? (
          <h1 className="text-3xl font-bold text-gray-700">{event.title}</h1>
        ) : (
          <h1 className="text-3xl font-bold text-gray-700">Overall</h1>
        )}
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-pink-500">
          <p className="text-gray-500 text-sm">Total Attendees</p>
          <p className="text-2xl font-bold text-gray-700 mt-2">
            {overallStats.attendees}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-pink-500">
          <p className="text-gray-500 text-sm">Checked-in</p>
          <p className="text-2xl font-bold text-gray-700 mt-2">
            {overallStats.checkedIn}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-pink-500">
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-2xl font-bold text-gray-700 mt-2">
            ${overallStats.revenue}
          </p>
        </div>
      </div>

      {/* ===== Charts ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        {event ? (
          <div className="bg-white shadow-md rounded-xl p-6">
            <img
              className="w-full h-full my-auto object-cover object-center rounded-lg"
              src={event.image}
              alt=""
            />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="font-semibold text-gray-700 mb-4">
              Attendance Over Time
            </h2>
            <div className="w-full h-[400px] md:h-[550px]">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: yMax, // أعلى قيمة في الـ top5
                      ticks: {
                        stepSize: Math.ceil(yMax / 5), // ممكن تحدد عدد الخطوات
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Pie Chart */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">
            Ticket Type Distribution
          </h2>
          <div className="w-full h-[400px] md:h-[550px]">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
