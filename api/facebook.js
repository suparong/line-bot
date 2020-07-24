const got = require('got')
const query = "about,picture,fan_count"
const access_token = 'EAAbXHzk3yrYBAFqlpY8qVIju1gHZAnyeit4TGM4AZBzvlUgmbj3bEibrKgh6QbS9MXstVWgmtSse5m96aok6HpQ6P7M1LwvZC7Om1haibjGUCQUZB6VyLPZBBU5lHD309QhRjCFyZBeJSxkAT1LX2ZAlH8NhaTbRvK1cMdX4RZCSta1wallnoN69IselxyWj61oZD'


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
        let res = await got.get(`https://graph.facebook.com/v4.0/${page}?fields=${query}&access_token=${access_token}`, { responseType: 'json' })
        // console.log("###############################>", res.body)
        if (res.error) return res.error
        let newres = await formateData(res.body)
        console.log("###############################>", newres)
        return newres
    } catch (error) {
        return error
    }
}

async function formateData(res) {
    let data =
    {
        "type": "flex",
        "altText": "This is a Flex Message",
        "contents": {
            "type": "bubble",
            "contents": [
                {
                    "type": "bubble",
                    "header": {
                        "type": "box",
                        "layout": "vertical",
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
                        "contents": [
                            {
                                "type": "button",
                                "style": "link",
                                "action": {
                                    "type": "uri",
                                    "label": "Go to back3",
                                    "uri": "https://back3-hw.zrinf.io/"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }




    try {
        if (res.picture) {
            data.hero.url = res.picture.data.url
        }
        if (res.fan_count) {
            let item = {
                type: "text",
                text: `เพสมีคนถูกใจ ${res.fan_count} คน`
            }
            data.body.contents.push(item)
        }
        if (res.id) {
            let item = {
                type: "text",
                text: `เพสนี้ ID นี้นะ ${res.id}`
            }
            data.body.contents.push(item)
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
