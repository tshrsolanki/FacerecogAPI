const { createSession } = require("../sessions");

const handlereg = async (req, res, db, bycrypt) => {
  const { email, password, name } = req.body;
  const hash = bycrypt.hashSync(password);

  const user = await db
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into("login")
        .returning("email")
        .then((mail) => {
          return trx("users").returning("*").insert({
            email: email,
            name: name,
            joined: new Date(),
          });
        })
        .then(async (user) => {
          const data = await createSession(user[0]);
          if (data) {
            res.json(data);
            trx.commit();
          } else {
            res.status(400).json({ message: "Something went wrong" });
          }
        })

        .catch(trx.rollback);
    })
    .catch((err) => {
      return res.json({ message: "email already exists" });
    });
};

module.exports = {
  handlereg: handlereg,
};
