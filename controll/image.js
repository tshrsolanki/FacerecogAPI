const clarifai = require("clarifai");

const app = new clarifai.App({
  apiKey: "26bcbf5eb0cb4f7695c5dcc8c8ed56a6" || process.env.API,
});

const handleapi = async (req, res, db) => {
  let data;
  try {
    data = await app.models.predict(clarifai.FACE_DETECT_MODEL, req.body.input);
  } catch (error) {
    console.log(error.message, "||", "image.js", "line-", 12);
    return res.json({ message: "Invaild url" });
  }
  if (!data.outputs[0].data.regions) {
    return res.json({ message: "This image does not contain any faces" });
  }

  const { id } = req.body;
  const [user] = await db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .then(() => {
      return db.select("*").from("users").where("id", "=", id);
    });
  res.json({ data, user });
};

function handleimage(req, res, db) {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .then(() => {
      return db
        .select("*")
        .from("users")
        .where("id", "=", id)
        .then((user) => {
          res.json(user[0]);
        });
    });
}

module.exports = {
  handleimage: handleimage,
  handleapi: handleapi,
};
