const handlereg = (req, res, db, bycrypt) => {
  const { email, password, name } = req.body;
  const hash = bycrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((mail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json(err));
};

module.exports = {
  handlereg: handlereg,
};
