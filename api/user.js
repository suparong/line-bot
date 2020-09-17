const rq = require('request-promise')
const _ = require('lodash')
const { logger } = require('@zanroo/init');

const { insertUserLine, checkUserLine } = require('./sendToApi')

async function insertUser(user_token, message) {
    try {
        let user_name = message.split("=")[1]
        // console.log(user_name)
        logger.info('info', 'insert user', 'name : ', JSON.stringify(user_name), 'token : ', JSON.stringify(user_token))
        let status = await insertUserLine(user_token, user_name)
        /**
        * status = true | false
        */
        return status
    } catch (error) {
        logger.error('error', JSON.stringify(error))
    }

}

async function checkUser(user_token) {
    try {
        let status = await checkUserLine(user_token)
        /**
         * status = true | false
         */
        return status
    } catch (error) {
        logger.error('error', JSON.stringify(error))
    }

}

module.exports = {
    insertUser,
    checkUser
}