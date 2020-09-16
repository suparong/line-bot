const rq = require('request-promise')
const _ = require('lodash')

async function checkPage(page_id) {
    console.log("================== checkPage")
    try {
        let options = {
            'method': 'POST',
            'url': 'http://192.168.19.23:8082/checkPage',
            'headers': {
                'page_id': `${page_id}`,
                'Content-Type': 'application/json'
            }
        }
        let body = await rq(options)
        // console.log("11111111111111111111111111", body)
        return body
    } catch (error) {
        console.log("ERROR : ", error)
    }
}

async function insertPage(pageInfo) {
    console.log("================== insertPage")
    try {
        let options = {
            'method': 'POST',
            'url': 'http://192.168.19.23:8082/facebookApprove',
            'headers': {
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(pageInfo)

        }
        let body = await rq(options)
        // console.log("11111111111111111111111111", body)
        return body

    } catch (error) {
        console.log("ERROR : ", error)
    }
}

async function checkConfig(domain) {
    console.log("================== checkConfig")
    /**
     * domain = "land-house"
     */
    let options = {
        'method': 'POST',
        'url': 'http://192.168.19.23:8082/checkConfig',
        'headers': {
            'config_name': `${domain}`
        }
    }
    let list = await rq(options)
    return JSON.parse(list)
}

async function insertConfig(configInfo) {
    console.log("================== insertConfig")
    try {
        let options = {
            'method': 'POST',
            'url': 'http://192.168.19.23:8082/configApprove',
            'headers': {
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(configInfo)

        }
        // console.log(options)
        let body = await rq(options)
        // console.log("11111111111111111111111111", body)
        return body

    } catch (error) {
        console.log("ERROR : ", error)
    }
}

async function checkMessage(_id) {
    console.log("===========> checkMessage")
    let options = {
        'method': 'POST',
        'url': 'http://192.168.19.23:8082/checkMessages',
        'headers': {
            '_id': `${_id}`
        }
    }
    let statusMsg = await rq(options)
    return JSON.parse(statusMsg)
}

async function insertUserLine(user_token, user_name) {
    console.log("===========> insertUserLine")
    let options = {
        'method': 'POST',
        'url': 'http://192.168.19.23:8082/insertUser',
        'headers': {
            '_id': user_token,
            'name': user_name
        }
    }
    let statusUser = await rq(options)
    return JSON.parse(statusUser)
}

async function checkUserLine(user_token) {
    console.log("===========> checkUserLine")
    let options = {
        'method': 'POST',
        'url': 'http://192.168.19.23:8082/checkUser',
        'headers': {
            '_id': user_token
        }
    }
    let statusUser = await rq(options)
    return JSON.parse(statusUser)
}

module.exports = {
    checkPage,
    checkConfig,
    insertPage,
    insertConfig,
    checkMessage,
    insertUserLine,
    checkUserLine
}

