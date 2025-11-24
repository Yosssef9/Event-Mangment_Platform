import { useState, useCallback, useEffect } from "react";
import api from "../api/api"; // adjust the path as needed
import { useAuth } from "../context/AuthContext";

export function useEvents({ initialPage = 1, limit = 9, organizerId } = {}) {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategoryies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (organizerId) params.append("organizerId", String(organizerId));
      if (user) params.append("userId", String(user.id));
      if (filterStatus && filterStatus !== "all")
        params.append("filterStatus", filterStatus);
      if (selectedCategories && selectedCategories.length > 0) {
        // Join multiple categories with comma or send as separate params
        params.append(
          "categories",
          selectedCategories.map((c) => c.value).join(",")
        );
      }
      if (searchQuery) params.append("searchQuery", searchQuery);

      const res = await api.get(`/event/getAllEvents?${params.toString()}`);
      console.log(res);
      setEvents(res.data.events || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, organizerId, filterStatus, searchQuery, selectedCategories]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [filterStatus, searchQuery]);

  async function getEvent(eventId) {
    try {
      const res = await api.get(`/event/getEventById/${eventId}`);
      console.log(res);
      if (res.data.success) {
        return res.data.event;
      } else {
        throw new Error(res.data.message || "Failed to fetch event");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error(errorMessage);
    }
  }

  return {
    events,
    isLoading,
    page,
    totalPages,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    setPage,
    selectedCategories,
    setSelectedCategoryies,
    refetch: fetchEvents,
    getEvent,
  };
}
