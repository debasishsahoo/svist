const User = require("../models/user.model");
const winston = require("winston");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already registered");

    user = new User({ name, email, password });
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    winston.error(err.message, err);
    res.status(500).send("Something failed");
  }
};
exports.login = async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.send(token);
  } catch (err) {
    winston.error(err.message, err);
    res.status(500).send("Something failed");
  }
};
exports.getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};
