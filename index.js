// Reply with two static messages

const express = require('express')
const bodyParser = require('body-parser')
const got = require('got')
const app = express()
const port = process.env.PORT || 4000

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
        'Authorization': 'Bearer d6i2fyYzfSkdRgb2Hkin4O0iQvAAZ0unnnJtXq+sDK4489KVruPrP12Z7vx2UHoWE/DLlF5+vaagJ3Qv9WLqS+vO7SbDkPsp8OX6tzSvlUOifuoseFn9iGdYxokwiXRlVTyn4u/UedPPn0RGCECsHQdB04t89/1O/w1cDnyilFU='
    }
    let body = await setBody(req)
    const res = await got.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    });
    console.log('status = ' + res.statusCode)
}

async function setBody(req) {
    let body
    try {
        let reply_token = req.body.events[0].replyToken
        let msg = req.body.events[0].message.text
        body = {
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: ''
            }]
        }

        let message = msg.toLowerCase()

        if (message === "faecbook" || message === "fb") {
            console.log("fb")
            body.messages[0].text = "fb"
            // return JSON.stringify(body)
        } else if (message === "web") {
            console.log("web")
            body.messages[0].text = "web"
            // return JSON.stringify(body)
        } else if (message === "hi" || message === "hello") {
            console.log("hi")
            body.messages[0].text = "hi"
            // return JSON.stringify(body)
        } else {
            console.log("other")
            body.messages[0].text = "other"
            // return JSON.stringify(body)
        }

    } catch (error) {
        console.log(error)
    } finally {
        return JSON.stringify(body)
    }


}