const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./fsjstd-restapi.db"
});

const db = { sequelize, Sequelize, models: {} };
db.models.User = require("./User.js")(sequelize);
db.models.Course = require("./Course.js")(sequelize);

Object.keys(db.models).forEach(modelName => {
  if (db.models[modelName].associate) {
    console.info(`Configuring the associations for the ${modelName} model...`);
    db.models[modelName].associate(db.models);
  }
});

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
