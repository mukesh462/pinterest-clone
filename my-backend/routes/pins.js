const router = require('express').Router();
const { getFeed, createPin, getPin, likePin, deletePin } = require('../controllers/pinController');
const { addComment } = require('../controllers/commentController');
const protect = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const optAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) return protect(req, res, next);
  next();
};

router.get('/', optAuth, getFeed);
router.post('/create', protect, upload.single('image'), createPin);
router.get('/:id', optAuth, getPin);
router.post('/:id/like', protect, likePin);
router.delete('/:id', protect, deletePin);
router.post('/:id/comment', protect, addComment);

module.exports = router;