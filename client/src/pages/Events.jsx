import EventCard from "../components/EventCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { useEvents } from "../hooks/useEvents";
import Select from "react-select";
import { categories } from "../constants/categories";
import { selectCustomStyles } from "../constants/selectCustomStyles";

export default function Events() {
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
  } = useEvents({ initialPage: 1, limit: 12 });
  return (
    <>
      <div className="w-full min-h-screen flex flex-col">
        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full md:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-300"
              />
            </div>

            {/* Right Side: Category + Filter Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:ml-auto gap-2 md:gap-4 w-full md:w-auto">
              {/* Category Select */}
              <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
                <label
                  htmlFor="category"
                  className="text-gray-700 font-medium mb-1 md:mb-0 md:mr-2"
                >
                  Category:
                </label>
                <div className="flex-1 md:flex-none min-w-[180px]">
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
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0 justify-end">
                {["all", "upcoming", "past"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={
                      filterStatus === status
                        ? "px-4 py-2 rounded-lg capitalize transition-all duration-300 bg-gradient-to-r from-pink-600 to-purple-600 text-white"
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
        {isLoading ? (
          // 🔥 Show loading spinner
          <div className="flex-1 flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : events.length === 0 ? (
          // ❌ No events
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
              <p className="text-xl text-gray-600 mb-2">No events found</p>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        ) : (
          // ✅ Events exist
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={(event) => console.log("Edit clicked:", event)}
                onView={(event) => console.log("View clicked:", event)}
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
    </>
  );
}
