const express = require("express");
const body = require("body-parser");
const bycrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const reg = require("./controll/reg");
const sign = require("./controll/sign");
const image = require("./controll/image");

const pg = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();
app.use(body.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("it is working");
});

app.post("/signin", (req, res) => {
  sign.handlesign(req, res, pg, bycrypt);
});

// app.post("/register", (req, res) => {
//   reg.handlereg(req, res, pg, bycrypt);
// });
app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
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
        return trx("users")
          .returning("*")
          .insert({
            email: mail[0],
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
});

app.put("/image", (req, res) => {
  image.handleimage(req, res, pg);
});
app.post("/imageurl", (req, res) => {
  image.handleapi(req, res);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  pg.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((users) => {
      if (users.length) {
        console.log(users[0]);
      } else {
        res.json("not found");
      }
    });
});
app.listen(process.env.PORT || 5000, () => {
  console.log(`app is runnning at port ${process.env.PORT} `);
});
