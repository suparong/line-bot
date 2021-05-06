const rq = require('request-promise')
const _ = require('lodash')
const { logger } = require('@zanroo/init')

const QUERY = 'about,picture{url},fan_count,name'
const QUERY_INFO = 'link,name,fan_count,talking_about_count,rating_count,category_list,artists_we_like,country_page_likes,picture{url}'
const ACCESS_TOKEN = '219923916263193|b8dd9b42b4bc5fe90cc14feb5c3bfac2'
const URL_API = 'https://graph.facebook.com/v9.0'

async function checkPage (page_id) {
  // console.log("================== checkPage")
  logger.info('info', 'checking page', 'Page id : ', JSON.stringify(page_id))
  try {
    const options = {
      method: 'POST',
      url: 'http://172.16.200.51:8082/checkPage',
      headers: {
        page_id: `${page_id}`,
        'Content-Type': 'application/json'
      }
    }
    const body = await rq(options)
    // console.log("11111111111111111111111111", body)
    return body
  } catch (error) {
    logger.error('error', JSON.stringify(error))
    // console.log("ERROR : ", error)
  }
}

async function insertPage (pageInfo) {
  // console.log("================== insertPage")
  logger.info('info', 'insert page in DB')
  try {
    const options = {
      method: 'POST',
      url: 'http://172.16.200.51:8082/facebookApprove',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pageInfo)

    }
    const body = await rq(options)
    // console.log("11111111111111111111111111", body)
    return body
  } catch (error) {
    logger.error('error', JSON.stringify(error))
    // console.log("ERROR : ", error)
  }
}

async function checkConfig (domain) {
  console.log('================== checkConfig')
  /**
     * domain = "land-house"
     */
  const options = {
    method: 'POST',
    url: 'http://172.16.200.51:8082/checkConfig',
    headers: {
      config_name: `${domain}`
    }
  }
  const list = await rq(options)
  return JSON.parse(list)
}

async function insertConfig (configInfo) {
  // console.log("================== insertConfig")
  logger.info('info', 'insert config in DB')
  try {
    const options = {
      method: 'POST',
      url: 'http://172.16.200.51:8082/configApprove',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configInfo)

    }
    // console.log(options)
    const body = await rq(options)
    // console.log("11111111111111111111111111", body)
    return body
  } catch (error) {
    logger.error('error', JSON.stringify(error))
    // console.log("ERROR : ", error)
  }
}

async function checkMessage (_id) {
  try {
    // console.log("===========> checkMessage")
    logger.info('info', 'checking message', 'message id : ', JSON.stringify(_id))
    const options = {
      method: 'POST',
      url: 'http://172.16.200.51:8082/checkMessages',
      headers: {
        _id: `${_id}`
      }
    }
    const statusMsg = await rq(options)
    return JSON.parse(statusMsg)
  } catch (error) {
    logger.error('error', JSON.stringify(error))
  }
}

async function insertUserLine (user_token, user_name) {
  console.log('===========> insertUserLine')
  const options = {
    method: 'POST',
    url: 'http://172.16.200.51:8082/insertUser',
    headers: {
      _id: user_token,
      name: user_name,
      status: 0
    }
  }
  const statusUser = await rq(options)
  return JSON.parse(statusUser)
}

async function checkUserLine (user_token) {
  console.log('===========> checkUserLine')
  const options = {
    method: 'POST',
    url: 'http://172.16.200.51:8082/checkUser',
    headers: {
      _id: user_token
    }
  }
  const statusUser = await rq(options)
  return JSON.parse(statusUser)
}

async function apiFbSearchPage (page) {
  try {
    logger.info('info', 'Search page', 'page id : ', JSON.stringify(page))
    const options = {
      method: 'GET',
      url: `${URL_API}/${page}?fields=${QUERY}&access_token=${ACCESS_TOKEN}`,
      headers: {
      },
      json: true
    }
    const pageInfo = await rq(options)
    return { status: true, body: pageInfo }
  } catch (error) {
    logger.error('error', JSON.stringify(error))
    // console.log(error.statusCode)
    if (error.statusCode === 403) {
      return { status: false, body: error.statusCode, tag: 1 }
    }
    return { status: false, body: error.statusCode, tag: 2 }
  }
}

async function searchPageInfo (page_id, zone, tag, user_token) {
  try {
    // console.log("+++++++++++++++++ searchPageInfo")
    logger.info('info', 'Search page info', 'page id : ', JSON.stringify(page_id))
    const options = {
      method: 'GET',
      url: `${URL_API}/${page_id}?fields=${QUERY_INFO}&access_token=${ACCESS_TOKEN}`,
      headers: {
      },
      json: true
    }
    const pageInfo = await rq(options)
    pageInfo.zone = zone
    if (tag === '1') {
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
    return { status: true, body: pageInfo, tag: 1 }
  } catch (error) {
    logger.error('error', JSON.stringify(error))
    // console.log(error.statusCode)
    if (error.statusCode === 403) {
      return { status: false, body: error.statusCode, tag: 1 }
    }
    return { status: false, body: error.statusCode, tag: 2 }
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
