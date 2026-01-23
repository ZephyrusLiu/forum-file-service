require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 4003;
app.listen(port, () => console.log(`[file-service] listening on ${port}`));
