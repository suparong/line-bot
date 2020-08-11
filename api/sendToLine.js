
const rq = require('request-promise')
const _ = require('lodash')

// const token = 'd6i2fyYzfSkdRgb2Hkin4O0iQvAAZ0unnnJtXq+sDK4489KVruPrP12Z7vx2UHoWE/DLlF5+vaagJ3Qv9WLqS+vO7SbDkPsp8OX6tzSvlUOifuoseFn9iGdYxokwiXRlVTyn4u/UedPPn0RGCECsHQdB04t89/1O/w1cDnyilFU='
// token-test
const token = '0zTssGCqCWcU++oW2esVPcVc7aZ6c+/vVnrpU4nGz846s2pPurIEVEtt/xovGTxSOge8PbXVOfS08Zvg0LpzPOad/R55Cyxc27WHzB5YW8084hVaSZKgurtclTITVTUvvEI0hdMFnfExIStEarI4MQdB04t89/1O/w1cDnyilFU='

const { facebook, getPageInfo } = require('./facebook')
const { help } = require('./help')
const { web, getConfigInfo } = require('./web')
const { checkMsgFB, checkMsgTW, checkMsgYT, checkMsgIG, checkMsgPT } = require('./messages')



async function reply(req) {
    try {
        let newres = await setBody(req)
        console.log("=============>", newres)
        /**
         * url :reply,push,multicast,Broadcast
         */
        pushBody(newres)
    } catch (error) {
        console.log("error : ", error)
    }


}

async function setBody(req) {
    /**
 *  messages In
 * {
  "events": [
    {
      "type": "message",
      "replyToken": "b669db6edb5e48dbb5961ab8...",
      "source": {
        "userId": "U3c28a70ed7c5e7ce2c9a7597...",
        "type": "user"
      },
      "timestamp": 1531072356142,
      "message": {
        "type": "text",
        "id": "82347...",
        "text": "ทดสอบ"
      }
    }
  ]
}
 */
    let body
    try {
        // let reply_token = req.body.events[0].replyToken
        // console.log(req.body)
        let replyToken = req.body.events[0].replyToken
        let user_token = req.body.events[0].source.userId
        // let user_token = "Ue811773dc55c06f5ad786782d0626f8c"
        let msg = req.body.events[0].message.text
        body = {
            "replyToken": replyToken,
            "messages": []
        }

        let message = msg.toLowerCase()
        console.log(typeof (message), message)

        if (message.indexOf("facebook") === 12 || _.includes(message, "www.facebook.com") || _.includes(message, "facebook.com") || _.includes(message, "facebook")) {
            /**
            * fb&add=TidPromo,https://www.facebook.com/Mommy-Is-Here-108444714131126?zone=th
            */
            if (_.includes(message, "permalink") || _.includes(message, "videos") || _.includes(message, "posts") || _.includes(message, "photos") || _.includes(message, "watch")) {
                console.log("messages facebook")
                let data = await checkMsgFB(message)
                // let data = { "type": "flex", "altText": "new messages", "contents": { "type": "bubble", "header": { "type": "box", "layout": "vertical", "contents": [{ "type": "text", "text": "Message status" }] }, "body": { "type": "box", "layout": "vertical", "contents": [{ "type": "box", "layout": "vertical", "contents": [{ "type": "box", "layout": "horizontal", "contents": [{ "type": "box", "layout": "vertical", "contents": [{ "type": "text", "contents": [{ "type": "span", "text": "_id", "weight": "bold", "color": "#000000" }, { "type": "span", "text": " : " }, { "type": "span", "text": "fb_204234332938286_301148657763460", "size": "xs" }], "size": "sm", "wrap": true }, { "type": "text", "contents": [{ "type": "span", "text": "Link", "weight": "bold", "color": "#000000" }, { "type": "span", "text": " : " }, { "type": "span", "text": "https://www.facebook.com/TrueMoveH/videos/301148657763460/", "size": "xs" }], "size": "sm", "wrap": true }, { "type": "text", "contents": [{ "type": "span", "text": "Channel", "weight": "bold", "color": "#000000" }, { "type": "span", "text": " : " }, { "type": "span", "text": "facebook", "size": "xs" }], "size": "sm", "wrap": true }, { "type": "text", "contents": [{ "type": "span", "text": "Zone", "weight": "bold", "color": "#000000" }, { "type": "span", "text": " : " }, { "type": "span", "text": "th", "size": "xs" }], "size": "sm", "wrap": true }, { "type": "text", "contents": [{ "type": "span", "text": "Created_Time", "weight": "bold", "color": "#000000" }, { "type": "span", "text": " : " }, { "type": "span", "text": "2020-08-07T13:18:15", "size": "xs" }], "size": "sm", "wrap": true }, { "type": "text", "contents": [{ "type": "span", "text": "Sys_Time", "weight": "bold", "color": "#000000" }, { "type": "span", "text": " : " }, { "type": "span", "text": "2020-08-08T09:00:03", "size": "xs" }], "size": "sm", "wrap": true }, { "type": "text", "contents": [{ "type": "span", "text": "Cts", "weight": "bold", "color": "#000000" }, { "type": "span", "text": " : " }, { "type": "span", "text": "2020-08-09T02:58:37", "size": "xs" }], "size": "sm", "wrap": true }] }], "spacing": "xl", "paddingAll": "20px" }], "backgroundColor": "#E8EBED", "offsetStart": "10px", "offsetBottom": "20px", "width": "280px", "paddingTop": "10px", "paddingBottom": "0px" }], "paddingAll": "0px" }, "footer": { "type": "box", "layout": "vertical", "spacing": "sm", "contents": [{ "type": "button", "style": "link", "height": "sm", "action": { "type": "uri", "label": "Link", "uri": "http://linecorp.com/" } }], "paddingTop": "0px", "paddingBottom": "0px", "offsetTop": "-10px" } } }
                body.messages.push(data)
            } else {
                console.log("facebook")
                let data = await facebook(message)
                body.messages.push(data)
            }
        } else if (message.indexOf("twitter") === 12 || _.includes(message, "www.twitter.com") || _.includes(message, "twitter.com") || _.includes(message, "twitter")) {
            console.log("twitter")
            await checkMsgTW(message)
        } else if (message.indexOf("youtube") === 12 || _.includes(message, "www.youtube.com") || _.includes(message, "youtube.com") || _.includes(message, "youtube"), _.includes(message, "youtu")) {
            console.log("youtube")
            await checkMsgYT(msg)
        } else if (message.indexOf("instagram") === 12 || _.includes(message, "www.instagram.com") || _.includes(message, "instagram.com") || _.includes(message, "instagram")) {
            console.log("instagram")
            await checkMsgIG(msg)
        } else if (message.indexOf("pantip") === 12 || _.includes(message, "www.pantip.com") || _.includes(message, "pantip.com") || _.includes(message, "pantip")) {
            console.log("pantip")
            await checkMsgPT(message)
        } else if (_.includes(message, "submit") && _.includes(message, "zone")) {
            console.log("submit")
            if (_.includes(message, "fb")) {
                // console.log("=========> FB")
                let data = await getPageInfo(message, user_token)
                body.messages.push(data)
            } else if (_.includes(message, "web")) {
                // console.log("=========> WEB")
                let data = await getConfigInfo(message, user_token)
                body.messages.push(data)
            }
        } else if (_.includes(message, "help")) {
            console.log("help")
            let data = await help()
            await _.map(data, (a) => { body.messages.push(a) })
        } else if (_.includes(message, "web")) {
            console.log("web")
            let data = await web(message)
            body.messages.push(data)
        } else {
            console.log("other")
            // body.messages.push({
            //     type: "sticker",
            //     packageId: 11537,
            //     stickerId: 52002744
            // })
            body.messages.push({
                type: `text`,
                text: msg
            })
        }
    } catch (error) {
        console.log(error)
    } finally {
        return JSON.stringify(body)
    }


}

async function formatData(body) {
    try {
        return {
            "to": body.line_token,
            "messages": [{ type: "text", text: `Page "${body.page_name}" has been approved` }]
        }
    } catch (error) {
        console.log("=======>", error)
    }
}


async function pushBody(newres) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    let options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/push',
        headers,
        body: newres // Automatically stringifies the body to JSON
    }
    const res = await rq(options)
    console.log('status = ' + JSON.stringify("DONE"));
}

async function replyBody(newres) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    let options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/reply',
        headers,
        body: newres // Automatically stringifies the body to JSON
    }
    const res = await rq(options)
    console.log('status = ' + JSON.stringify("DONE"));
}


module.exports = {
    reply,
    pushBody,
    setBody,
    formatData,
    replyBody
}