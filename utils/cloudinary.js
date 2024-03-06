const v2 = require("cloudinary");
const fs = require("fs");

v2.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOncloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    const response = await v2.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("file uploaded successfully ", response.url);
    // fs.unlink(localfilepath, (err) => {
    //   if (err) {
    //     console.error("Error deleting file:", err);
    //     return;
    //   }
    //   console.log("Local file deleted successfully");
    // });
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath);
  }
};

module.exports = {
  UploadOncloudinary,
};
