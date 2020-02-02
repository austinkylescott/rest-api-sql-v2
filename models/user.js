const Sequelize = require("sequelize");

// User Model
module.exports = sequelize => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"First Name" is required.'
          }
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Last Name" is required.'
          }
        }
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Email Address" is required.'
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Password" is required.'
          }
        }
      }
    },
    { sequelize }
  );

  //Set up associations
  User.associate = models => {
    User.hasMany(models.Course, {
      as: "user",
      foreignKey: { fieldName: "userId", allowNull: false }
    });
  };

  return User;
};
