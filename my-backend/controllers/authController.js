const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userRes = (u) => ({ id: u.id, name: u.name, email: u.email, avatar: u.avatar });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: 'Email already used' });
    const hashed = await bcrypt.hash(password, 10);
    const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
    const user = await User.create({ name, email, password: hashed, username });
    res.status(201).json({ success: true, message: 'User registered successfully', token: genToken(user.id), user: userRes(user) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, message: 'Login successful', token: genToken(user.id), user: userRes(user) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, user: userRes(req.user) });
};