const { Router } = require('express');
const controller = require('./dashboard.controller');
const { validate } = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { summaryQuerySchema } = require('./dashboard.schema');

const router = Router();

router.use(authenticate);

router.get('/summary', validate(summaryQuerySchema, 'query'), controller.summary);

module.exports = router;
