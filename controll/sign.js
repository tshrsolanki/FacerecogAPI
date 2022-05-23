const handlesign = (req, res, pg, bycrypt) => {
  pg.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const vaild = bycrypt.compareSync(req.body.password, data[0].hash);
      if (vaild) {
        return pg
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((u) => {
            res.json(u[0]);
          })
          .catch("unable");
      } else {
        res.json("wrong credentials");
      }
    })
    .catch((err) => res.json(err));
};

module.exports = {
  handlesign: handlesign,
};
