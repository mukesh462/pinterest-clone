const router = require('express').Router();
const { createBoard, getBoards, savePin, removePin } = require('../controllers/boardController');
const protect = require('../middleware/auth');

router.post('/create', protect, createBoard);
router.get('/', protect, getBoards);
router.post('/save-pin', protect, savePin);
router.delete('/remove-pin', protect, removePin);

module.exports = router;