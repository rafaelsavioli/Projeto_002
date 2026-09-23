const { env } = require('./config/env');

function start() {
  const { app } = require('./app');
  return app.listen(env.port, () => {
    console.log(`FluxoBoard API listening on http://localhost:${env.port}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { start };
