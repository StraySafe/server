'use strict';

const { hashPassword } = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model{}
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please insert your email'
        },
        notEmpty: {
          msg: 'Please insert your email'
        },
        isEmail: {
          msg: 'Email is not valid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please insert your password'
        },
        notEmpty: {
          msg: 'Please insert your password'
        },
        len: {
          args: [5],
          msg: 'Your password is too short'
        }
        
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please insert your name'
        },
        notEmpty: {
          msg: 'Please insert your name'
        }
      }
    },
    last_name: DataTypes.STRING,
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please insert your phone number'
        },
        notEmpty: {
          msg: 'Please insert your phone number'
        }
      }
    },
    bio: DataTypes.STRING,
    img_url: DataTypes.STRING,
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please insert your city residency'
        },
        notEmpty: {
          msg: 'Please insert your city residency'
        }
      }
    },
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = hashPassword(user.password)
      }
    },
    sequelize,
    modelName: 'User'
  });
  User.associate = function(models) {
    User.hasMany(models.Thread)
    User.hasMany(models.Comment)
    User.hasMany(models.Pet)
  };
  return User;
};