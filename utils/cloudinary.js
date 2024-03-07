const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOncloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) throw new Error("Local file path is missing");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded successfully:", response.url);

    await fs.promises.unlink(localFilePath);
    console.log("Local file deleted successfully");

    return response;
  } catch (error) {
    console.error(
      "Error uploading to Cloudinary or deleting local file:",
      error
    );
    throw error;
  }
};

module.exports = {
  UploadOncloudinary,
};
