const express = require("express");
const body = require("body-parser");
const bycrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const reg = require("./controll/reg");
const sign = require("./controll/sign");
const image = require("./controll/image");
const { redisStart } = require("./sessions");
// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "aimgod",
    database: "smartbrain",
  },
});

const app = express();
app.use(cors());
app.use(body.json());

app.get("/", (req, res) => {
  res.send("it is working");
});
app.post("/signout", async (req, res) => {
  const { authorization } = req.headers;
  const { deleteSession, redisStart } = require("./sessions");
  const data = await deleteSession(authorization);
  res.json(data);
});
app.post("/signin", (req, res) => {
  sign.signInAuthentication(req, res, db, bycrypt);
});

app.post("/register", (req, res) => {
  reg.handlereg(req, res, db, bycrypt);
});

app.put("/image", (req, res) => {
  image.handleimage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleapi(req, res, db);
});
app.post("/profile/:id", (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  db("users")
    .where({ id })
    .update({ name })
    .returning("*")
    .then((data) => {
      res.json(data[0]);
    });
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
      } else {
        res.json("not found");
      }
    });
});

const start = async () => {
  await redisStart();
  app.listen(5000 || process.env.PORT, () => {
    console.log(`app is runnning at port ${process.env.PORT || 5000} `);
  });
};
start();
