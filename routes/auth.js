const express = require('express');
const router = express.Router();

const userController = require('../controllers/auth');
const auth = require('./../middlewares/auth')

router.post('/signup', userController.signup);
router.get('/test', userController.test);
router.post('/login', userController.login);
router.get('/profile', auth, userController.profile);

module.exports = router;