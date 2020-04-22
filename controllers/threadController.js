const { Thread, Comment, User } = require('../models')
const { Op } = require("sequelize");

class Controller {
    static createThread(req, res, next){
        const data = {
            title: req.body.title,
            description: req.body.description,
            long: req.body.long,
            lat: req.body.lat,
            UserId: req.userId,
            img_url: req.body.img_url,
            status: 1
        }

        Thread.create(data)
        .then(({ id })=> {
            res.status(201).json({ id, msg: 'Thread succesfully created' })
        })
        .catch(next)
    }

    static fetchAllThread(req, res, next){
        Thread.findAll({
            where: {
                status: {
                    [Op.not]: 3
                }
            },
            include: [{
                model: Comment
            }, {
                model: User
            }],
            order: ['id']
        })
        .then(result => {
            res.status(200).json({
                data: result
            })
        })
        .catch(next)
    }

    static fetchThreadById(req, res, next){
        Thread.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Comment,
                include: [{ model : User }]
            }, {
                model: User
            }]
        })
        .then(result => {
            if(result) {
                res.status(200).json({
                    data: result
                })
            } else {
                throw ({
                    statusCode: 404,
                    msg: 'Data not found'
                })
            }
            
        })
        .catch(next)
    }

    static editThread(req, res, next){
        const data = {
            title: req.body.title,
            description: req.body.description,
            long: req.body.long,
            lat: req.body.lat,
            UserId: req.userId,
            status: 1
        }
        Thread.update(data,{
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            res.status(200).json({ msg: 'Thread succesfully edited' })
        })
        .catch(next)
    }

    static updateStatusUnresolved(req, res, next){
        Thread.update({
            status: 1
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            res.status(200).json({ msg: 'Status updated' }) 
        })
        .catch(next)
    }

    static updateStatusRequested(req, res, next){
        Thread.update({
            status: 2
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            res.status(200).json({ msg: 'Status updated' }) 
        })
        .catch(next)
    }

    static updateStatusResolved(req, res, next){
        Thread.update({
            status: 3
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            res.status(200).json({ msg: 'Status updated' }) 
        })
        .catch(next)
    }

    static deleteThread(req, res , next){
        Thread.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            res.status(200).json({ msg: 'Thread succesfully deleted' })
        })
        .catch(next)
    }

    static createComment(req, res , next){
        const data = {
            message: req.body.message,
            ThreadId: req.params.id,
            UserId: req.userId
        }

        Comment.create(data)
        .then(_ => {
            res.status(201).json({ msg: 'Comment succesfully created' })
        })
        .catch(next)
    }

}

module.exports = Controller