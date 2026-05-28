const { User, Pin, Follower } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const followersCount = await Follower.count({ where: { followingId: user.id } });
    const followingCount = await Follower.count({ where: { followerId: user.id } });
    const pinsCount = await Pin.count({ where: { userId: user.id } });
    res.json({ success: true, user: { ...user.toJSON(), followersCount, followingCount, pinsCount } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, website, location } = req.body;
    await req.user.update({ name, bio, website, location });
    res.json({ success: true, message: 'Profile updated successfully', user: { id: req.user.id, name: req.user.name, bio: req.user.bio } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.follow = async (req, res) => {
  try {
    const targetId = +req.params.id;
    if (targetId === req.user.id) return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    await Follower.findOrCreate({ where: { followerId: req.user.id, followingId: targetId } });
    res.json({ success: true, following: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    await Follower.destroy({ where: { followerId: req.user.id, followingId: +req.params.id } });
    res.json({ success: true, following: false });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};