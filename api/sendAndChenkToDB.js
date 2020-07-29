const rq = require('request-promise')
const _ = require('lodash')
const { URLSearchParams } = require('url')

async function checkPage(message) {
    try {
        /**
        *  &submit=117339288819900,zone=none
        */
        console.log("message ==============>", message)
        let urlParams = new URLSearchParams(message)
        let page_id = urlParams.get('submit')
        let zone = urlParams.get('zone')
        let options = {
            'method': 'POST',
            'url': '192.168.19.23:8082/checkPage',
            'headers': {
                'page_id': `${page_id}`,
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify({ "zone": `${zone}` })
        }
        // console.log("options =========>", options)
        // let body = {
        //     "status": false,
        //     "type": 1
        // }
        let body = await rq(options)
        console.log("============+>", body)
        /**
         * {
         * "status": false || true,
         * "type": 1 || 2 || 3
         * }
         */

        if (body.status === false && body.type === 1) {
            console.log("1")
            return { type: "text", text: `มีคนส่งไปแล้วนะ` }
        }
        if (body.status === false && body.type === 2) {
            console.log("2")
            return { type: "text", text: `มีในระบบเราแล้วนะ` }
        }
        if (body.status === true && body.type === 3) {
            console.log("3")
            return { type: "text", text: `ส่งให้แล้วนะ รอ approve นะ` }
        }

    } catch (error) {
        console.log("ERROR : ", error)
    }

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

