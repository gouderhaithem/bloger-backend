const db = require("../../DB");
const jwt = require("jsonwebtoken");

exports.getComments = (req, res) => {
  const postId = req.params.id; // Get the 'id' parameter from the URL
  const q = `
  SELECT c.*, u.username
  FROM comments c
  JOIN users u ON c.userid = u.id
  WHERE c.postid = ?
`; // Use a parameterized query

  db.query(q, postId, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

exports.addComments = (req, res) => {
  const q =
    "INSERT INTO comments(`comment`, `userid` ,`postid`,`date` ) VALUES (?)";

  const values = [
    req.body.comment,
    req.body.userid,
    req.params.id,
    req.body.date,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("comment has been aded.");
  });
};

/*

exports.addComments = (req, res) => {
  const token = req.cookies.access_token;
  console.log(token);

  if (!token) return res.status(401).json("Not authenticated stupid");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "INSERT INTO comments(`comment`, `userid` ,`postid`,`date` ) VALUES (?)";

    const values = [
      req.body.comment,
      userInfo.id,
      req.params.id,
      req.body.date,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("comment has been aded.");
    });
  });
};
*/
exports.deleteComments = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM comments WHERE  `id` = ?";
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("comment has been deleted!");
    });
  });
};
