const { Board, BoardPin, Pin } = require('../models');

exports.createBoard = async (req, res) => {
  try {
    const board = await Board.create({ name: req.body.name, userId: req.user.id });
    res.status(201).json({ success: true, board: { id: board.id, name: board.name, pinCount: 0, coverImage: board.coverImage } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.findAll({ where: { userId: req.user.id }, include: [{ model: Pin, through: { attributes: [] } }] });
    res.json({
      success: true,
      boards: boards.map(b => ({ id: b.id, name: b.name, pinCount: b.Pins?.length || 0, coverImage: b.coverImage || b.Pins?.[0]?.imageUrl })),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.savePin = async (req, res) => {
  try {
    const { pinId, boardId } = req.body;
    if (!pinId || !boardId) 
      return res.status(400).json({ success: false, message: 'pinId and boardId required' });
    
    const board = await Board.findByPk(boardId);
    if (!board || board.userId !== req.user.id) 
      return res.status(403).json({ success: false, message: 'Forbidden' });
    
    await BoardPin.findOrCreate({ where: { pinId, boardId } });
    res.json({ success: true, message: 'Pin saved successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.removePin = async (req, res) => {
  try {
    const { pinId, boardId } = req.body;
    await BoardPin.destroy({ where: { pinId, boardId } });
    res.json({ success: true, message: 'Pin removed from board' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};