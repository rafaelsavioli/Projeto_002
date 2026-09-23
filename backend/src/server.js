const { app } = require('./app');
const { env } = require('./config/env');

app.listen(env.port, () => {
  console.log(`FluxoBoard API listening on http://localhost:${env.port}`);
});
