const _ = require('lodash')
var URL = require('url').URL
const { checkConfig } = require('./sendToApi')

async function web(message) {
    let info = {
        "type": "flex",
        "altText": "new messages",
        "contents": {
            "type": "bubble",
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "contents": [
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "wrap": true,
                                "text": "1"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "2"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "3"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "4"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "5"
                            }
                        ],
                        "backgroundColor": "#e7e7e7"
                    },
                    {
                        "type": "separator",
                        "color": "#ffffff"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "wrap": true,
                                "text": "1"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "2"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "3"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "4"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "5"
                            }
                        ],
                        "backgroundColor": "#e7e7e7"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "wrap": true,
                                "text": "1"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "2"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "3"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "4"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "5"
                            }
                        ],
                        "backgroundColor": "#e7e7e7"
                    },
                    {
                        "type": "separator",
                        "color": "#ffffff"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "wrap": true,
                                "text": "1"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "2"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "3"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "4"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "5"
                            }
                        ],
                        "backgroundColor": "#e7e7e7"
                    },
                    {
                        "type": "separator",
                        "color": "#ffffff"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "wrap": true,
                                "text": "1"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "2"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "3"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "4"
                            }, {
                                "type": "text",
                                "wrap": true,
                                "text": "5"
                            }
                        ],
                        "backgroundColor": "#e7e7e7"
                    }
                ]
            }
        }
    }
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
    // let newFormat = await Promise.all(configList.map(list => formateData(domain, list)))
    // info.contents.body.contents = newFormat
    // console.log("==============", JSON.stringify(info))
    return info
}

async function formateData(domain, list) {
    // let pageInfo = {
    //     "type": "box",
    //     "layout": "horizontal",
    //     "contents": [
    //         {
    //             "type": "text",
    //             "text": `Domain : ${list.domain}`,
    //             "wrap": true
    //         },
    //         {
    //             "type": "text",
    //             "text": `Channel : ${list.channel}`,
    //             "wrap": true
    //         },
    //         {
    //             "type": "text",
    //             "text": `Zone : ${list.zone}`,
    //             "wrap": true
    //         },
    //         {
    //             "type": "text",
    //             "text": `Running_Page : ${list.running_page}`,
    //             "wrap": true
    //         }
    //     ],
    //     "backgroundColor": "#80ffff"
    // }

    return {
        "type": "box",
        "layout": "vertical",
        "contents": [
            {
                "type": "separator",
                "color": "#ff0000"
            },
            {
                "type": "text",
                "text": "flex=2",
                "flex": 2
            },
            {
                "type": "separator",
                "color": "#ff0000"
            },
            {
                "type": "text",
                "text": "flex=3",
                "flex": 3
            },
            {
                "type": "separator",
                "color": "#ff0000"
            }
        ]
    }


}

module.exports = {
    web
}