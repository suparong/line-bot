const rq = require('request-promise')
const _ = require('lodash')

const { insertUserLine, checkUserLine } = require('./sendToApi')

async function insertUser(user_token, message) {
    let user_name = message.split("=")[1]
    console.log(user_name)
    let status = await insertUserLine(user_token, user_name)
    /**
    * status = true | false
    */
    return status
}

async function checkUser(user_token) {
    let status = await checkUserLine(user_token)
    /**
     * status = true | false
     */
    return status
}

module.exports = {
    insertUser,
    checkUser
}