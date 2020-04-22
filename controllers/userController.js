const { User, Thread } = require('../models')
const { verifyPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class Controller {
    static login(req, res, next){
        const { email, password } = req.body
        
        User.findOne({
            where: {
                email
            },
            include: {
                model: Thread
            }
        })
        .then(result => {
            if(!result){
                throw({
                    statusCode: 400,
                    msg: 'Wrong email/password'
                })
            }else {
                if(verifyPassword(password, result.password)){
                    const token = generateToken(result.id)
                    console.log(result.Threads)
                    res.status(200).json({
                        token,
                        id: result.id,
                        first_name: result.first_name,
                        email: result.email,
                        img_url: result.img_url,
                        city: result.city,
                        Threads: result.Threads
                    })
                }
                else{
                    throw ({
                        statusCode: 400,
                        msg: 'Wrong email/password'
                    })
                }
            }
        })
        .catch(next)
    }

    static register(req, res, next){
        const data = {
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,
            bio: req.body.bio,
            city: req.body.city,
            img_url: req.body.img_url,
        }

        User.findOne({
            where: {
                email: data.email
            }
        })
        .then(result => {
            if(result){
                throw ({
                    statusCode: 400,
                    msg: 'Email has already been used'
                })
            }
            else{
                return User.create(data)
            }
        })
        .then(result => {
            const token = generateToken(result.id)
            res.status(201).json({
                token,
                id: result.id,
                first_name: result.first_name,
                email: result.email,
                img_url: result.img_url,
                city: result.city,
            })
        })
        .catch(next)
        
    }

    static findUser(req, res, next){
        const id = req.params.id

        User.findOne({
            where: {
                id
            }
        })
        .then(result => {
            res.status(200).json({
                first_name: result.first_name,
                last_name: result.last_name,
                phone_number: result.phone_number,
                email: result.email,
                img_url: result.img_url,
                city: result.city,
                bio: result.bio,
                id: result.id
            })
        })
        .catch(next)
    }
}

module.exports = Controller