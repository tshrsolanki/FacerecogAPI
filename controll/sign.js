const { createSession, getAuthTokenId } = require("../sessions");

const handleSignIn = async (req, res, db, bycrypt) => {
  return await db
    .select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      if (data.length) {
        const vaild = bycrypt.compareSync(req.body.password, data[0].hash);
        if (vaild) {
          return db
            .select("*")
            .from("users")
            .where("email", "=", req.body.email)
            .then((u) => u[0])
            .catch("unable");
        } else {
          return { message: "Wrong Credentials" };
        }
      } else {
        return { message: "User not found" };
      }
    })
    .catch((err) => {
      return res.status(401).json({ message: "User not found" });
    });
};

const signInAuthentication = async (req, res, db, bycrypt) => {
  const { authorization } = req.headers;

  if (authorization) {
    getAuthTokenId(req, res, db);
  } else {
    const user = await handleSignIn(req, res, db, bycrypt);
    if (user.id) {
      const data = await createSession(user);
      if (data) {
        return res.json(data);
      }
    }
    return res.status(401).json(user);
  }
};

module.exports = {
  signInAuthentication,
};
