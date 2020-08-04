const rq = require('request-promise')
const QUERY = "about,picture{url},fan_count,name"
const QUERY_INFO = "link,name,fan_count,talking_about_count,rating_count,category_list,artists_we_like,country_page_likes,picture{url}"
const ACCESS_TOKEN = 'EAAG4BSmPZAe0BAJY7m7gJMHo4PEuI7ZALkbwcahHtru424qdIC5Ft6yMtkWWa38QDy5tEEWbOeMRTcqK7Q5lLBNtI8teRDIB9SEqqEHAC6LObgINf7SEKZCmhxCiQ3pO0ScJzSfVkvbtoZAPP1W4TckbMfTXn3qZAJuA8lByb5AZDZD'
const URL_API = "https://graph.facebook.com/v4.0"
let _ = require('lodash')
const { URLSearchParams } = require('url')
const { checkPage, insertPage } = require('./sendToApi')

async function facebook(message) {
    // console.log("===============>", message)
    try {
        /**
        * message = "https://www.facebook.com/Mommy-Is-Here-108444714131126&zone=th"
        */
        let urlParams = new URLSearchParams(message)
        if (_.includes(message, "fb")) {
            // console.log("11111111111", urlParams)
            let name = urlParams.get('add')
            let zone = urlParams.get('zone')
            name = encodeURIComponent(name)
            console.log("+++++>", name, "zone : ", zone)
            let item = await getPage(name, zone)
            return item
        } else {
            // console.log("222222222222")
            let name = await getPathFromUrl(message)
            let zone = urlParams.get('zone')
            var newname = name.split("&")
            newname = encodeURIComponent(newname[0])
            let item = await getPage(newname, zone)
            return item

        }

    } catch (error) {
        return { type: "text", text: `${error}` }
    }

}

function getPathFromUrl(url) {
    return url.split("?")[0];
}


async function getPage(page, zone) {
    // console.log("+++++++++++++++++ getPage")
    let info = {
        "type": "flex",
        "altText": "new messages"
    }
    try {
        // let pagesInfo = await searchPageInfo(page, zone)
        let pagesInfo = await searchPage(page, zone)
        // console.log("pagesInfo =====================>", JSON.stringify(pagesInfo))
        if (pagesInfo.type === "text") {
            return pagesInfo
        } else {
            info.contents = pagesInfo
            return info
        }
    } catch (error) {
        console.log(error)
    }

}

async function searchPage(page, zone) {
    console.log("+++++++++++++++++ searchPage", page)
    try {
        let options = {
            'method': 'GET',
            'url': `${URL_API}/${page}?fields=${QUERY}&access_token=${ACCESS_TOKEN}`,
            'headers': {
            }, json: true
        }
        let pageInfo = await rq(options)
        console.log("+++++>", pageInfo.id, "zone : ", zone)
        let pageInDB = await checkPage(pageInfo.id)
        let newPage = JSON.parse(pageInDB)
        // console.log("===========>", newPage, JSON.stringify(newPage.status), typeof (newPage))
        /**
             * {
             * "status": false ,
             * "type": 1 || 2 
             * }
             */
        if (newPage.status === false && newPage.type === 1) {
            // console.log("1")
            return {
                // "type": "bubble", "body": { "type": "box", "layout": "horizontal", "contents": [{ type: "text", text: `มีคนส่งไปแล้วนะ` }] }
                type: "text", text: `This page is waiting for approval.`
            }
        } else if (newPage.status === false && newPage.type === 2) {
            // console.log("2")
            return {
                // "type": "bubble", "body": { "type": "box", "layout": "horizontal", "contents": [{ type: "text", text: `มีในระบบเราแล้วนะ` }] }
                type: "text", text: `This page already exists.`
            }
        } else {
            let newPageInfo = await formateData(pageInfo, zone)
            return newPageInfo
        }
    } catch (error) {
        return {
            // "type": "bubble", "body": { "type": "box", "layout": "horizontal", "contents": [{ type: "text", text: `ทำอะไรผิดป่าวววว` }] }
            type: "text", text: `Please check your link url again. Make sure that you send Facebook page’s link.`
        }
    }


}

async function formateData(res, zone) {
    // console.log("+++++++++++++++++ formateData")
    zone = zone || "none"
    let pageInfo = {
        "type": "bubble",
        "styles": {
            "footer": {
                "backgroundColor": "#42b3f4"
            }
        },
        "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "Facebook Page Info"
                }
            ]
        },
        "hero": {
            "type": "image",
            "size": "sm",
            "url": "",
            "aspectRatio": "1:1"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": []
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
                {
                    "type": "button",
                    "style": "link",
                    "color": "#FFFFFF",
                    "height": "sm",
                    "action": {
                        "type": "message",
                        "label": "submit",
                        "text": ""
                    }
                }
            ]
        }
    }
    try {
        if (res.picture) {
            pageInfo.hero.url = res.picture.data.url
        }
        if (res.name) {
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `Page Name : ${res.name}`
            }
            pageInfo.body.contents.push(item)
        }
        if (res.fan_count) {
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `${res.fan_count} People Like`,
                "wrap": true
            }
            pageInfo.body.contents.push(item)
        }
        if (res.id) {
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `Page ID : ${res.id}`
            }
            pageInfo.body.contents.push(item)
            // pageInfo.footer.contents[0].action.text = `OK เช็คให้นะ`
            pageInfo.footer.contents[0].action.text = `&submit=${res.id}&zone=${zone}`
        }
    } catch (error) {
        console.log(error)
    } finally {
        return pageInfo
    }

}

async function getPageInfo(message, user_token) {
    let urlParams = new URLSearchParams(message)
    let page_id = urlParams.get('submit')
    let zone = urlParams.get('zone') || "none"

    const PageInfo = await searchPageInfo(page_id, zone, user_token)
    // console.log(PageInfo)
    const resDB = await insertPage(PageInfo)
    // console.log("=============>", resDB)
    if (resDB) {
        return { type: "text", text: `Your page is sent for waiting for approval.` }
    } else {
        return { type: "text", text: `This page already exists.` }
    }
}

async function searchPageInfo(page_id, zone, user_token) {
    // console.log("+++++++++++++++++ searchPageInfo")
    let options = {
        'method': 'GET',
        'url': `${URL_API}/${page_id}?fields=${QUERY_INFO}&access_token=${ACCESS_TOKEN}`,
        'headers': {
        }, json: true
    }
    let pageInfo = await rq(options)
    pageInfo.zone = zone
    pageInfo.line_token = user_token
    return pageInfo
}


module.exports = {
    facebook,
    getPageInfo
}
