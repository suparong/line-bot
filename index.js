// Reply with two static messages

const express = require('express')
const bodyParser = require('body-parser')
const got = require('got')
const app = express()
const port = process.env.PORT || 4000
const AIMLParser = require('aimlparser')
const aimlParser = new AIMLParser({ name: 'fabfab' })

aimlParser.load(['./test-aiml.xml'])

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
    let reply_token = req.body.events[0].replyToken
    let msg = req.body.events[0].message.text
    let body = {
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: 'Hello'
        }]
    }
    if (msg === "fb") {
        console.log("fb")
    } else if (msg === "web") {
        console.log("web")
    } else {
        console.log("other")
        aimlParser.getResult(msg, (answer, wildCardArray, input) => {
            body.messages[0].text = answer
        })
    }
    return JSON.stringify(body)
}