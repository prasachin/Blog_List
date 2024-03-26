const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { UploadOncloudinaryvid } = require("../utils/cloudinary");

const gettoken = (request) => {
  const authorization = request.get("authorization");
  // console.log(authorization)
  if (authorization && authorization.startsWith("bearer")) {
    const newi = authorization.replace("bearer", "").trim();
    // console.log(newi)
    return newi;
  }
  return null;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "../public/videos");
    cb(null, destinationPath);
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

blogRouter.post("/", upload.single("video"), async (request, response) => {
  const blogdata = request.body;

  let vidlocalpath = "";
  let vidpath = "";

  if (request.file && request.file.path) {
    vidlocalpath = request.file.path;
    vidpath = await UploadOncloudinaryvid(vidlocalpath);
  }

  try {
    const decodedtoken = jwt.verify(gettoken(request), process.env.SECRET);

    if (!decodedtoken) {
      return response.status(401).json({ error: "Token invalid" });
    }

    const user = await User.findById(decodedtoken.id);

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    const blog = new Blog({
      ...blogdata,
      user: user._id,
      video: vidpath ? vidpath.url : "",
    });

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    const populatedResult = await result.populate("user");

    response.status(201).json(populatedResult);
  } catch (error) {
    console.error("Failed", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

blogRouter.delete("/:id", async (request, response) => {
  try {
    const dlt = await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
    console.log("deleted succesfully !");
  } catch (error) {
    console.error("cant delete ", error.message);
  }
});

blogRouter.get("/", async (request, response) => {
  const notes = await Blog.find({}).populate("user");

  response.json(notes);
});

blogRouter.get("/:id", async (request, response) => {
  const note = await Blog.find((note) => {
    note.id === id;
  }).populate("user");

  response.json(note);
});

blogRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const { id, comment } = request.body;

  if (!blog) {
    return response.json(" Blog not found !");
  }

  if (!comment) {
    blog.likes += 1;
  }

  if (comment) {
    blog.comments.push({ text: comment, user: id });
  }

  const updatedblog = await blog.save();
  response.json(updatedblog);
});

module.exports = blogRouter;
