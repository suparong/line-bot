const _ = require('lodash')
var URL = require('url').URL
const { checkConfig } = require('./sendToApi')

async function web(message) {
    console.log("============>", message)
    let webArray = message.split("=")
    let domain = webArray[1]
    if (_.includes(domain, "http") || _.includes(domain, "https")) {
        let url_domain = new URL(domain)
        let newDomain = (url_domain.host).split("www.")
        if (_.includes(url_domain.host, "www")) {
            domain = newDomain[1]
            // console.log("============> 1", domain)
        } else {
            domain = newDomain[0]
            // console.log("============> 2", domain)
        }
    }

    let info = {
        "type": "flex",
        "altText": "new messages",
        "contents": {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "text",
                        "text": `Search : `,
                        "weight": "bold",
                        "color": "#000E29"
                    },
                    {
                        "type": "text",
                        "text": `${domain}`,
                        "offsetStart": "-50px",
                        "weight": "regular"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "offsetTop": "-30px"
            }
        }
    }
    // console.log("============> 4", domain)
    // info.contents.header.contents.text = domain
    // let configList = await checkConfig(domain)
    // console.log("=========", configList)
    let configList = [
        {
            "domain": "citizenthaipbs.net",
            "channel": "news",
            "zone": "th",
            "running_page": true
        },
        {
            "domain": "thaipbs.or.th",
            "channel": "news",
            "zone": "th",
            "running_page": false
        }
    ]
    let newFormat = await Promise.all(configList.map(list => formateData(domain, list)))
    info.contents.body.contents = newFormat
    // console.log("==============", JSON.stringify(info))
    return info
}

async function formateData(domain, list) {
    return {
        "type": "box",
        "layout": "vertical",
        "contents": [
            {
                "type": "text",
                // "wrap": true,
                "text": `Domain : `,
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
                "text": `${list.domain}`,
                "offsetTop": "-9px",
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
                "text": `${list.channel}`,
                "offsetTop": "-24px",
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
                "text": `${list.zone}`,
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
                "text": `Running_Page : `,
                "offsetTop": "-35px",
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
                "text": `${list.running_page}`,
                "offsetTop": "-54px",
                "offsetBottom": "10px",
                "offsetStart": "125px",
                "offsetEnd": "10px",
                "size": "sm",
                "style": "normal",
                "weight": "regular"
            }
        ],
        "backgroundColor": "#e7e7e7",
        "width": "260px",
        "height": "110px"
    }


}

module.exports = {
    web
}