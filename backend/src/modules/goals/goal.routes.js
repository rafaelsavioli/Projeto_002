const { Router } = require('express');
const controller = require('./goal.controller');
const { validate } = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { createSchema, updateSchema } = require('./goal.schema');

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.post('/', validate(createSchema), controller.create);
router.patch('/:id', validate(updateSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
