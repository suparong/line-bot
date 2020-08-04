
const { facebook, getPageInfo } = require('./facebook')
const { help } = require('./help')

const token = 'd6i2fyYzfSkdRgb2Hkin4O0iQvAAZ0unnnJtXq+sDK4489KVruPrP12Z7vx2UHoWE/DLlF5+vaagJ3Qv9WLqS+vO7SbDkPsp8OX6tzSvlUOifuoseFn9iGdYxokwiXRlVTyn4u/UedPPn0RGCECsHQdB04t89/1O/w1cDnyilFU='

async function reply(req) {

    let newres = await setBody(req)
    // console.log("=============>", newres)
    /**
     * url :reply,push,multicast,Broadcast
     */
    pushBody(newres)

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
async function setBody(req) {
    let body
    try {
        // let reply_token = req.body.events[0].replyToken
        // console.log(req.body.events[0])
        let user_token = req.body.events[0].source.userId
        let msg = req.body.events[0].message.text
        body = {
            "to": user_token,
            "messages": []
        }

        let message = msg.toLowerCase()
        console.log(typeof (message), message)

        if (message.indexOf("facebook") === 12 || _.includes(message, "fb")) {
            /**
            * fb&add=TidPromo,https://www.facebook.com/Mommy-Is-Here-108444714131126?zone=th
            */
            console.log("facebook")
            let data = await facebook(message)
            body.messages.push(data)
        } else if (_.includes(message, "submit") && _.includes(message, "zone")) {
            //     console.log("submit")
            let data = await getPageInfo(message, user_token)
            body.messages.push(data)
        } else if (_.includes(message, "help")) {
            console.log("help")
            let data = await help()
            body.messages.push(data)
            // body.messages.push({ type: "text", text: `help` })
        } else if (_.includes(message, "web")) {
            console.log("web")
            // let data = await help()
            // body.messages.push(data)
            body.messages.push({ type: "text", text: `web` })
        } else {
            console.log("other")
            body.messages.push({
                type: "sticker",
                packageId: 11537,
                stickerId: 52002744
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



module.exports = {
    reply,
    pushBody,
    setBody,
    formatData
}