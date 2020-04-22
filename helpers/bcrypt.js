const bcrypt = require('bcryptjs')

function hashPassword(password){
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

function verifyPassword(passwordFromUser, passwordFromDB){
    return bcrypt.compareSync(passwordFromUser, passwordFromDB)
}

module.exports = {
    hashPassword,
    verifyPassword
}