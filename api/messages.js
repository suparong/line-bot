/////  FIX find MONGO
const rq = require('request-promise')
const _ = require('lodash')
const { URL, URLSearchParams } = require('url')

const ACCESS_TOKEN = 'EAAG4BSmPZAe0BAJY7m7gJMHo4PEuI7ZALkbwcahHtru424qdIC5Ft6yMtkWWa38QDy5tEEWbOeMRTcqK7Q5lLBNtI8teRDIB9SEqqEHAC6LObgINf7SEKZCmhxCiQ3pO0ScJzSfVkvbtoZAPP1W4TckbMfTXn3qZAJuA8lByb5AZDZD'

const { checkMessage } = require('./sendToApi')
const { checkPage, insertPage } = require('./sendToApi')

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
        let page_id
        // console.log("=======>", message)
        let url = new URL(message)
        let urlParams = new URLSearchParams(url.search)
        let story_fbid = urlParams.get("story_fbid")
        let type = urlParams.get("type")
        let watch = urlParams.get("v")
        if (story_fbid) {
            console.log("story_fbid")
            page_id = urlParams.get("id")
            message_id = `${page_id}_${story_fbid}`
            // console.log(message_id)
        } else if (type) {
            console.log("type")
            let bodyMsg = _.split(url.pathname, "/")
            page_id = await getPageID(bodyMsg[1])
            let post_id = bodyMsg[4]
            message_id = `${page_id}_${post_id}`
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
                page_id = await getPageID(bodyMsg[1])
                let post_id = bodyMsg[3]
                message_id = `${page_id}_${post_id}`
                // console.log(message_id)
            } else {
                /**
                 * res something
                 */
                // console.log("====>", false)
                return { type: "text", text: `can not get link` }
            }
        } else {
            console.log("Other")
            let linkMsg = _.split(url, "?")[0]
            url = new URL(linkMsg)
            let bodyMsg = _.split(url.pathname, "/")
            let pages_name = bodyMsg[1]
            page_id = await getPageID(bodyMsg[1])
            let post_id = bodyMsg[3]
            message_id = `${page_id}_${post_id}`
            // console.log(message_id)
        }
        console.log("======>", message_id)
        if (message_id) {
            let Msg = await checkAndFormat({ message_id, page_id, ch: "fb" })
            return Msg
        }
    } catch (e) {
        console.log('eeeeeee', e)
        return { type: "text", text: `${e.error.errors.message}` }
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
        let message_id = `${page_id}_${post_id}`
        console.log("======>", message_id)
        if (message_id) {
            let Msg = await checkAndFormat({ message_id, page_id: '', ch: "tw" })
            return Msg
        }
    } catch (e) {
        // console.log("eeeeeeeeeee", e.error.errors.message)
        return { type: "text", text: `user not found` }
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
        message_id = `${chID}_${watch_id}`
        console.log("======>", message_id)
        if (message_id) {
            let Msg = await checkAndFormat({ message_id, page_id: '', ch: "yt" })
            return Msg
        }

    } catch (e) {
        // console.log("eeeeeeeeeee", e)
        return { type: "text", text: `${e.error.errors.message}` }
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
        let message_id = `${post_id}`
        console.log("======>", message_id)
        if (message_id) {
            let Msg = await checkAndFormat({ message_id, page_id: '', ch: "ig" })
            return Msg
        }
    } catch (e) {
        // console.log("eeeeeeeeeee", e.error.errors.message)
        return { type: "text", text: `${e.error.errors.message}` }
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
        console.log("======>", message_id)
        if (message_id) {
            let Msg = await checkAndFormat({ message_id, page_id: '', ch: 'pt' })
            return Msg
        }
    } catch (e) {
        // console.log("eeeeeeeeeee", e.error.errors.message)
        return { type: "text", text: `${e.error.errors.message}` }
    }

}

async function checkAndFormat({ message_id, page_id, ch }) {
    let mess_id
    let page_link
    if (ch === "fb") {
        mess_id = `${ch}_${message_id}`
        page_link = `https://www.facebook.com/${page_id}`
    } else if (ch === "tw") {
        mess_id = `${ch}_${message_id}`
        page_link = `https://twitter.com/${page_id}`
        message_id = _.split(message_id, "_")[1]
    } else if (ch === "yt") {
        mess_id = `${ch}_${message_id}`
        page_link = `https://www.youtube.com/channel/${page_id}`
    } else if (ch === "ig") {
        mess_id = `${ch}_${message_id}`
        page_link = `not page`
    } else if (ch === "pt") {
        mess_id = `${message_id}`
        page_link = `not page`
    }
    let statusMsg = await checkMessage(mess_id)
    // console.log("=========", { message_id, page_id, ch })
    // let statusMsg = { "status": true, "data": { "_id": "fb_272609309612079_799064393633232", "link": "http://www.facebook.com/272609309612079/posts/799064393633232", "created_time": "26 Feb 2018 20:25:47", "sys_time": "27 Feb 2018 10:31:40", "cts": "27 Feb 2018 05:00:43", "zone": "th", "channel": "facebook", "acc_list": "152,234,219,227,241,154,243,133,220" } }
    // console.log("=====>", JSON.stringify(statusMsg))
    if (statusMsg.status) {
        let msg = await formatMessages(statusMsg.data)
        return msg
    } else {
        ///doing
        // console.log("============> false")
        if (page_id) {
            // console.log("============> page")
            let pageInDB = await checkPage(page_id)
            // console.log("=====", pageInDB)
            let newPage = JSON.parse(pageInDB)
            if (newPage.status) {
                return {
                    "type": "text",
                    "text": `The page is not exist.\nPlease send this page for approve.\n\n${page_link}\n\n--------------------------\n\nThe message is not exist in system.\nPlease backtrack with this ID.\n\n${message_id}\n\n**Please backtrack after page exist in system.`
                }
            } else {
                return {
                    "type": "text",
                    "text": `The message is not exist in system.\nPlease backtrack with this ID.\n\n${message_id}\n`
                }
            }

        } else {
            // console.log("============> not page")
            return {
                "type": "text",
                "text": `The message is not exist in system.\nPlease backtrack with this ID.\n\n${message_id}\n`
            }
        }



    }
}

async function formatMessages(status) {
    try {
        let created_time = null
        let sys_time = null
        let cts = null
        let created_time_GMT
        let sys_time_GMT
        let cts_GMT
        return {
            "type": "text",
            "text": `The message already exist.\n\n---------------------------------------------\n\nAccount ID: ${status.acc_list}\nChannel: ${status.channel}\nZone: ${status.zone}\nCreated_Time: ${status.created_time} (GMT+7)\nSys_Time: ${status.sys_time} (GMT+7)\n\nSystem Link:\nhttps://listening.zanroo.com/message/conversation/conversation#message_id=${status._id}`
        }
    } catch (error) {
        console.log(error)
    }


}

module.exports = {
    checkMsgFB,
    checkMsgTW,
    checkMsgYT,
    checkMsgIG,
    checkMsgPT
}