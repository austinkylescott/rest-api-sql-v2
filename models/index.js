const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./fsjstd-restapi.db"
});

const db = { sequelize, Sequelize, models: {} };
db.models.User = require("./User.js")(sequelize);
db.models.Course = require("./Course.js")(sequelize);

// Test database connection
sequelize
  .authenticate()
  .then(function(err) {
    console.log("Connection has been established successfully.");
  })
  .catch(function(err) {
    console.log("Unable to connect to the database:", err);
  });

module.exports = db;
