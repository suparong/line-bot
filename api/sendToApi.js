const rq = require('request-promise')
const _ = require('lodash')
const { logger } = require('@zanroo/init');

const QUERY = "about,picture{url},fan_count,name"
const QUERY_INFO = "link,name,fan_count,talking_about_count,rating_count,category_list,artists_we_like,country_page_likes,picture{url}"
const ACCESS_TOKEN = 'EAAG4BSmPZAe0BAJY7m7gJMHo4PEuI7ZALkbwcahHtru424qdIC5Ft6yMtkWWa38QDy5tEEWbOeMRTcqK7Q5lLBNtI8teRDIB9SEqqEHAC6LObgINf7SEKZCmhxCiQ3pO0ScJzSfVkvbtoZAPP1W4TckbMfTXn3qZAJuA8lByb5AZDZD'
const URL_API = "https://graph.facebook.com/v4.0"

async function checkPage(page_id) {
    // console.log("================== checkPage")
    logger.info('info', 'checking page', 'Page id : ', JSON.stringify(page_id))
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
        logger.error('error', JSON.stringify(error))
        // console.log("ERROR : ", error)
    }
}

async function insertPage(pageInfo) {
    // console.log("================== insertPage")
    logger.info('info', 'insert page in DB')
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
        logger.error('error', JSON.stringify(error))
        // console.log("ERROR : ", error)
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
    // console.log("================== insertConfig")
    logger.info('info', 'insert config in DB')
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
        logger.error('error', JSON.stringify(error))
        // console.log("ERROR : ", error)
    }
}

async function checkMessage(_id) {
    try {
        // console.log("===========> checkMessage")
        logger.info('info', 'checking message', 'message id : ', JSON.stringify(_id))
        let options = {
            'method': 'POST',
            'url': 'http://192.168.19.23:8082/checkMessages',
            'headers': {
                '_id': `${_id}`
            }
        }
        let statusMsg = await rq(options)
        return JSON.parse(statusMsg)
    } catch (error) {
        logger.error('error', JSON.stringify(error))
    }

}

async function insertUserLine(user_token, user_name) {
    console.log("===========> insertUserLine")
    let options = {
        'method': 'POST',
        'url': 'http://192.168.19.23:8082/insertUser',
        'headers': {
            '_id': user_token,
            'name': user_name,
            'status': 0
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

async function apiFbSearchPage(page) {
    try {
        logger.info('info', 'Search page', 'page id : ', JSON.stringify(page))
        let options = {
            'method': 'GET',
            'url': `${URL_API}/${page}?fields=${QUERY}&access_token=${ACCESS_TOKEN}`,
            'headers': {
            }, json: true
        }
        let pageInfo = await rq(options)
        return pageInfo
    } catch (error) {
        logger.error('error', JSON.stringify(error))
        // console.log(error)
        return false
    }
}

async function searchPageInfo(page_id, zone, tag, user_token) {
    try {
        // console.log("+++++++++++++++++ searchPageInfo")
        logger.info('info', 'Search page info', 'page id : ', JSON.stringify(page_id))
        let options = {
            'method': 'GET',
            'url': `${URL_API}/${page_id}?fields=${QUERY_INFO}&access_token=${ACCESS_TOKEN}`,
            'headers': {
            }, json: true
        }
        let pageInfo = await rq(options)
        pageInfo.zone = zone
        if (tag === "1") {
            tag = true
        } else {
            tag = false
        }
        /*
            2020-09-15T10:39:06.954Z
        */
        pageInfo.request_time = new Date()
        pageInfo.customer = tag
        pageInfo.line_token = user_token
        return pageInfo
    } catch (error) {
        logger.error('error', JSON.stringify(error))
        // console.log(error)
    }

}

module.exports = {
    checkPage,
    checkConfig,
    insertPage,
    insertConfig,
    checkMessage,
    insertUserLine,
    checkUserLine,
    apiFbSearchPage,
    searchPageInfo
}

