const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};
app.use(cors(corsOptions));

//upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../front-end/clientside/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

//routes
const postRoutes = require("./src/routes/posts");
const userRoutes = require("./src/routes/users");
const authRoutes = require("./src/routes/auths");
const commentsRoutes = require("./src/routes/comments");

app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentsRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT;
console.log();
app.listen(port, () => {
  console.log("run succesfuly");
});
