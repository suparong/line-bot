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
    // console.log("============> 4", domain)
    // info.contents.header.contents.text = domain
    // let configList = await checkConfig(domain)
    // console.log("=========", configList)
    let configList = [
        {
            "domain": "land-house.info",
            "channel": "commerce",
            "zone": "th",
            "running_page": false,
            "created_time": "2020-07-24T18:38:03.116Z",
            "sys_time": "2018-02-20T06:49:32.303Z",
            "cts": "2020-07-24T18:38:02.551Z"
        },
        {
            "domain": "land-house.info2",
            "channel": "commerce",
            "zone": "th",
            "running_page": false,
            "created_time": "2020-07-24T18:38:03.116Z",
            "sys_time": "2018-02-20T06:49:32.303Z",
            "cts": "2020-07-24T18:38:02.551Z"
        }
    ]

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
                        "offsetStart": "0px",
                        "weight": "regular",
                        "offsetBottom": "0px"
                    },
                    {
                        "type": "text",
                        "text": `Total : `,
                        "weight": "bold",
                        "offsetStart": "60px",
                        "color": "#000E29"
                    },
                    {
                        "type": "text",
                        "text": `${configList.length}`,
                        "offsetStart": "50px",
                        "weight": "regular"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "offsetTop": "-25px"
            }
        }
    }

    let newFormat = await Promise.all(configList.map(list => formateData(domain, list)))
    info.contents.body.contents = newFormat
    // console.log("==============", JSON.stringify(info))
    return info
}

async function formateData(domain, list) {
    let created_time = list.created_time.split(".")
    let sys_time = list.sys_time.split(".")
    let cts = list.cts.split(".")
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
                "offsetTop": "-8px",
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
                "offsetTop": "-23px",
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
            }, {
                "type": "text",
                "wrap": true,
                "text": `Created_Time : `,
                "offsetTop": "-50px",
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
                "text": `${created_time[0]}`,
                "offsetTop": "-68px",
                "offsetBottom": "10px",
                "offsetStart": "120px",
                "offsetEnd": "10px",
                "size": "sm",
                "style": "normal",
                "weight": "regular"
            }, {
                "type": "text",
                "wrap": true,
                "text": `Sys_Time : `,
                "offsetTop": "-65px",
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
                "text": `${sys_time[0]}`,
                "offsetTop": "-83px",
                "offsetBottom": "10px",
                "offsetStart": "90px",
                "offsetEnd": "10px",
                "size": "sm",
                "style": "normal",
                "weight": "regular"
            }, {
                "type": "text",
                "wrap": true,
                "text": `Cts : `,
                "offsetTop": "-80px",
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
                "text": `${cts[0]}`,
                "offsetTop": "-98px",
                "offsetBottom": "10px",
                "offsetStart": "50px",
                "offsetEnd": "10px",
                "size": "sm",
                "style": "normal",
                "weight": "regular"
            }
        ],
        "backgroundColor": "#D6E2FF",
        "width": "270px",
        "height": "170px"
    }


}

module.exports = {
    web
}