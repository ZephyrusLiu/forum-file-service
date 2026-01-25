const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, ".env"), override: true });

//console.log(process.env)

const app = require("./app");

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
  console.log(`[file-service] listening on ${PORT}`);
});

