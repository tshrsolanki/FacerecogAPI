const handlereg = (req, res, pg, bycrypt) => {
  const { email, name, password } = req.body;
  const hash = bycrypt.hashSync(password);
  pg.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((mail) => {
        trx("users")
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
  }).catch((err) => res.json("unable"));
};

module.exports = {
  handlereg: handlereg,
};
