import cloudinary from "./cloudinary.js";
import ProfileIcon from "../models/ProfileIcon.js";

async function saveCloudinaryIcons() {
  try {
    // List all resources in the 'profileIcons' folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "profileIcons/", // your folder name
      max_results: 500, // adjust if you have more images
    });

    const icons = result.resources;

    for (const icon of icons) {
      await ProfileIcon.create({ url: icon.secure_url });
      console.log("Saved to DB:", icon.secure_url);
    }

    console.log("All icons saved!");
  } catch (error) {
    console.error("Error fetching Cloudinary icons:", error);
  }
}

saveCloudinaryIcons();
