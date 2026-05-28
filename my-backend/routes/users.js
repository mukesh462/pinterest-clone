const router = require('express').Router();
const { getProfile, updateProfile, follow, unfollow } = require('../controllers/userController');
const protect = require('../middleware/auth');

router.get('/:id', getProfile);
router.put('/update-profile', protect, updateProfile);
router.post('/:id/follow', protect, follow);
router.post('/:id/unfollow', protect, unfollow);

module.exports = router;