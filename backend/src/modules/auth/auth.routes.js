const { Router } = require('express');
const controller = require('./auth.controller');
const { validate } = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { authRateLimit } = require('../../middlewares/rateLimit');
const { registerSchema, loginSchema } = require('./auth.schema');

const router = Router();

router.post('/register', authRateLimit, validate(registerSchema), controller.register);
router.post('/login', authRateLimit, validate(loginSchema), controller.login);
router.get('/me', authenticate, controller.me);

module.exports = router;
