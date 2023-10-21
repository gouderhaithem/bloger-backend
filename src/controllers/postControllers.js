const db = require("../../DB");
const jwt = require("jsonwebtoken")

exports.getPosts = (req, res) => {
    const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
}

exports.getPost = (req, res) => {
    const q =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
}


exports.deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const postId = req.params.id;
      const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";
  
      db.query(q, [postId, userInfo.id], (err, data) => {
        if (err) return res.status(403).json("You can delete only your post!");
  
        return res.json("Post has been deleted!");
      });
    });
}


exports.addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated stupid");
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";
  
      const values = [
        req.body.title,
        req.body.desc,
        req.body.img,
        req.body.cat,
        req.body.date,
        userInfo.id,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been created.");
      });
    });
}


exports.updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const updatedFields = {}; // Object to store updated fields and their values

    // Check which fields are provided in the request body and add them to updatedFields
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.desc) updatedFields.desc = req.body.desc;
    if (req.body.img) updatedFields.img = req.body.img;
    if (req.body.cat) updatedFields.cat = req.body.cat;

    // Check if any fields are being updated
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json("No fields to update.");
    }

    const setClause = Object.keys(updatedFields)
      .map((field) => `\`${field}\` = ?`)
      .join(", ");

    const q = `UPDATE posts SET ${setClause} WHERE \`id\` = ? AND \`uid\` = ?`;
    const values = [...Object.values(updatedFields), postId, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};

