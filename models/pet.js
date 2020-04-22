'use strict';
module.exports = (sequelize, DataTypes) => {
  class Pet extends sequelize.Sequelize.Model {}

  Pet.init({
    name: DataTypes.STRING,
    species: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Please insert cats's owner id`
        },
        notEmpty: {
          msg: `Please insert cats's owner id`
        }
      }
    },
    birth_date: DataTypes.DATE,
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Please insert pet description`
        },
        notEmpty: {
          msg: `Please insert pet description`
        }
      }
    },
    status: DataTypes.INTEGER,
    request_user_id: DataTypes.INTEGER,
    img_url: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(pet, options) {
        if (!pet.status) {
          pet.status = 0
        }
        if (!pet.name) {
          pet.name = "no name"
        }
        if (!pet.species) {
          pet.name = "unknown"
        }
      }
    },
    sequelize
  })
  Pet.associate = function(models) {
    Pet.belongsTo(models.User);
  };
  return Pet;
};