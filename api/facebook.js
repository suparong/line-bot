const got = require('got')
const request = require('request-promise')
const query = "about,picture,fan_count"
const access_token = 'EAAbXHzk3yrYBAF9TaOEBJR5vowTZCENLMfpKb8GKl6kaXYPQiJbEPgOqcxQlRTGrcWvOuNgexSZALeU08LI8TfAdNA81bgZBPTnLx6MNCAboq3e8gtGJlIV5DnBUqinz4lZCDFEj6DyKWveCDMKxKGwUy5UmZBTZByOSgb6g6EHT0cqQ1gT8xZB74czuclFF64ZD'


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
        let res = await request(options)
        console.log("###############################>", res)
        // if (res.error) return { type: "text", text: `${res.error}` }
        let newres = await formateData(res.body)
        console.log("###############################>", JSON.stringify(newres))
        return newres
    } catch (error) {
        console.log("=-=-=---=-=-=-", JSON.stringify(error))
        return { type: "text", text: `${error}` }
    }
}

async function formateData(res) {
    let data = {
        "type": "flex",
        "altText": "This is a Flex Message",
        "contents": {
            "type": "bubble",
            "body": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "text",
                        "text": "Hello,"
                    },
                    {
                        "type": "text",
                        "text": "World!"
                    }
                ]
            }
        }
    }

    try {

        if (res.picture) {
            data.contents.body.contents.hero.url = res.picture.data.url
        }
        // if (res.fan_count) {
        //     item = {
        //         type: "text",
        //         text: `เพสมีคนถูกใจ ${res.fan_count} คน`
        //     }
        //     data.contents.body.contents.body.contents.push(item)
        // }
        // if (res.id) {
        //     item = {
        //         type: "text",
        //         text: `เพสนี้ ID นี้นะ ${res.id}`
        //     }
        //     data.contents.body.contents.body.contents.push(item)
        // }
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