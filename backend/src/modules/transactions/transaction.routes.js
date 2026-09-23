const { Router } = require('express');
const controller = require('./transaction.controller');
const { validate } = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth');
const { createSchema, updateSchema, moveSchema, listQuerySchema } = require('./transaction.schema');

const router = Router();

router.use(authenticate);

router.get('/', validate(listQuerySchema, 'query'), controller.list);
router.post('/', validate(createSchema), controller.create);
router.patch('/:id', validate(updateSchema), controller.update);
router.patch('/:id/move', validate(moveSchema), controller.move);
router.delete('/:id', controller.remove);

module.exports = router;
