const { Thread } = require('../models');
const notFound = "Pet Not Found!";
const unAuthorize = "You are not authorized";
const CustomError = require('../helpers/customError');

function authorization(req, res, next) {
  let userId = req.userId;
  let param = req.params.id;
  Thread.findOne({
    where: {
      id: param
    }
  })
    .then((result) => {
      if (result.UserId == userId) {
        next();
      } else {
        throw new CustomError(401, unAuthorize)
      }
    }).catch((err) => {
      next(err);
    });
}

module.exports = authorization;
