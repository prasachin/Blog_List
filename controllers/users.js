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
  storage: storage,
});

usersRouter.post("/", upload.any("profileicon"), async (request, response) => {
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
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

usersRouter.put("/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const { name, username, profileicon } = request.body;
  const users = await User.find({}).populate("blogs");
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    users[index] = { ...users[index], name, username, profileicon };
    response.json({ message: "User updated successfully", user: users[index] });
  } else {
    response.status(404).json({ error: "User not found" });
  }
});

module.exports = usersRouter;
