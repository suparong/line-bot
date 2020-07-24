const got = require('got')
const rq = require('request-promise')
const query = "about,picture,fan_count"
const access_token = 'EAAbXHzk3yrYBANSIfLMaOb8dXkzw5sx2SOKClGp4WCRiuFt9ZBgD7ZAXK7lFV3IHFWzvXforZBSSuMDPWkhJw8s8uNLWmQnDPWf49um0xkIurM3r0eJE8jhHrpLiZCJ6HpRaUb7g1ZCujgql2Aa7xgLlGNN9ZAIZATmvx68i42gDDEEZA7fnlNjDtr08dnMFrlMZD'


async function facebook(message) {
    /**
     * message = "(fb,facebook)&page=AAAAAA"
     */
    let urlParams = new URLSearchParams(message)
    // console.log("11111111111", urlParams)
    let page = urlParams.get('page')
    console.log("+++++>", page)
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
        console.log("###############################>", res)
        let newres = await formateData(res)
        console.log("###############################>", JSON.stringify(newres))
        return newres
    } catch (error) {
        console.log("=-=-=---=-=-=-", JSON.stringify(error.statusCode))
        return { type: "text", text: `${error}` }
    }
}

async function formateData(res) {
    let data = {
        "type": "flex",
        "altText": "This is a Flex Message",
        "contents": {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "text",
                        "text": "ใช่เพสนี้หรือป่าวนะ"
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
                "layout": "horizontal",
                "contents": []
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
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
        if (res.fan_count) {
            item = {
                "type": "text",
                "margin": "md",
                "text": `เพสมีคนถูกใจ ${res.fan_count} คน`
            }
            data.contents.body.contents.push(item)
        }
        if (res.id) {
            item = {
                "type": "text",
                "margin": "md",
                "text": `เพสนี้ ID นี้นะ ${res.id}`
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

// "type": "bubble",
// "header": {
//     "type": "box",
//     "layout": "horizontal",
//     "contents": [
//         {
//             "type": "text",
//             "text": "ใช่เพสนี้หรือป่าวนะ"
//         }
//     ]
// },
// "hero": {
//     "type": "image",
//     "size": "full",
//     "url": "",
//     "aspectRatio": "2:1"
// },
// "body": {
//     "type": "box",
//     "layout": "vertical",
//     "contents": []
// },
// "footer": {
//     "type": "box",
//     "layout": "vertical",
//     "contents": [
//         {
//             "type": "button",
//             "style": "link",
//             "action": {
//                 "type": "uri",
//                 "label": "Go to back3",
//                 "uri": "https://back3-hw.zrinf.io/"
//             }
//         }
//     ]
// }