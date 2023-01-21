const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Unauthorized, BadRequest } = require("http-errors");
const { User } = require("../models/user.js");
const { JWT_SECRET } = process.env;

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(res.status(400).json(BadRequest("missing fields")));
    }

    return next();
  };
};

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string(),
});
const joiRegisterSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") {
    next(res.status(401).json(Unauthorized("Not authorized")));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    req.user = user;
  } catch (error) {
    next(res.status(401).json(Unauthorized("Not authorized")));
  }
  next();
};
module.exports = {
  validateBody,
  addContactSchema,
  updateStatusSchema,
  auth,
  joiRegisterSchema,
};
