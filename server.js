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
    host: process.env.DATABASE_URL,
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

app.post("/register", (req, res) => reg.handlereg(req, res, pg, bycrypt));

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
