const service = require('./dashboard.service');

async function summary(req, res, next) {
  try {
    const data = await service.summary(req.user.id, req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { summary };
