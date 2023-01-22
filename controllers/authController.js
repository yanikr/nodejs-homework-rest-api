const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      return next(res.status(409).json(Conflict("Email in use")));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  const isPasswordValid = await bcrypt.compare(password, user?.password);

  if (!isPasswordValid || !user) {
    next(res.status(401).json(Unauthorized("Email or password is wrong")));
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  return res.status(204).end();
};

const currentUser = async (req, res) => {
  const { user } = req;
  const { email, subscription } = user;
  return res.status(200).json({ email, subscription });
};
module.exports = {
  register,
  login,
  logout,
  currentUser,
};
