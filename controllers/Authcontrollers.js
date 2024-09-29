const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

async function handleregister(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: email, userid: user._id },
      "process.env.JWT_SECRET",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production if using HTTPS
      sameSite: "lax", // or 'strict' depending on your needs
    });

    res.status(201).send("Registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function handlelogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(400).send("Login failed");
    }

    const token = jwt.sign(
      { email: email, userid: user._id },
      "process.env.JWT_SECRET",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production if using HTTPS
      sameSite: "lax", // or 'strict' depending on your needs
    });

    res.status(200).send("Login successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { handleregister, handlelogin };
