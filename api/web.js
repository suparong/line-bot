const _ = require('lodash')
var URL = require('url').URL
const { checkConfig } = require('./sendToApi')

async function web(message) {
    let info = {
        "type": "flex",
        "altText": "new messages",
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
                        "text": ""
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical"
                // "contents": [
                //     //doing
                // ]
            }
        }
    }
    // console.log("============>", message)
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
    // console.log("============> 4", domain)
    info.contents.header.contents.text = domain
    // let configList = await checkConfig(domain)
    // console.log("=========", configList)
    let configList = [
        {
            "domain": "citizenthaipbs.net1",
            "channel": "news",
            "zone": "th",
            "running_page": true
        }
        // {
        //     "domain": "thaipbs.or.th2",
        //     "channel": "news",
        //     "zone": "th",
        //     "running_page": false
        // },
        // {
        //     "domain": "citizenthaipbs.net3",
        //     "channel": "news",
        //     "zone": "th",
        //     "running_page": true
        // },
        // {
        //     "domain": "thaipbs.or.th4",
        //     "channel": "news",
        //     "zone": "th",
        //     "running_page": false
        // },
        // {
        //     "domain": "citizenthaipbs.net5",
        //     "channel": "news",
        //     "zone": "th",
        //     "running_page": true
        // }
    ]
    let newFormat = await Promise.all(configList.map(list => formateData(domain, list)))
    info.contents.body.contents = newFormat
    console.log("==============", JSON.stringify(info))
    return info
}

async function formateData(domain, list) {
    let pageInfo = {
        "type": "box",
        "layout": "horizontal",
        "contents": [
            {
                "type": "text",
                "text": `Domain : ${list.domain}`,
                "wrap": true
            },
            {
                "type": "text",
                "text": `Channel : ${list.channel}`,
                "wrap": true
            },
            {
                "type": "text",
                "text": `Zone : ${list.zone}`,
                "wrap": true
            },
            {
                "type": "text",
                "text": `Running_Page : ${list.running_page}`,
                "wrap": true
            }
        ],
        "backgroundColor": "#80ffff"
    }

    return pageInfo

}

module.exports = {
    web
}