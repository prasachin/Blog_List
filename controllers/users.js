const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const { UploadOncloudinary } = require("../utils/cloudinary");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "../public/images");
    cb(null, destinationPath);
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

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

module.exports = usersRouter;
