const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, ".env"), override: true });

const app = require('./app');

const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
  console.log(`[file-service] listening on ${PORT}`);
});
