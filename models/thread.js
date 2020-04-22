'use strict';
module.exports = (sequelize, DataTypes) => {
  class Thread extends sequelize.Sequelize.Model{}
  Thread.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please insert the title'
        },
        notEmpty: {
          msg: 'Please insert the title'
        }
      }
    },
    description: DataTypes.STRING,
    long: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please choose the location'
        },
        notEmpty: {
          msg: 'Please choose the location'
        }
      }
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please choose the location'
        },
        notEmpty: {
          msg: 'Please choose the location'
        }
      }
    },
    UserId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Thread'
  });
  Thread.associate = function(models) {
    Thread.hasMany(models.Comment)
    Thread.belongsTo(models.User)
  };
  return Thread;
};