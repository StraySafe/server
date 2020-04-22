const { Pet, User } = require('../models');
const CustomError = require('../helpers/customError');
const notFound = "Pet Not Found!";
const dateCreator = require('../helpers/dateCreator');

class Controller {
  static get(req, res, next) {
    Pet.findAll({
      include: [
        {
          model: User
        }
      ]
    })
      .then((result) => {
        res.status(200).json({ data: result })
      }).catch(next)
  }

  static getById(req, res, next) {
    Pet.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: User
        }
      ]
    })
      .then((result) => {
        if(result) {
          res.status(200).json({ data: result })
        } else {
          throw new CustomError(404, "Pet Not Found!")
        }
      }).catch((err) => {
        console.log(err);
        next(err);
      });
  }

  static create(req, res, next) {
    const { year, month } = req.body;
    // const birthDate = dateCreator.convert(year, month);
    const birthDate = dateCreator.setDate(year, month);
    const createObj = {
      UserId: req.userId,
      name: req.body.name,
      species: req.body.species,
      birth_date: birthDate,
      description: req.body.description,
      img_url: req.body.img_url
    }

    Pet.create(createObj, {
      include: [
        {
          model: User
        }
      ]
    })
      .then((result) => {
        res.status(201).json({ data: result })
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }

  static update(req, res, next) {
    const { year, month } = req.body;
    let birthDate = dateCreator.setDate(year, month);
    const data = {
      UserId: req.userId,
      name: req.body.name,
      species: req.body.species,
      birth_date: birthDate,
      description: req.body.description,
      img_url: req.body.img_url
    }
    if (Number(req.params.id)) {
      Pet.update(data, {
        where: {
          id: req.params.id
        },
        include: [
          {
            model: User
          }
        ],
        returning: true,
      })
        .then((result) => {
          res.status(200).json({ data: result[1][0] })
        }).catch((err) => {
          console.log(err);
          next(err);
        });
    } 
  }

  static updateRequest(req, res, next) {
    let request_user_id = req.userId
    let data = {
      request_user_id
    }
    Pet.update(data, {
      where: {
        id: req.params.id
      },
      returning: true,
    })
      .then((result) => {
        res.status(200).json({ data: result[1][0] })
      }).catch(next)
  }

  static delete(req, res, next) {
    let deletedData;
    Pet.findOne({
      where: {
        id: req.params.id
      }
    })
      .then((result) => {
        deletedData = result;
        if (result) {
          return Pet.destroy({
            where: {
              id: result.id
            }
          })
        } else {
          throw new CustomError(404, notFound)
        }
      })
      .then((result) => {
        res.status(200).json({ data: deletedData })
      }).catch(next)
  }
}

module.exports = Controller;