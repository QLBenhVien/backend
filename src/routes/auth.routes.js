let router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;
