require("dotenv").config();
const app = require("./app");

<<<<<<< HEAD
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`File service running on port ${PORT}`);
});
=======
const port = process.env.PORT || 4003;
app.listen(port, () => console.log(`[file-service] listening on ${port}`));
>>>>>>> SCRUM-59-D5-AR-1-File-service-S3-upload-implementation-returns-URL-NO-DB
