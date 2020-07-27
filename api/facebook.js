const got = require('got')
const rq = require('request-promise')
const QUERY = "about,picture{url},fan_count,name"
const ACCESS_TOKEN = 'EAAG4BSmPZAe0BAJY7m7gJMHo4PEuI7ZALkbwcahHtru424qdIC5Ft6yMtkWWa38QDy5tEEWbOeMRTcqK7Q5lLBNtI8teRDIB9SEqqEHAC6LObgINf7SEKZCmhxCiQ3pO0ScJzSfVkvbtoZAPP1W4TckbMfTXn3qZAJuA8lByb5AZDZD'
const URL = "https://graph.facebook.com/v4.0"

async function facebook(message) {
    /**
     * message = "(fb,facebook)&add=AAAAAA"
     */
    let urlParams = new URLSearchParams(message)
    // console.log("11111111111", urlParams)
    let name = urlParams.get('add')
    // console.log("+++++>", page)
    let paegs = await searchPages(name)
    let item = await getInfoPage(pages)
    return item
}

async function searchPages(name) {
    try {
        let options = {
            'method': 'GET',
            'url': `${URL}/search?type=place&q=${name}&access_token=${ACCESS_TOKEN}&fields=link,name`,
            'headers': {
            }, json: true
        }
        let pages = await rq(options)
        return pages
    } catch (error) {
        return { type: "text", text: `${error}` }
    }
}

async function getInfoPage(pages) {
    let data = {
        "type": "flex",
        "altText": "This is a Flex Message",
        "contents": {
            "type": "carousel"
        }
    }
    let pagesInfo = await Promise.all(pages.map(page => pageInfo(page)))
    data.contents.contents.push(pagesInfo)
    // return pages
}

const pageInfo = async (page) => {
    const info = await searchPageInfo(page)
    return info
}

async function searchPageInfo(page) {
    try {
        let options = {
            'method': 'GET',
            'url': `${URL}/${page.link}?fields=${QUERY}&access_token=${ACCESS_TOKEN}`,
            'headers': {
            }, json: true
        }
        let pageInfo = await rq(options)
        let newPageInfo = await formateData(pageInfo)
        return newPageInfo
    } catch (error) {
        return { type: "text", text: `${error}` }
    }
}

async function formateData(res) {
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
            "aspectRatio": "2:1"
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
                        "type": "uri",
                        "label": "Go to back3",
                        "uri": "https://back3-hw.zrinf.io/"
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
