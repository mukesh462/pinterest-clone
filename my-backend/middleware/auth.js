const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user)
      return res.status(401).json({ success: false, message: "Invalid token" });
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token expired" });
  }
};
