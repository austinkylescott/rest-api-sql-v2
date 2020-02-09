const Sequelize = require("sequelize");

// Course model
module.exports = sequelize => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: '"UserId" is required.'
          },
          notEmpty: {
            msg: '"UserId" is required.'
          }
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "'Title' is required."
          },
          notEmpty: {
            msg: '"Title" is required.'
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "'Description' is required."
          },
          notEmpty: {
            msg: '"Description" is required.'
          }
        }
      },
      estimatedTime: {
        type: Sequelize.STRING
      },
      materialsNeeded: {
        type: Sequelize.STRING
      }
    },
    { sequelize }
  );

  //Set up associations
  Course.associate = models => {
    Course.belongsTo(models.User);
  };

  return Course;
};
