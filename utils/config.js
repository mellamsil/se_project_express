// const JWT_SECRET = "secretkey"; // we will hide the key from other developers.

// module.exports = { JWT_SECRET };

// module.exports = {
//   JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
// };

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

module.exports = {
  JWT_SECRET,
};
