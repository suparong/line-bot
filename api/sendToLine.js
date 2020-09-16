
const rq = require('request-promise')
const _ = require('lodash')

// const token = 'd6i2fyYzfSkdRgb2Hkin4O0iQvAAZ0unnnJtXq+sDK4489KVruPrP12Z7vx2UHoWE/DLlF5+vaagJ3Qv9WLqS+vO7SbDkPsp8OX6tzSvlUOifuoseFn9iGdYxokwiXRlVTyn4u/UedPPn0RGCECsHQdB04t89/1O/w1cDnyilFU='
// token-test
const token = '0zTssGCqCWcU++oW2esVPcVc7aZ6c+/vVnrpU4nGz846s2pPurIEVEtt/xovGTxSOge8PbXVOfS08Zvg0LpzPOad/R55Cyxc27WHzB5YW8084hVaSZKgurtclTITVTUvvEI0hdMFnfExIStEarI4MQdB04t89/1O/w1cDnyilFU='

const { facebook, getPageInfo } = require('./facebook')
const { help } = require('./help')
const { web, getConfigInfo } = require('./web')
const { checkMsgFB, checkMsgTW, checkMsgYT, checkMsgIG, checkMsgPT } = require('./messages')
const { insertUser, checkUser } = require('./user')

const HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
}

async function reply(req) {
    try {
        let newres = await setBody(req)
        console.log("=============>", newres)
        /**
         * url :reply,push,multicast,Broadcast
         */
        // pushBody(newres)
        replyBody(newres)
    } catch (error) {
        console.log("error : ", error)
    }


}

/**
*  messages In
* {
"events":[
   {
      "type":"message",
      "replyToken":"a8e03e267a9f461cab568362234dc2aa",
      "source":{
         "userId":"U89dedd4ad3350c7b0bb1e55accda02c5",
         "type":"user"
      },
      "timestamp":1600080042813,
      "mode":"active",
      "message":{
         "type":"text",
         "id":"12677766161753",
         "text":" https://www.facebook.com/iShopping.preorder/&zone=th&tag=1"
      }
   }
]
}
*/
async function setBody(req) {
    let body
    try {
        // let reply_token = req.body.events[0].replyToken
        // console.log(req.body.events[0])
        let replyToken = req.body.events[0].replyToken
        let user_token = req.body.events[0].source.userId
        // let user_token = "Ue811773dc55c06f5ad786782d0626f8c"
        let msg = req.body.events[0].message.text
        body = {
            "replyToken": replyToken,
            "messages": []
        }

        let message = msg.toLowerCase()
        console.log(typeof (message), JSON.stringify(message))
        let status_user = true
        if (_.includes(message, "login")) {
            console.log("login")
            // status_user = await insertUser(user_token, message)
            if (status_user) {
                body.messages.push({
                    "type": "text",
                    "text": "Login success"
                })
            } else {
                body.messages.push({
                    "type": "text",
                    "text": "something went wrong"
                })
            }

        } else {
            console.log("No login")
            // status_user = await checkUser(user_token)
            if (status_user) {
                if (message.indexOf("facebook") === 12 || _.includes(message, "www.facebook.com") || _.includes(message, "facebook.com") || _.includes(message, "facebook")) {
                    /**
                    * fb&add=TidPromo,https://www.facebook.com/Mommy-Is-Here-108444714131126?zone=th
                    */
                    if (_.includes(message, "permalink") || _.includes(message, "videos") || _.includes(message, "posts") || _.includes(message, "photos") || _.includes(message, "watch")) {
                        console.log("messages facebook")
                        let data = await checkMsgFB(message)
                        body.messages.push(data)
                    } else {
                        console.log("facebook")
                        let data = await facebook(message)
                        body.messages.push(data)
                    }
                } else if (message.indexOf("twitter") === 12 || _.includes(message, "www.twitter.com") || _.includes(message, "twitter.com") || _.includes(message, "twitter")) {
                    console.log("twitter")
                    let data = await checkMsgTW(message)
                    body.messages.push(data)
                } else if (message.indexOf("youtube") === 12 || _.includes(message, "www.youtube.com") || _.includes(message, "youtube.com") || _.includes(message, "youtube"), _.includes(message, "youtu")) {
                    console.log("youtube")
                    let data = await checkMsgYT(msg)
                    body.messages.push(data)
                } else if (message.indexOf("instagram") === 12 || _.includes(message, "www.instagram.com") || _.includes(message, "instagram.com") || _.includes(message, "instagram")) {
                    console.log("instagram")
                    let data = await checkMsgIG(msg)
                    body.messages.push(data)
                } else if (message.indexOf("pantip") === 12 || _.includes(message, "www.pantip.com") || _.includes(message, "pantip.com") || _.includes(message, "pantip")) {
                    console.log("pantip")
                    let data = await checkMsgPT(message)
                    body.messages.push(data)
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
                    body.messages.push({
                        type: "sticker",
                        packageId: 11537,
                        stickerId: 52002744
                    })
                }
            } else {
                body.messages.push({
                    "type": "text",
                    "text": "Please login user name"
                })
            }
        }



    } catch (error) {
        console.log(error)
    } finally {
        return JSON.stringify(body)
    }


}

async function formatData(body) {
    // console.log(body)
    try {
        if (body.status) {
            return {
                "to": body.line_token,
                "messages": [{
                    "type": "text",
                    "text": `Your Facebook Page Request got decline.\n\n---------------\n\nFacebook Link:\n${page}\nFacebook name:\n${body.page_name}\n\nReason:\n approve.`
                }]
            }
        } else {
            let page = body.social_id
            return {
                "to": body.line_token,
                "messages": [{
                    "type": "text",
                    "text": `Your Facebook Page Request got decline.\n\n---------------\n\nFacebook Link:\n${page}\nFacebook name:\n${body.page_name}\n\nReason:\nNot approve.`
                }]
            }
        }

    } catch (error) {
        console.log("=======>", error)
    }
}


async function pushBody(newres) {
    try {
        let options = {
            method: 'POST',
            uri: 'https://api.line.me/v2/bot/message/push',
            headers: HEADER,
            body: newres // Automatically stringifies the body to JSON
        }
        const res = await rq(options)
        console.log('status = ' + JSON.stringify("DONE"));
    } catch (e) {
        console.log(e.error)
    }

}

async function replyBody(newres) {
    try {
        let options = {
            method: 'POST',
            uri: 'https://api.line.me/v2/bot/message/reply',
            headers: HEADER,
            body: newres // Automatically stringifies the body to JSON
        }
        const res = await rq(options)
        console.log('status = ' + JSON.stringify("DONE"));
    } catch (e) {
        console.log(e.error)
    }

}


module.exports = {
    reply,
    pushBody,
    setBody,
    formatData,
    replyBody
}