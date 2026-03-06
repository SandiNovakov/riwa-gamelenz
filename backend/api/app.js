const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
  quiet: true,
});

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:9000",
    credentials: true,
  }),
);

// Routes
app.use("/", require(path.join(__dirname, "routes")));

app.listen(3000, () => {
  console.log("API running on \x1b[36mhttp://localhost:3000/\x1b[0m");
});
