const rq = require('request-promise')
const _ = require('lodash')

const ACCESS_TOKEN = 'EAAG4BSmPZAe0BAJY7m7gJMHo4PEuI7ZALkbwcahHtru424qdIC5Ft6yMtkWWa38QDy5tEEWbOeMRTcqK7Q5lLBNtI8teRDIB9SEqqEHAC6LObgINf7SEKZCmhxCiQ3pO0ScJzSfVkvbtoZAPP1W4TckbMfTXn3qZAJuA8lByb5AZDZD'

const { checkMessage } = require('./sendToApi')
/**
 * IN
 * https://www.facebook.com/permalink.php?story_fbid=170987977876799&id=108444714131126&__xts__[0]=68.ARCD6Sr57p0K8uXplHjnaMLp0piIsAIBcRJFqiUGfgmGrnzLpbMnFib0zyPJG1jGNc2gzH1mSsLUjfYJYzemy6ofPRF4F88Jr1oDxCIr6A29dZFDeeE3zZKLFxG0__3t8OVP17Zdsd5uQFHPq9xnzZa2yruBjPNhHXOOonen1YX2rE44z4KIVkj_Wlwy1i2Ftx_sPzx0dFgaizY7f27wDFolGiq_jcyKdhNc1WrX6krvniipEKg1jR4iKvhy3TjGiGvGPJXZaBCrPMluUm9CtrG-fD6YaDA-EAVwqyYeoxpOixLfq8WO1fhPvLhw4vpBKAFt2FFtnKmswR-TMak&__tn__=-R
 * 
 * https://www.facebook.com/TrueOnline/videos/331193034681547/?__xts__[0]=68.ARDBqj5HykehqT0mtOl4V7CjsgZE1bIPB3zE-AJrO53q15Rl-wERibbPgliOKn3nCqrrSE9PuozNpU87JF1ZzDB5p6R0gNeDtojSMZfAjKtE_MnzSKL6CYtm38NJ6zUaWWRx_aaGoFwTwxEgx7h1pM5OuE9RKuUp8UyF_Ek3tpdooUh0pBfXRB6FXYAu3LnnvJBDKsySX6OVYaB7GewCqyN-5FBkVV_R2nC4uVpC80821SInMclXaT1jSMbvgubxLFNC1ufcgX0e29W39R2kVvcxeoRtJP_Ngly47Mb7_Z9e1yFEyZL0W5Jc8QQS79-B4QPpCG6m0K8GZ_L2hHZzwn3Z9O6KgFvD&__tn__=-R
 * https://www.facebook.com/TrueOnline/posts/10157158889881653?__xts__[0]=68.ARDqMwyujnxWd1CMrhOdoWdoElmCbbtnFsAsFg_Riap8wfqP8dLRDUlzztMPrXO33K2r-fVb3gD_KTTRtKinz78BhFsMlT4B-yVGrhfDlQS__UMYZKtWK5vHYIMebR5S1wKWzNPL_OmtKa_kwXLAc05NKn6v_VGPsS7mwbvkX1OeDrK5PSOG0s2cVg56IpLF7WgEUvt4YvnL0Nc7BHn3FwcUQTHwD4476iQ_3YJruDjcDHcQMVf9NoSgZzzrvL3gaxF5cU8EBat4kylp0jaNPh5T8xGqzabVPL_ei6tw9zADlayZutSjyLY8SgvDHCqjTBIGjf5zit8T6mAxj6D0I7V98kQ4Co2T7OEJyAbldC3ZSHzkSB6aCJKuyXzrKRSllQIKcM0B5cibmEbocin_242Mm3hswXiMfKqlXKt_O8BlISbkrsfJCJ1RdRFidBn0BQ7zWOAIA-yGmkwXE_lm3ZP82vV5xOfDL7JbrnKn0QrLB6R5Iq590lwu&__tn__=-R
 * https://www.facebook.com/TrueOnline/posts/10157158889881653?__tn__=-R
 * https://www.facebook.com/TrueOnline/videos/3228560357258354/
 * 
 * https://www.facebook.com/TrueOnline/photos/a.376029606652/10157126063301653/?type=3&theater
 * https://www.facebook.com/TrueMoveH/videos/vb.204234332938286/301148657763460/?type=2&theater
 * 
 * https://www.facebook.com/watch/?v=331193034681547
 * OUT
 * fb_1234556_331193034681547
 */

async function checkMsgFB(message) {
    try {
        let message_id
        // console.log("=======>", message)
        let url = new URL(message)
        let urlParams = new URLSearchParams(url.search)
        let story_fbid = urlParams.get("story_fbid")
        let type = urlParams.get("type")
        let watch = urlParams.get("v")
        if (story_fbid) {
            console.log("story_fbid")
            let page_id = urlParams.get("id")
            message_id = `fb_${page_id}_${story_fbid}`
            // console.log(message_id)
        } else if (type) {
            console.log("type")
            let bodyMsg = _.split(url.pathname, "/")
            let page_id = await getPageID(bodyMsg[1])
            let post_id = bodyMsg[4]
            message_id = `fb_${page_id}_${post_id}`
            // console.log(message_id)
        } else if (watch) {
            console.log("watch")
            let linkWatch = await getLinkWatch(watch)
            // console.log("=======>", linkWatch)
            /**
             * let linkWatch
             * check messages comment
             */
            if (linkWatch) {
                url = new URL(linkWatch)
                let bodyMsg = _.split(url.pathname, "/")
                // console.log(bodyMsg)
                let page_id = await getPageID(bodyMsg[1])
                let post_id = bodyMsg[3]
                message_id = `fb_${page_id}_${post_id}`
                // console.log(message_id)
            } else {
                /**
                 * res something
                 */
                console.log("====>", false)
            }
        } else {
            console.log("Other")
            let linkMsg = _.split(url, "?")[0]
            url = new URL(linkMsg)
            let bodyMsg = _.split(url.pathname, "/")
            let pages_name = bodyMsg[1]
            let page_id = await getPageID(bodyMsg[1])
            let post_id = bodyMsg[3]
            message_id = `fb_${page_id}_${post_id}`
            // console.log(message_id)
        }
        // console.log("======>", message_id)
        let statusMsg
        if (message_id) {
            statusMsg = await checkMessage(message_id)
            // console.log("=====>", statusMsg)
            let msg = await formatMessages(statusMsg)
            console.log(JSON.stringify(msg))
        }
        // let statusMsg = {
        //     "_id": "https://pantip.com/topic/40119573",
        //     "created_time": "2020-08-10T02:07:54.000Z",
        //     "sys_time": "2020-08-10T10:15:55.705Z",
        //     "cts": "2020-08-10T10:15:55.692Z"
        // }
    } catch (e) {
        console.log('eeeeeee', e)
    }

}

async function getPageID(name) {
    let options = {
        'method': 'GET',
        'url': `https://graph.facebook.com/v4.0/${name}?access_token=${ACCESS_TOKEN}`,
        json: true
    }
    let pageInfo = await rq(options)
    if (pageInfo) return pageInfo.id

}
async function getLinkWatch(name) {
    let options = {
        'method': 'GET',
        'url': `https://graph.facebook.com/v4.0/${name}/comments?fields=permalink_url&access_token=${ACCESS_TOKEN}`,
        json: true
    }
    let pageInfo = await rq(options)
    if ((pageInfo.data).length > 0) {
        console.log(pageInfo.data[0].permalink_url)
        let link = pageInfo.data[0].permalink_url
        return link
    } else {
        console.log("no comment")
        return false
    }

}
/**
 * IN
 * http://twitter.com/qistisyraf/status/968103292076109826
 * OUT
 * tw_134234_968103292076109826
 */
async function checkMsgTW(message) {
    try {
        console.log(message)
        let linkMsg = _.split(message, "?")[0]
        let url = new URL(linkMsg)
        let bodyMsg = _.split(url.pathname, "/")
        // console.log("=======>", bodyMsg)
        let user = encodeURIComponent(bodyMsg[1])
        let page_id = await getUserID(user)
        let post_id = bodyMsg[3]
        let message_id = `tw_${page_id}_${post_id}`
        // console.log("======>", message_id)
        let statusMsg
        if (message_id) {
            statusMsg = await checkMessage(message_id)
            console.log("=====>", statusMsg)
        }
    } catch (e) {
        console.log("eeeeeeeeeee", e.error.errors.message)
        return false
    }

}

async function getUserID(user) {
    let date = new Date();
    let newDate = Math.floor(date.getTime() / 1000)
    let options = {
        'method': 'GET',
        'url': `https://api.twitter.com/1.1/users/show.json?screen_name=${user}`,
        'headers': {
            'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAKxCzQAAAAAAwOdy%2BjpDP8iQP2CvrKnDtx1JtQ8%3DeT51e1YotrVUeqhF8ndloTuTXnL4fXPWNvAvhnGdFJy5xefiyW',
            'Cookie': 'personalization_id="v1_Enr/qsLMT3NVq3p4HWju2w=="; guest_id=v1%3A159704463276697029'
        }, json: true
    }
    // console.log(options)
    let userInfo = await rq(options)
    if (userInfo) {
        return userInfo.id_str
    }

}

/**
 * IN
 * https://www.youtube.com/watch?v=jCpLl9eXkkc
 * https://www.youtube.com/jCpLl9eXkkc
 * OUT
 * yt_asdfasdf_jCpLl9eXkkc
 */
async function checkMsgYT(message) {
    try {
        let message_id
        let url = new URL(message)
        let urlParams = new URLSearchParams(url.search)
        let watch_id
        if (_.includes(message, "watch")) {
            watch_id = urlParams.get("v")
            console.log("==============>", watch_id)
        } else {
            let bodyMsg = _.split(url.pathname, "/")
            // console.log(bodyMsg)
            console.log("==============>", bodyMsg[1])
            watch_id = bodyMsg[1]
        }
        let chID = await getChannelID(watch_id)
        console.log("==============>", chID)
        message_id = `yt_${chID}_${watch_id}`
        // console.log("======>", message_id)
        let statusMsg
        if (message_id) {
            statusMsg = await checkMessage(message_id)
            console.log("=====>", statusMsg)
        }

    } catch (error) {
        console.log("eeeeeeeeeee", e.error.errors.message)
        return false
    }

}

async function getChannelID(watch_id) {
    let options = {
        'method': 'GET',
        'url': `https://www.googleapis.com/youtube/v3/videos?id=${watch_id}&key=AIzaSyCD2LJ9897zqprKL7fLpL5QggNvBj1umoI&part=snippet`,
        json: true
    }
    // console.log(options)
    let watchInfo = await rq(options)
    if (watchInfo) {
        return watchInfo.items[0].snippet.channelId
    }

}

/**
 * IN
 * https://www.instagram.com/p/63f2RoN_CE/
 * https://www.instagram.com/p/CDtFCrjlO8l/?igshid=q1qlqtok68hs
 * OUT
 * ig_63f2RoN_CE
 */

async function checkMsgIG(message) {
    try {
        let linkMsg = _.split(message, "?")[0]
        let url = new URL(linkMsg)
        let bodyMsg = _.split(url.pathname, "/")
        // console.log(bodyMsg)
        let post_id = bodyMsg[2]
        let message_id = `ig_${post_id}`
        // console.log("======>", message_id)
        let statusMsg
        if (message_id) {
            statusMsg = await checkMessage(message_id)
            console.log("=====>", statusMsg)
        }
    } catch (error) {
        console.log("eeeeeeeeeee", e.error.errors.message)
        return false
    }

}

/**
 * IN
 * https://pantip.com/topic/40119573
 * https://pantip.com/topic/40119573/comment1
 * OUT
 * com.pantip_/topic/40119573
 */

async function checkMsgPT(message) {
    try {
        let linkMsg = _.split(message, "?")[0]
        let url = new URL(linkMsg)
        let bodyMsg = _.split(url.pathname, "/")
        console.log(bodyMsg)
        let message_id = `com.pantip_/topic/${bodyMsg[2]}`
        // console.log("======>", message_id)
        let statusMsg
        if (message_id) {
            statusMsg = await checkMessage(message_id)
            console.log("=====>", statusMsg)
        }
    } catch (error) {
        console.log("eeeeeeeeeee", e.error.errors.message)
        return false
    }

}


async function formatMessages(status) {
    return {
        "type": "flex",
        "altText": "new messages",
        "contents": {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "Message status"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        // "wrap": true,
                        "text": `Link : `,
                        "offsetTop": "10px",
                        "offsetBottom": "10px",
                        "offsetStart": "10px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "bold",
                        "color": "#000E29"
                    }, {
                        "type": "text",
                        // "wrap": true,
                        "text": `${status._id}`,
                        "offsetTop": "-8px",
                        "offsetBottom": "10px",
                        "offsetStart": "80px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "regular"
                    },
                    {
                        "type": "text",
                        "wrap": true,
                        "text": `Channel : `,
                        "offsetTop": "-5px",
                        "offsetBottom": "10px",
                        "offsetStart": "10px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "bold",
                        "color": "#000E29"
                    }, {
                        "type": "text",
                        // "wrap": true,
                        "text": `${status.channel}`,
                        "offsetTop": "-23px",
                        "offsetBottom": "10px",
                        "offsetStart": "80px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "regular"
                    }, {
                        "type": "text",
                        "wrap": true,
                        "text": `Zone : `,
                        "offsetTop": "-20px",
                        "offsetBottom": "10px",
                        "offsetStart": "10px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "bold",
                        "color": "#000E29"
                    }, {
                        "type": "text",
                        // "wrap": true,
                        "text": `${status.zone}`,
                        "offsetTop": "-39px",
                        "offsetBottom": "10px",
                        "offsetStart": "80px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "regular"
                    }, {
                        "type": "text",
                        "wrap": true,
                        "text": `Created_Time : `,
                        "offsetTop": "-50px",
                        "offsetBottom": "10px",
                        "offsetStart": "10px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "bold",
                        "color": "#000E29"
                    }, {
                        "type": "text",
                        // "wrap": true,
                        "text": `${status.created_time}`,
                        "offsetTop": "-68px",
                        "offsetBottom": "10px",
                        "offsetStart": "120px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "regular"
                    }, {
                        "type": "text",
                        "wrap": true,
                        "text": `Sys_Time : `,
                        "offsetTop": "-65px",
                        "offsetBottom": "10px",
                        "offsetStart": "10px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "bold",
                        "color": "#000E29"
                    }, {
                        "type": "text",
                        // "wrap": true,
                        "text": `${status.sys_time}`,
                        "offsetTop": "-83px",
                        "offsetBottom": "10px",
                        "offsetStart": "90px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "regular"
                    }, {
                        "type": "text",
                        "wrap": true,
                        "text": `Cts : `,
                        "offsetTop": "-80px",
                        "offsetBottom": "10px",
                        "offsetStart": "10px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "bold",
                        "color": "#000E29"
                    }, {
                        "type": "text",
                        // "wrap": true,
                        "text": `${status.cts}`,
                        "offsetTop": "-98px",
                        "offsetBottom": "10px",
                        "offsetStart": "50px",
                        "offsetEnd": "10px",
                        "size": "sm",
                        "style": "normal",
                        "weight": "regular"
                    }
                ],
                "backgroundColor": "#E8EBED",
                "width": "260px",
                "height": "170px"
            }
        }
    }
}

module.exports = {
    checkMsgFB,
    checkMsgTW,
    checkMsgYT,
    checkMsgIG,
    checkMsgPT
}