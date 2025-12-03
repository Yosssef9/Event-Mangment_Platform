import { useState } from "react";
import { motion } from "framer-motion";
import EventCard from "../../components/EventCard";
import Pagination from "../../components/Pagination";
import OrganizerEventCard from "../../components/OrganizerEventCard";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../hooks/useEvents";
import { cities } from "../../constants/cities";
import { categories } from "../../constants/categories";
import { selectCustomStyles } from "../../constants/selectCustomStyles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

import Select from "react-select";
export default function OrganizerMyEvents() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const {
    events,
    isLoading,
    page,
    totalPages,
    setPage,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategoryies,
    refetch,
  } = useEvents({ initialPage: 1, limit: 9, organizerId: user.id });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    city: "",
    street: "",
    isOnline: false,
    capacity: "",
    type: "General",
    price: "",
  });

  async function handleCreateEventSubmit(e) {
    e.preventDefault();

    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.startDate ||
      !newEvent.endDate ||
      (!newEvent.isOnline && (!newEvent.city || !newEvent.street)) ||
      !newEvent.image // require an image
    ) {
      toast.error("Please fill in all required fields including an image");
      return;
    }

    const toastId = toast.loading("Creating event...");
    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("startDate", newEvent.startDate);
      formData.append("endDate", newEvent.endDate);
      formData.append("city", newEvent.city || "");
      formData.append("street", newEvent.street || "");
      formData.append("isOnline", newEvent.isOnline);
      formData.append("capacity", parseInt(newEvent.capacity, 10));
      formData.append("type", newEvent.type);
      formData.append("price", parseInt(newEvent.price) || 0);
      formData.append("image", newEvent.image); // add image file
      setDisableSubmitButton(true);

      const res = await api.post("/event/createEvent", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);

      toast.update(toastId, {
        render: "Event created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setNewEvent({
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        city: "",
        street: "",
        isOnline: false,
        capacity: "",
        type: "General",
        price: "",
        image: null,
      });
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      toast.update(toastId, {
        render: `Failed to create event: ${
          error.response?.data?.message || error.message
        }`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setDisableSubmitButton(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Header with Actions */}
        <div className="flex flex-col  md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
            <p className="text-gray-600">Manage and monitor your events</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="  px-6 py-3 cursor-pointer bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition duration-300 flex items-center gap-2"
          >
            <FaPlus />
            Create New Event
          </motion.button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center z-50 justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Event
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateEventSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title
                    </label>
                    <input
                      maxLength={15}
                      type="text"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                      placeholder="Enter event title"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      maxLength={50}
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                      placeholder="Describe your event"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Image
                    </label>
                    <label className="flex items-center justify-between gap-4 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded text-sm">
                          Upload
                        </span>
                        <span className="text-sm text-gray-600">
                          {newEvent.image
                            ? newEvent.image.name
                            : "No file chosen"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, image: e.target.files[0] })
                        }
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Start Date and Time */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newEvent.startDate}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, startDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                    />
                  </div>

                  {/* End Date and Time */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newEvent.endDate}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, endDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                    />
                  </div>

                  {/* Capacity */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newEvent.capacity}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, capacity: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                      placeholder="Number of attendees"
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={newEvent.price}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                      placeholder="Event price"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-300"
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Lecture">Lecture</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Conference">Conference</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  {/* Online Event Toggle */}
                  <div className="col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newEvent.isOnline}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            isOnline: e.target.checked,
                          })
                        }
                        className="rounded text-pink-600 focus:ring-pink-500 transition-all duration-300"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        This is an online event
                      </span>
                    </label>
                  </div>

                  {/* Location Fields */}
                  {!newEvent.isOnline && (
                    <>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <select
                          value={newEvent.city}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, city: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-300"
                        >
                          <option value="">Select a city</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={newEvent.street}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, street: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                          placeholder="Enter street address"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={disableSubmitButton}
                    className="px-6 py-2 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex flex-col flex-1 min-w-[150px] md:flex-row gap-4 md:gap-10 justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 justify-center md:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                        focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-300 transition-all duration-300"
              />
            </div>

            {/* Select + Filter Buttons */}
            <div className="flex flex-1 min-w-[200px] md:flex-row flex-wrap items-center gap-2 justify-end">
              {/* Category Select */}
              <div className="flex-1 min-w-[150px] md:max-w-sm">
                <Select
                  value={selectedCategories}
                  onChange={setSelectedCategoryies}
                  options={categories}
                  placeholder="Select a category"
                  isClearable
                  isMulti
                  closeMenuOnSelect={false}
                  styles={selectCustomStyles}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {["all", "upcoming", "past"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={
                      filterStatus === status
                        ? "px-4 py-2 rounded-lg capitalize transition-all duration-300 bg-linear-to-r from-pink-600 to-purple-600 text-white"
                        : "px-4 py-2 cursor-pointer rounded-lg capitalize transition-all duration-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? ( // 🔥 Show loading spinner
          <div className="flex-1 flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : events.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
              <p className="text-xl text-gray-600 mb-2">No events found</p>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => (
              <OrganizerEventCard
                key={event.id}
                event={event}
                onEdit={(event) => console.log("Edit clicked:", event)}
                onView={(event) =>
                  navigate(`/ViewEventDetails/${event.id}`, {
                    state: { event },
                  })
                }
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
