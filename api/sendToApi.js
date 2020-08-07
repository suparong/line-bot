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
    console.log("================== configInfo")
    try {
        let options = {
            'method': 'POST',
            'url': 'http://192.168.19.23:8082/configApprove',
            'headers': {
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(configInfo)

        }
        console.log(options)
        // let body = await rq(options)
        // console.log("11111111111111111111111111", body)
        // return body

    } catch (error) {
        console.log("ERROR : ", error)
    }
}

module.exports = {
    checkPage,
    checkConfig,
    insertPage,
    insertConfig
}

