const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  try {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "Invalid username or password",
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response.status(200).json({
      token,
      username: user.username,
      name: user.name,
      profileicon: user.profileicon,
      blogs: user.blogs,
      id: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = loginRouter;
