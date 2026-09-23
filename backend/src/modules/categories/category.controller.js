const service = require('./category.service');

async function list(req, res, next) {
  try {
    const categories = await service.list(req.user.id);
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const category = await service.create(req.user.id, req.body);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const category = await service.update(req.user.id, req.params.id, req.body);
    res.json({ category });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await service.remove(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
