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
          notEmpty: {
            msg: '"UserId" is required.'
          }
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Title" is required.'
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
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
    Course.belongsTo(models.User, {
      as: "user",
      foreignKey: { fieldName: "userId", allowNull: false }
    });
  };

  return Course;
};
