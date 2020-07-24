const got = require('got')
const rq = require('request-promise')
const query = "about,picture{url},fan_count,name"
const access_token = 'EAAG4BSmPZAe0BAJY7m7gJMHo4PEuI7ZALkbwcahHtru424qdIC5Ft6yMtkWWa38QDy5tEEWbOeMRTcqK7Q5lLBNtI8teRDIB9SEqqEHAC6LObgINf7SEKZCmhxCiQ3pO0ScJzSfVkvbtoZAPP1W4TckbMfTXn3qZAJuA8lByb5AZDZD'


async function facebook(message) {
    /**
     * message = "(fb,facebook)&page=AAAAAA"
     */
    let urlParams = new URLSearchParams(message)
    // console.log("11111111111", urlParams)
    let page = urlParams.get('page')
    // console.log("+++++>", page)
    let item = await request(page)
    return item
}

async function request(page) {
    try {
        var options = {
            'method': 'GET',
            'url': `https://graph.facebook.com/v4.0/${page}?fields=${query}&access_token=${access_token}`,
            'headers': {
            }, json: true
        }
        let res = await rq(options)
        let newres = await formateData(res)
        return newres
    } catch (error) {
        return { type: "text", text: `${error}` }
    }
}

async function formateData(res) {
    let data = {
        "type": "flex",
        "altText": "This is a Flex Message",
        "contents": {
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
    }
    try {
        if (res.picture) {
            data.contents.hero.url = res.picture.data.url
        }
        if (res.name) {
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `ชื่อ :  ${res.name}`
            }
            data.contents.body.contents.push(item)
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
            data.contents.body.contents.push(item)
        }
        if (res.id) {
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `ID นี้นะ :  ${res.id}`
            }
            data.contents.body.contents.push(item)
        }
    } catch (error) {
        console.log(error)
    } finally {
        return data
    }

}



module.exports = {
    facebook
}
