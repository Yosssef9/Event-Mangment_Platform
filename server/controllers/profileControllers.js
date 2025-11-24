import User from "../models/User.js";
import ProfileIcon from "../models/ProfileIcon.js";

export const updateProfileIcon = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { iconId } = req.body; // client sends the icon ID

    if (!iconId) {
      return res.status(400).json({ message: "Profile icon is required." });
    }

    // Optional: verify icon exists
    const icon = await ProfileIcon.findByPk(iconId);
    if (!icon) {
      return res.status(404).json({ message: "Profile icon not found." });
    }

    await User.update({ profileIconId: iconId }, { where: { id: userId } });

    res.json({
      message: "Profile icon updated successfully",
      profileIcon: icon, // return the full icon info
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfileIcon = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: ProfileIcon,
          as: "profileIcon",
          attributes: ["id", "url"], // only get what you need
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      profileIcon: user.profileIcon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllIcons = async (req, res) => {
  try {
    const icons = await ProfileIcon.findAll(); // ✅ await here

    if (!icons || icons.length === 0) {
      // ✅ check if empty array
      return res.status(404).json({ message: "Icons not found" });
    }

    res.status(200).json({ icons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ message: "Name must be at least 3 characters long" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    await user.save();

    res.json({ message: "User name updated successfully", name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
