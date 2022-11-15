const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient();
const redisStart = async () => {
  await redisClient
    .connect()
    .then(() => {
      console.log("Redis ready");
    })
    .catch(() => {
      console.log("Redis connection error");
    });
};
redisStart();

const getAuthTokenId = async (req, res, db) => {
  const { authorization } = req.headers;
  const id = await redisClient.get(authorization);
  if (id) {
    return await db
      .select("*")
      .from("users")
      .where({
        id,
      })
      .returning("*")
      .then((data) => {
        res.json(data[0]);
      });
  }
  return res.json("unauthorized");
};

const createSession = async (user) => {
  const { email, id } = user;
  const token = jwt.sign({ email }, "JWT_SECRET", { expiresIn: "2 days" });

  await redisClient.set(token, id);
  return Object.assign(user, { success: "true", token });
};

const deleteSession = async (token) => {
  const res = await redisClient.del(token);
  if (res) {
    return {
      success: 1,
    };
  }
};

module.exports = {
  createSession,
  getAuthTokenId,
  deleteSession,
};
