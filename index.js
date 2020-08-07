// Reply with two static messages
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

require('dotenv').config()
const port = process.env.PORT_API || 4000

const { reply, formatData, pushBody } = require('./api/sendToLine')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
    // console.log('webhook')
    reply(req)
})

app.post('/statusApprove', async (req, res) => {
    let readyToSend = await formatData(req.body)
    // console.log("======", JSON.stringify(readyToSend))
    pushBody(JSON.stringify(readyToSend))
    res.status(200).send(true)
})

app.listen(port, async () => {
    console.log('Starting  version 1.1');
    console.log('Starting node.js on port ' + `${port}`);
});
