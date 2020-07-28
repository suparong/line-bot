const rq = require('request-promise')
const _ = require('lodash')

async function checkPage(message) {
    /**
    *  &submit=117339288819900,zone=none
    */
    console.log("message ==============>", message)
    let urlParams = new URLSearchParams(message)
    let page_id = urlParams.get('submit')
    let zone = urlParams.get('zone')
    let options = {
        'method': 'POST',
        'url': 'http://localhost:8080/checkPage',
        'headers': {
            'page_id': `${page_id}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "zone": `${zone}` })
    }
    console.log("options =========>", options)
    let res = {
        "status": false,
        "type": 1
    }
    // let res = await rq(options)
    /**
     * {
     * "status": false || true,
     * "type": 1 || 2 || 3
     * }
     */
    if (!res.status && res.type === "1") return { type: "text", text: `มีคนส่งไปแล้วนะ` }
    if (!res.status && res.type === "2") return { type: "text", text: `มีในระบบเราแล้วนะ` }
    if (res.status && res.type === "3") return { type: "text", text: `ส่งให้แล้วนะ รอ approve นะ` }



}
async function checkConfig() {
    /**
     * nope
     */
}

module.exports = {
    checkPage,
    checkConfig
}

