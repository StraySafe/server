'use strict';
module.exports = (sequelize, DataTypes) => {
  class Comment extends sequelize.Sequelize.Model{}
  Comment.init({
    UserId: DataTypes.INTEGER,
    ThreadId: DataTypes.INTEGER,
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please insert your message'
        },
        notEmpty: {
          msg: 'Please insert your message'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Comment'
  });
  Comment.associate = function(models) {
    Comment.belongsTo(models.Thread)
    Comment.belongsTo(models.User)
  };
  return Comment;
};