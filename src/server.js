require('dotenv').config();

const app = require('./app');

const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
  console.log(`[file-service] listening on ${PORT}`);
});
