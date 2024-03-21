const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOncloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("file uploaded successfully ", response.url);
    fs.unlink(localfilepath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
      console.log("Local file deleted successfully");
    });
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath);
  }
};

const UploadOncloudinaryvid = async (vidlocalpath) => {
  try {
    if (!vidlocalpath) return null;
    const response = await cloudinary.uploader.upload(vidlocalpath, {
      resource_type: "auto",
    });
    console.log("file uploaded successfully ", response.url);
    fs.unlink(vidlocalpath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
      console.log("Local file deleted successfully");
    });
    return response;
  } catch (error) {
    console.error(
      "Error in the uploading the video to the cloudinary",
      error.message
    );
    fs.unlinkSync(vidlocalpath);
  }
};

module.exports = {
  UploadOncloudinary,
  UploadOncloudinaryvid,
};
