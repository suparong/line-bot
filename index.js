// Reply with two static messages
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { logger } = require('@zanroo/init');

require('dotenv').config()
const port = process.env.PORT_API || 4000
// const port = process.env.PORT || 4000

const { reply, formatData, pushBody } = require('./api/sendToLine')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
    // console.log('webhook')
    logger.info('info', 'process webhook')
    reply(req)
})

app.post('/statusApprove', async (req, res) => {
    // console.log('statusApprove')
    logger.info('info', 'process statusApprove',req.body)
    let readyToSend = await formatData(req.body)
    // console.log("======", JSON.stringify(readyToSend))
    pushBody(JSON.stringify(readyToSend))
    res.status(200).send(true)
})

app.listen(port, async () => {
    console.log('Starting  version 1.5.1');
    console.log('Starting node.js on port ' + `${port}`);
});
