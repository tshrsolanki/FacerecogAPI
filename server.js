const express = require("express");
const body = require("body-parser");
const bycrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const reg = require("./controll/reg");
const sign = require("./controll/sign");
const image = require("./controll/image");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const app = express();
app.use(body.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("it is working");
});

app.post("/signin", (req, res) => {
  sign.handlesign(req, res, db, bycrypt);
});

app.post("/register", (req, res) => {
  reg.handlereg(req, res, db, bycrypt);
});

app.put("/image", (req, res) => {
  image.handleimage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleapi(req, res);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
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
