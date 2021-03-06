const clarifai = require("clarifai");

const app = new clarifai.App({
  apiKey: "26bcbf5eb0cb4f7695c5dcc8c8ed56a6",
});

const handleapi = (req, res) => {
  app.models
    .predict(clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
};

function handleimage(req, res, pg) {
  const { id } = req.body;
  pg("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .then(() => {
      return pg
        .select("*")
        .from("users")
        .where("id", "=", id)
        .then((u) => {
          res.json(u[0]);
        });
    });
}

module.exports = {
  handleimage: handleimage,
  handleapi: handleapi,
};
