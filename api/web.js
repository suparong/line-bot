const _ = require('lodash')
var URL = require('url').URL
const { checkConfig, insertConfig } = require('./sendToApi')

async function web(message) {
    try {
        let domain
        let zone = "none"
        console.log("============>", message)
        if (_.includes(message, "&zone=")) {
            console.log("++++++++++++++++ zone")
            let webArray = message.split("&")
            // console.log("++++++++++++++++ webArray", webArray)

            let domainArray = webArray[0].split("=")
            // console.log("++++++++++++++++ domainArray", domainArray)
            domain = domainArray[1]

            let zoneArray = webArray[1].split("=")
            // console.log("++++++++++++++++ zoneArray", zoneArray)
            zone = zoneArray[1]

        } else {
            console.log("++++++++++++++++not zone")
            let webArray = message.split("=")
            domain = webArray[1]
        }
        // console.log("==========> domain", domain, "zone ", zone)
        /**
         * thairath,
         * https://thairath.co.th,
         * https://www.thairath.co.th,
         * https://www.thairath.com
         */
        if (_.includes(domain, "http") || _.includes(domain, "https")) {
            let url_domain = new URL(domain)
            let newDomain = (url_domain.hostname).split("www.")
            if (_.includes(url_domain.hostname, "www")) {
                domain = newDomain[1].split(".")[0]
                // console.log("============> 1", domain)
            } else {
                domain = newDomain[0].split(".")[0]
                // console.log("============> 2", domain)
            }
        }
        // console.log("============> 4", domain)
        // info.contents.header.contents.text = domain
        domain = domain.split(".")[0]
        console.log("==", domain, ":", zone)
        let configList = await checkConfig(domain, zone)
        // console.log("=========", configList)

        ///////////
        // let configList = {
        //     "status": true || false,
        //     "type": 3 || 2 || 1,
        //     "data": [
        //         {
        //             "status": true,
        //             "domain": "http://www.apakes.com",
        //             "channel": "blog",
        //             "zone": "id",
        //             "running_page": false,
        //             "created_time": null,
        //             "sys_time": null,
        //             "cts": null
        //         }
        //     ]
        // }
        ///////////

        if (configList.status === true && configList.type === 3) {
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
                                "text": `${configList.data.length}`,
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

            let newFormat = await Promise.all((configList.data).map(list => formateData(domain, list)))
            info.contents.body.contents = newFormat
            // console.log("==============", JSON.stringify(info))
            return info
        } else if (configList.status === false && configList.type === 2) {
            // return { type: "text", text: `This config  does not exists. ` }

            return {
                "type": "flex",
                "altText": "new messages",
                "contents": {
                    "type": "bubble",
                    "header": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Website info",
                                "weight": "bold"
                            }
                        ]
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "contents": [
                                    {
                                        "type": "span",
                                        "text": "Domain : ",
                                        "weight": "bold",
                                        "color": "#000000",
                                        "size": "sm"
                                    },
                                    {
                                        "type": "span",
                                        "text": `${domain}`,
                                        "size": "sm"
                                    }
                                ],
                                "size": "sm",
                                "wrap": true
                            },
                            {
                                "type": "text",
                                "contents": [
                                    {
                                        "type": "span",
                                        "text": "Zone : ",
                                        "weight": "bold",
                                        "color": "#000000"
                                    },
                                    {
                                        "type": "span",
                                        "text": `${zone}`,
                                        "size": "sm"
                                    }
                                ],
                                "size": "sm",
                                "wrap": true
                            }
                        ],
                        "offsetTop": "-10px",
                        "paddingTop": "10px",
                        "paddingBottom": "0px"
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
                                    "text": `&web&submit=${domain}&zone=${zone}`
                                }
                            }
                        ],
                        "paddingTop": "0px",
                        "paddingBottom": "0px"
                    },
                    "styles": {
                        "footer": {
                            "backgroundColor": "#42b3f4"
                        }
                    }
                }
            }
        } else if (configList.status === false && configList.type === 1) {
            return { type: "text", text: `This website is waiting for approval.` }
        }
    } catch (error) {
        console.log("============> error", error)
    }


}

async function formateData(domain, list) {
    let created_time = null
    let sys_time = null
    let cts = null
    let created_time_GMT
    let sys_time_GMT
    let cts_GMT
    if (list.created_time && list.sys_time && list.cts) {
        let created_timeGMT = list.created_time.split("+")
        created_time_GMT = created_timeGMT[1].split(":")[0]
        created_time = created_timeGMT[0]
        // console.log(created_time)
        let sys_timeGMT = list.sys_time.split("+")
        sys_time_GMT = sys_timeGMT[1].split(":")[0]
        sys_time = sys_timeGMT[0]
        // console.log(sys_time)
        let ctsGMT = list.cts.split("+")
        cts_GMT = ctsGMT[1].split(":")[0]
        cts = ctsGMT[0]
        // console.log(cts)
    }

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
                "text": `${created_time} +${created_time_GMT}`,
                "offsetTop": "-68px",
                "offsetBottom": "10px",
                "offsetStart": "120px",
                "offsetEnd": "10px",
                "size": "xs",
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
                "text": `${sys_time} +${sys_time_GMT}`,
                "offsetTop": "-83px",
                "offsetBottom": "10px",
                "offsetStart": "90px",
                "offsetEnd": "10px",
                "size": "xs",
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
                "text": `${cts} +${cts_GMT}`,
                "offsetTop": "-98px",
                "offsetBottom": "10px",
                "offsetStart": "50px",
                "offsetEnd": "10px",
                "size": "xs",
                "style": "normal",
                "weight": "regular"
            }
        ],
        "backgroundColor": "#E8EBED",
        "width": "260px",
        "height": "170px"
    }


}

async function getConfigInfo(message, user_token) {
    let urlParams = new URLSearchParams(message)
    let config = urlParams.get('submit')
    let zone = urlParams.get('zone') || "none"

    let configInfo = {
        "_id": config,
        "zone": zone,
        "line_token": user_token
    }
    let resDB = await insertConfig(configInfo)
    // console.log("=========>", configInfo)
    if (resDB) {
        return { type: "text", text: `Your website is sent for waiting for approval.` }
    } else {
        return { type: "text", text: `This website already exists.` }
    }
}

module.exports = {
    web,
    getConfigInfo
}