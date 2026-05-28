const { Op } = require('sequelize');
const { Pin, User, Like, Comment } = require('../models');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const pinFormat = (pin, userId) => ({
  id: pin.id,
  title: pin.title,
  description: pin.description,
  imageUrl: pin.imageUrl,
  category: pin.category,
  likes: pin.Likes?.length || 0,
  saves: 0,
  liked: userId ? pin.Likes?.some(l => l.userId === userId) : false,
  saved: false,
  author: pin.author ? { id: pin.author.id, name: pin.author.name, avatar: pin.author.avatar } : null,
});

exports.getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const where = {};
    if (category) where.category = category;
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    const offset = (page - 1) * limit;
    const { count, rows } = await Pin.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
        { model: Like, attributes: ['userId'] },
      ],
      limit: +limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    res.json({
      success: true,
      pins: rows.map(p => pinFormat(p, req.user?.id)),
      pagination: { currentPage: +page, totalPages: Math.ceil(count / limit), hasMore: offset + rows.length < count },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createPin = async (req, res) => {
  try {
    const { title, description, category, link } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'pinterest' });
    fs.unlinkSync(req.file.path);
    const pin = await Pin.create({ title, description, category, link, imageUrl: result.secure_url, userId: req.user.id });
    const full = await Pin.findByPk(pin.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'avatar'] }, { model: Like, attributes: ['userId'] }],
    });
    res.status(201).json({ success: true, message: 'Pin created successfully', pin: pinFormat(full, req.user.id) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getPin = async (req, res) => {
  try {
    const pin = await Pin.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
        { model: Like, attributes: ['userId'] },
        { 
          model: Comment, 
          attributes: ['id', 'text', 'userId', 'pinId', 'createdAt'],
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }] 
        },
      ],
    });
    if (!pin) return res.status(404).json({ success: false, message: 'Pin not found' });
    const data = pinFormat(pin, req.user?.id);
    data.comments = pin.Comments?.map(c => ({ 
      id: c.id, 
      text: c.text, 
      user: { id: c.user.id, name: c.user.name, avatar: c.user.avatar } 
    }));
    res.json({ success: true, pin: data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.likePin = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Like.findOne({ where: { pinId: id, userId: req.user.id } });
    if (existing) {
      await existing.destroy();
      const likes = await Like.count({ where: { pinId: id } });
      return res.json({ success: true, liked: false, likes });
    }
    await Like.create({ pinId: id, userId: req.user.id });
    const likes = await Like.count({ where: { pinId: id } });
    res.json({ success: true, liked: true, likes });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deletePin = async (req, res) => {
  try {
    const pin = await Pin.findByPk(req.params.id);
    if (!pin) return res.status(404).json({ success: false, message: 'Pin not found' });
    if (pin.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
    await pin.destroy();
    res.json({ success: true, message: 'Pin deleted successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};