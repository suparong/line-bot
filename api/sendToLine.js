
const rq = require('request-promise')
const _ = require('lodash')
const { logger } = require('@zanroo/init')

const token = '/T4a6bsmMjAzmowvRHl1uNf1vThvbeDoHMkKNTf1nkJw3PLFvpk0+wbZ7+4xffvmE/DLlF5+vaagJ3Qv9WLqS+vO7SbDkPsp8OX6tzSvlUO52h9alXqP6vXdXOR/99BRCiwMXO77Kg2zeH/9whdSAAdB04t89/1O/w1cDnyilFU='
// token-test
// const token = '0zTssGCqCWcU++oW2esVPcVc7aZ6c+/vVnrpU4nGz846s2pPurIEVEtt/xovGTxSOge8PbXVOfS08Zvg0LpzPOad/R55Cyxc27WHzB5YW8084hVaSZKgurtclTITVTUvvEI0hdMFnfExIStEarI4MQdB04t89/1O/w1cDnyilFU='

const { facebook, getPageInfo } = require('./facebook')
const { help } = require('./help')
const { web, getConfigInfo } = require('./web')
const { checkMsgFB, checkMsgTW, checkMsgYT, checkMsgIG, checkMsgPT } = require('./messages')
const { insertUser, checkUser } = require('./user')

const HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
}

async function reply (req) {
  try {
    const newres = await setBody(req)
    // console.log("=============>", newres)
    /**
         * url :reply,push,multicast,Broadcast
         */
    // pushBody(newres)
    replyBody(newres)
  } catch (error) {
    logger.error('error', JSON.stringify(error))
    // console.log("error : ", error)
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

async function setBody (req) {
  let body
  try {
    // console.log(req.body.events[0])
    const replyToken = req.body.events[0].replyToken
    const user_token = req.body.events[0].source.userId
    // let user_token = "Ue811773dc55c06f5ad786782d0626f8c"
    const msg = req.body.events[0].message.text
    body = {
      replyToken: replyToken,
      messages: []
    }

    const message = msg.toLowerCase()
    // console.log(typeof (message), JSON.stringify(message))
    // let status_user
    // if (_.includes(message, "login")) {
    //     // console.log("login")
    //     logger.info('info', 'register : ', JSON.stringify(message))
    //     status_user = await insertUser(user_token, message)
    //     if (status_user) {
    //         body.messages.push({
    //             "type": "text",
    //             "text": "Login success"
    //         })
    //     } else {
    //         body.messages.push({
    //             "type": "text",
    //             "text": "something went wrong"
    //         })
    //     }
    // } else {
    // console.log("No login")
    // status_user = await checkUser(user_token)
    // if (status_user.status) {
    logger.info('info', 'login : ', 'login user name', `user token ${user_token}`)
    if (message.indexOf('facebook') === 12 || _.includes(message, 'www.facebook.com') || _.includes(message, 'facebook.com') || _.includes(message, 'facebook')) {
      /**
            * https://www.facebook.com/Mommy-Is-Here-108444714131126?zone=th
            */
      if (_.includes(message, 'permalink') || _.includes(message, 'videos') || _.includes(message, 'posts') || _.includes(message, 'photos') || _.includes(message, 'watch') || _.includes(message, 'story_fbid')) {
        // console.log("messages facebook")
        logger.info('info', 'link messages facebook : ', JSON.stringify(message))
        const data = await checkMsgFB(message)
        body.messages.push(data)
      } else {
        // console.log("facebook")
        logger.info('info', 'link page : ', JSON.stringify(message))
        const data = await facebook(message)
        body.messages.push(data)
      }
    } else if (message.indexOf('twitter') === 12 || _.includes(message, 'www.twitter.com') || _.includes(message, 'twitter.com') || _.includes(message, 'twitter')) {
      // console.log("twitter")
      logger.info('info', 'link messages twitter : ', JSON.stringify(message))
      const data = await checkMsgTW(message)
      body.messages.push(data)
    } else if (message.indexOf('youtube') === 12 || _.includes(message, 'www.youtube.com') || _.includes(message, 'youtube.com') || _.includes(message, 'youtube'), _.includes(message, 'youtu')) {
      // console.log("youtube")
      logger.info('info', 'link messages youtube : ', JSON.stringify(message))
      const data = await checkMsgYT(msg)
      body.messages.push(data)
    } else if (message.indexOf('instagram') === 12 || _.includes(message, 'www.instagram.com') || _.includes(message, 'instagram.com') || _.includes(message, 'instagram')) {
      // console.log("instagram")
      logger.info('info', 'link messages instagram : ', JSON.stringify(message))
      const data = await checkMsgIG(msg)
      body.messages.push(data)
    } else if (message.indexOf('pantip') === 12 || _.includes(message, 'www.pantip.com') || _.includes(message, 'pantip.com') || _.includes(message, 'pantip')) {
      // console.log("pantip")
      logger.info('info', 'link messages pantip : ', JSON.stringify(message))
      const data = await checkMsgPT(message)
      body.messages.push(data)
    } else if (_.includes(message, 'submit') && _.includes(message, 'zone')) {
      // console.log("submit")
      logger.info('info', 'submit : ', JSON.stringify(message))
      if (_.includes(message, 'fb')) {
        // console.log("=========> FB")
        const data = await getPageInfo(message, user_token)
        body.messages.push(data)
      } else if (_.includes(message, 'web')) {
        // console.log("=========> WEB")
        const data = await getConfigInfo(message, user_token)
        body.messages.push(data)
      }
    } else if (_.includes(message, 'help')) {
      // console.log("help")
      logger.info('info', 'help')
      const data = await help()
      body.messages.push(data)
      // await _.map(data, (a) => { body.messages.push(a) })
    } else if (_.includes(message, 'web')) {
      // console.log("web")
      logger.info('info', 'configure : ', JSON.stringify(message))
      const data = await web(message)
      body.messages.push(data)
    } else {
      // console.log("other")
      logger.info('info', 'other : ', JSON.stringify(message))
      body.messages.push({
        type: 'sticker',
        packageId: 11537,
        stickerId: 52002744
      })
    }
    //  }else if(!status_user.status && status_user.user_status === 0 ){
    //     body.messages.push({
    //         "type": "text",
    //         "text": "Thanks for your submit.\n\nYour request is waiting for approval and PQ will approve on working day 17:00 (GMT+7).\n\n**If urgent, please contact PQ."
    //     })
    // } else {
    //     logger.info('info', 'no login : ', 'Please login user name', `user token ${user_token}`)
    //     body.messages.push({
    //         "type": "text",
    //         "text": "Please login user name"
    //     })
    // }
    // }
  } catch (error) {
    // console.log(error)
    logger.error('error', JSON.stringify(error))
  } finally {
    return JSON.stringify(body)
  }
}

async function formatData (body) {
  // console.log(body)
  try {
    if (body.status) {
      return {
        to: body.line_token,
        messages: [{
          type: 'text',
          text: `Your Facebook Page Request got approve.\n\n---------------\n\nFacebook Link:\nhttps://www.facebook.com/${body.social_id}\nFacebook name:\n${body.page_name}\n\nReason:\n approve.`
        }]
      }
    } else {
      const page = body.social_id
      return {
        to: body.line_token,
        messages: [{
          type: 'text',
          text: `Your Facebook Page Request got decline.\n\n---------------\n\nFacebook Link:\nhttps://www.facebook.com/${body.social_id}\nFacebook name:\n${body.page_name}\n\nReason:\nNot approve.`
        }]
      }
    }
  } catch (error) {
    logger.error('error', JSON.stringify(error))
    // console.log("=======>", error)
  }
}

async function pushBody (newres) {
  try {
    const options = {
      method: 'POST',
      uri: 'https://api.line.me/v2/bot/message/push',
      headers: HEADER,
      body: newres // Automatically stringifies the body to JSON
    }
    const res = await rq(options)
    logger.info('info', 'push body : ', JSON.stringify(newres), 'DONE')
    // console.log('status = ' + JSON.stringify("DONE"));
  } catch (e) {
    logger.error('error', JSON.stringify(e))
    // console.log(e.error)
  }
}

async function replyBody (newres) {
  try {
    const options = {
      method: 'POST',
      uri: 'https://api.line.me/v2/bot/message/reply',
      headers: HEADER,
      body: newres // Automatically stringifies the body to JSON
    }
    const res = await rq(options)
    logger.info('info', 'reply body : ', JSON.stringify(newres), 'DONE')
    // console.log('status = ' + JSON.stringify("DONE"));
  } catch (e) {
    logger.error('error', JSON.stringify(e))
    // console.log(e.error)
  }
}

module.exports = {
  reply,
  pushBody,
  setBody,
  formatData,
  replyBody
}
