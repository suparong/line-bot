const rq = require('request-promise')
const QUERY = "about,picture{url},fan_count,name"
const ACCESS_TOKEN = 'EAAG4BSmPZAe0BAJY7m7gJMHo4PEuI7ZALkbwcahHtru424qdIC5Ft6yMtkWWa38QDy5tEEWbOeMRTcqK7Q5lLBNtI8teRDIB9SEqqEHAC6LObgINf7SEKZCmhxCiQ3pO0ScJzSfVkvbtoZAPP1W4TckbMfTXn3qZAJuA8lByb5AZDZD'
const URL_API = "https://graph.facebook.com/v4.0"
let _ = require('lodash')
const { URLSearchParams } = require('url')

async function facebook(message) {
    console.log("===============>", message)
    try {
        /**
        * message = "https://www.facebook.com/Mommy-Is-Here-108444714131126&zone=th"
        */
        let urlParams = new URLSearchParams(message)
        if (_.includes(message, "fb")) {
            console.log("11111111111", urlParams)
            let name = urlParams.get('add')
            let zone = urlParams.get('zone')
            name = encodeURIComponent(name)
            console.log("+++++>", name, "zone : ", zone)
            let item = await getInfoPage(name, zone)
            return item
        } else {
            console.log("222222222222")
            let name = await getPathFromUrl(message)
            let zone = urlParams.get('zone')
            name = encodeURIComponent(name)
            console.log("+++++>", name, "zone : ", zone)
            let item = await getInfoPage(name, zone)
            return item

        }
        // let pages = await searchPages(name)
        // console.log("pages =======>", pages.data)
        // let item = await getInfoPage(pages.data, zone)
        // return item



    } catch (error) {
        return { type: "text", text: `${error}` }
    }

}

function getPathFromUrl(url) {
    return url.split("?")[0];
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

async function getInfoPage(page, zone) {
    console.log("+++++++++++++++++ getInfoPage")
    let info = {
        "type": "flex",
        "altText": "เพสนี้หรือป่าวนะ"
    }
    try {
        // let pagesInfo = await searchPageInfo(page, zone)
        let pagesInfo = await searchPageInfo(page, zone)
        // console.log("pagesInfo =====================>", JSON.stringify(pagesInfo))
        info.contents = pagesInfo
    } catch (error) {
        console.log(error)
    } finally {
        // console.log("=======", JSON.stringify(info))
        return info
    }

}

async function searchPageInfo(page, zone) {
    console.log("+++++++++++++++++ searchPageInfo")
    let options = {
        'method': 'GET',
        'url': `${URL_API}/${page}?fields=${QUERY}&access_token=${ACCESS_TOKEN}`,
        'headers': {
        }, json: true
    }
    let pageInfo = await rq(options)
    let newPageInfo = await formateData(pageInfo, zone)
    return newPageInfo
}

async function formateData(res, zone) {
    console.log("+++++++++++++++++ formateData")
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
            // pageInfo.footer.contents[0].action.text = `OK เช็คให้นะ`
            pageInfo.footer.contents[0].action.text = `&submit=${res.id}&zone=${zone}`
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
