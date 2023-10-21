const db = require("../../DB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  // Check if req.body is defined
  if (!req.body) {
    return res.status(400).json("Request body is missing.");
  }

  // Check if req.body.email and req.body.username are defined
  if (!req.body.email || !req.body.username) {
    return res.status(400).json("Email and username are required.");
  }

  // CHECK EXISTING USER
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const insertQuery =
      "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(insertQuery, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};
exports.login = (req, res) => {
  // CHECK USER

  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...other } = data[0];

    res
      .cookie(`access_token`, token, {
        httpOnly: true,
        sameSite: "None", // Set SameSite to None
        secure: true,
        path: "/", // Requires a secure connection (HTTPS)
      })
      .status(200)
      .json(other);
  });
};

exports.logout = (req, res) => {
  // Implement your logout logic here
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
