const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dxxnd2npq",
  api_key: "851758386114419",
  api_secret: "N15mWYQ9NElGipAgyApsiTcae38",
});
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};
app.use(cors(corsOptions));

/*upload image
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

*/
async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}
const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});
app.post("/api/upload", upload.single("my_file"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
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
