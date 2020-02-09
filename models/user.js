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
          },
          notNull: {
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
          },
          notNull: {
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
          },
          notNull: {
            msg: '"Email Address" is required.'
          },
          is: {
            args: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            msg: "Enter a valid email address."
          }
        },
        unique: {
          msg: "Email address is already in use."
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: '"Password" is required.'
          },
          notNull: {
            msg: '"Password" is required.'
          }
        }
      }
    },
    { sequelize }
  );

  //Set up associations
  User.associate = models => {
    User.hasMany(models.Course);
  };

  return User;
};
