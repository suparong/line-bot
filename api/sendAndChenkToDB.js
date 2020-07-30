const rq = require('request-promise')
const _ = require('lodash')
const { URLSearchParams } = require('url')

async function checkPage(pageInfo) {
    console.log("================== checkPage")
    try {
        let options = {
            'method': 'POST',
            'url': 'http://192.168.19.23:8082/checkPage',
            'headers': {
                'page_id': `${pageInfo.id}`,
                'Content-Type': 'application/json'
            }
        }
        let body = await rq(options)
        console.log("11111111111111111111111111", body)
        return JSON.parse(body)

    } catch (error) {
        console.log("ERROR : ", error)
    }

}

async function insertPage(pageInfo, zone) {

}

async function checkConfig() {
    /**
     * nope
     */
}

module.exports = {
    checkPage,
    checkConfig,
    insertPage
}

