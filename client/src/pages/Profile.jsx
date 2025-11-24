import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import defaultIcon from "../assets/defaultIcon.png";
export default function AttendeeProfile() {
  const { user, setUser } = useAuth();
  console.log(user);
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (formData.name.length < 3) {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "name must be at least 3",
          background: "linear-gradient(to top left, #ec4899, #7e22ce)",
          color: "#fff",
          confirmButtonColor: "#ec4899",
        });
        formData.name = user.name;
        return;
      }
      const res = await api.put(`/profile/editProfile`, formData);
      console.log("editProfile", res);
      if (res.data.name) {
        setUser((prev) => ({ ...prev, name: res.data.name }));
      }
      await Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been updated successfully.",
        background: "linear-gradient(to top left, #ec4899, #7e22ce)",
        color: "#fff",
        confirmButtonColor: "#ec4899",
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
        background: "linear-gradient(to top left, #ec4899, #7e22ce)",
        color: "#fff",
        confirmButtonColor: "#ec4899",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-600">
          Please log in to view your profile.
        </h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen w-full flex justify-center items-center  p-6"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full  overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-fuchsia-600 to-purple-700">
          <ProfileAvatar />
        </div>

        {/* Content */}
        <div className="mt-20 px-8 pb-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">
            {formData.name || "Your Name"}
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Attendee • Joined{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "Unknown"}
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                disabled={!isEditing}
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none transition ${
                  isEditing
                    ? "border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-300"
                    : "bg-gray-100 border-gray-200"
                }`}
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-500 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                disabled
                value={user.email}
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Role */}
            <div className="sm:col-span-2 text-center">
              <p className="inline-block px-5 py-2 bg-fuchsia-600 text-white rounded-full text-sm font-medium">
                Role: {user.role}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-10">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-tr from-pink-500 to-purple-700 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer px-8 py-3 border border-fuchsia-600 text-fuchsia-600 font-semibold rounded-lg hover:bg-fuchsia-600 hover:text-white transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileAvatar() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [icons, setIcons] = useState([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(defaultIcon);
  const iconPickerRef = useRef(null);
  const scrollPosRef = useRef(0);

  // 🔹 Fetch icons and user icon
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, iconsRes] = await Promise.all([
          api.get("/profile/getProfileIcon"),
          api.get("/profile/getAllIcons"),
        ]);

        if (userRes.data.profileIcon) {
          setSelectedIcon(userRes.data.profileIcon.url);
        }

        if (iconsRes.data.icons?.length) setIcons(iconsRes.data.icons);
        console.log(iconsRes.data.icons);
        console.log(userRes.data.profileIcon);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Update icon manually when user chooses one
  const handleIconSelect = async (iconId, iconUrl) => {
    try {
      // Save scroll position
      if (iconPickerRef.current) {
        scrollPosRef.current = iconPickerRef.current.scrollLeft;
      }
      setSelectedIcon(iconUrl);
      setLoading(true);
      const res = await api.put("/profile/updateProfileIcon", {
        iconId,
      });
      setUser((prev) => ({
        ...prev,
        profileIcon: { url: iconUrl },
      }));
      console.log("updateProfileIcon:", res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Hide picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (iconPickerRef.current && !iconPickerRef.current.contains(e.target)) {
        setShowIconPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Restore scroll after render
  useEffect(() => {
    if (iconPickerRef.current) {
      iconPickerRef.current.scrollLeft = scrollPosRef.current;
    }
  }, [selectedIcon]);

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full flex justify-center">
      <motion.img
        onClick={() => setShowIconPicker(true)}
        src={selectedIcon || defaultIcon}
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      />

      <AnimatePresence>
        {showIconPicker && (
          <motion.div
            ref={iconPickerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 backdrop-blur-md p-4 w-full flex   gap-4 overflow-x-auto z-30 scrollbar-x"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <LoadingSpinner />
              </div>
            )}

            {icons.map((icon, index) => (
              <motion.img
                key={icon.id || index}
                src={icon.url}
                alt="icon"
                onClick={() => handleIconSelect(icon.id, icon.url)}
                className={`w-32 h-32 rounded-full border-4 flex-shrink-0 shadow-lg object-cover cursor-pointer hover:scale-110 transition ${
                  loading ? "invisible" : "visible"
                } ${
                  selectedIcon === icon.url
                    ? "border-blue-700 scale-110"
                    : "border-white"
                }`}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
