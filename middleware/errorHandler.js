"use strict"

module.exports = function (err, req, res, next) {
    if (err.name) {
        switch (err.name) {
            case "SequelizeValidationError":
                res.status(400).json({
                    msg: err.errors[0].message
                })
                break
            default:
                res.status(500).json({
                    msg: err.message
                })
                break
        }
    }
    if (err.statusCode) {
        res.status(err.statusCode).json({
            msg: err.msg
        })
    }
}