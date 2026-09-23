const service = require('./transaction.service');

async function list(req, res, next) {
  try {
    const items = await service.list(req.user.id, req.query);
    res.json({ transactions: items });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const tx = await service.create(req.user.id, req.body);
    res.status(201).json({ transaction: tx });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const tx = await service.update(req.user.id, req.params.id, req.body);
    res.json({ transaction: tx });
  } catch (err) {
    next(err);
  }
}

async function move(req, res, next) {
  try {
    const tx = await service.move(req.user.id, req.params.id, req.body.status);
    res.json({ transaction: tx });
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

module.exports = { list, create, update, move, remove };
