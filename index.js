// Reply with two static messages

const express = require('express')
const bodyParser = require('body-parser')
const got = require('got')
const request = require('request-promise')
const app = express()
const port = process.env.PORT || 4000
const { facebook } = require('./api/facebook')
const _ = require('lodash')
const token = 'd6i2fyYzfSkdRgb2Hkin4O0iQvAAZ0unnnJtXq+sDK4489KVruPrP12Z7vx2UHoWE/DLlF5+vaagJ3Qv9WLqS+vO7SbDkPsp8OX6tzSvlUOifuoseFn9iGdYxokwiXRlVTyn4u/UedPPn0RGCECsHQdB04t89/1O/w1cDnyilFU='

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.post('/webhook', (req, res) => res.sendStatus(200))
app.post('/webhook', (req, res) => {
    console.log("11111111")
    reply(req)
})
app.listen(port)

async function reply(req) {

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    let newres = await setBody(req)
    console.log("=============>", newres.messages.length())
    /**
     * url :reply,push,multicast,Broadcast
     */
    let options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/push',
        headers,
        body: newres // Automatically stringifies the body to JSON
    }
    const res = await request(options)
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
        let user_token = req.body.events[0].source.userId
        let msg = req.body.events[0].message.text
        body = {
            "to": user_token,
            "messages": []
        }

        let message = msg.toLowerCase()

        if (_.includes(message, "faecbook") || _.includes(message, "fb")) {
            console.log("fb")
            let data = await facebook(message)
            body.messages.push(data)
        } else if (_.includes(message, "web")) {
            console.log("web")
            body.messages.push({ type: "text", text: `web` })
        } else if (_.includes(message, "hi") || _.includes(message, "hello")) {
            console.log("hi")
            body.messages.push({ type: "text", text: `hi` })
        } else {
            console.log("other")
            body.messages.push({ type: "text", text: `what` })
        }

    } catch (error) {
        console.log(error)
    } finally {
        return JSON.stringify(body)
    }


}