const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const { UploadOncloudinary } = require("../utils/cloudinary");
const mongoose = require("mongoose"); // Import mongoose

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "../public/images");
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

usersRouter.post(
  "/",
  upload.single("profileicon"),
  async (request, response) => {
    const { username, name, password } = request.body;

    const profileiconlocalpath = request.file ? request.file.path : " ";
    const profileiconpath = await UploadOncloudinary(profileiconlocalpath);

    if (!password) {
      return response.status(400).json({ error: "Password is required" });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
      profileicon: profileiconpath.url,
    });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  }
);

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

usersRouter.put(
  "/:id",
  upload.single("profileicon"),
  async (request, response) => {
    const { username, name, password } = request.body;
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).send({ error: "Invalid user ID" });
    }

    let profileiconpath = null;
    if (request.file) {
      const profileiconlocalpath = request.file.path;
      const uploadResponse = await UploadOncloudinary(profileiconlocalpath);
      profileiconpath = uploadResponse.url;
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (name) updateData.name = name;
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    if (profileiconpath) {
      updateData.profileicon = profileiconpath;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("blogs");
      if (updatedUser) {
        response.json(updatedUser);
      } else {
        response.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      response.status(500).json({ error: "Failed to update user" });
    }
  }
);

module.exports = usersRouter;
