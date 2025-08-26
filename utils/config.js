// const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const { JWT_SECRET = "dev-secret" } = process.env;

module.exports = {
  JWT_SECRET,
};
