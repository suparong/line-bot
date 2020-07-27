const got = require('got')
const rq = require('request-promise')
const QUERY = "about,picture{url},fan_count,name"
const ACCESS_TOKEN = 'EAAG4BSmPZAe0BAJY7m7gJMHo4PEuI7ZALkbwcahHtru424qdIC5Ft6yMtkWWa38QDy5tEEWbOeMRTcqK7Q5lLBNtI8teRDIB9SEqqEHAC6LObgINf7SEKZCmhxCiQ3pO0ScJzSfVkvbtoZAPP1W4TckbMfTXn3qZAJuA8lByb5AZDZD'
const URL_API = "https://graph.facebook.com/v4.0"
let _ = require('lodash')

async function facebook(message) {
    try {
        /**
        * message = "(fb,facebook)&add=AAAAAA,zone=th"
        */
        let urlParams = new URLSearchParams(message)
        // console.log("11111111111", urlParams)
        let name = urlParams.get('add')
        let zone = urlParams.get('zone')
        console.log("+++++>", name, "zone : ", zone)
        name = encodeURIComponent(name)
        let pages = await searchPages(name)
        console.log("pages =======>", pages.data)
        let item = await getInfoPage(pages.data, zone)
        return item
    } catch (error) {
        return { type: "text", text: `${error}` }
    }

}

async function searchPages(name) {
    let options = {
        'method': 'GET',
        'url': `${URL_API}/search?type=place&q=${name}&fields=link,name&limit=5&access_token=${ACCESS_TOKEN}`,
        'headers': {
        }, json: true
    }
    // console.log("=======================11", options)
    let pages = await rq(options)
    // console.log("searchPages ===============+>", pages)
    return pages
}

async function getInfoPage(pages, zone) {
    let info = {
        "type": "flex",
        "altText": "เพสนี้หรือป่าวนะ",
        "contents": {
            "type": "carousel"
        }
    }
    try {
        let pagesInfo = await Promise.all(pages.map(async page => searchPageInfo(page, zone)));
        // console.log("pagesInfo =====================>", JSON.stringify(pagesInfo))
        info.contents.contents = pagesInfo
    } finally {
        // console.log("=======", JSON.stringify(info))
        return info
    }

}

async function searchPageInfo(page, zone) {
    let options = {
        'method': 'GET',
        'url': `${URL_API}/${page.link}?fields=${QUERY}&access_token=${ACCESS_TOKEN}`,
        'headers': {
        }, json: true
    }
    let pageInfo = await rq(options)
    let newPageInfo = await formateData(pageInfo, zone)
    return newPageInfo
}

async function formateData(res, zone) {
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
                    "text": "ใช่เพสนี้ป่าวนะ"
                }
            ]
        },
        "hero": {
            "type": "image",
            "size": "full",
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
                    "style": "primary",
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
                "text": `ชื่อ :  ${res.name}`
            }
            pageInfo.body.contents.push(item)
        }
        if (res.fan_count) {
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `คนถูกใจ ${res.fan_count} คน`,
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
                "text": `ID นี้นะ :  ${res.id}`
            }
            pageInfo.body.contents.push(item)
            pageInfo.footer.contents.action.text = `&submit=${res.id},zone=${zone}`
        }
    } catch (error) {
        console.log(error)
    } finally {
        return pageInfo
    }

}



module.exports = {
    facebook
}
