const { Comment, User } = require('../models');

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.create({ text, userId: req.user.id, pinId: req.params.id });
    const full = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
    });
    res.status(201).json({ success: true, comment: { id: full.id, text: full.text, user: { id: full.user.id, name: full.user.name, avatar: full.user.avatar } } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Not found' });
    if (comment.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
    await comment.destroy();
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};