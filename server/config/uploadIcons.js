import cloudinary from "./cloudinary.js";
import fs from "fs";
import path from "path";

const folderPath = path.resolve("../client/src/assets/profileIcons");

fs.readdir(folderPath, async (err, files) => {
  if (err) return console.error("Folder not found", err);

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "profileIcons",
      });
      console.log(file, "uploaded:", result.secure_url);
    } catch (error) {
      console.error("Upload error for", file, error);
    }
  }
});
