const rq = require('request-promise')
let _ = require('lodash')
const { URLSearchParams } = require('url')
const { checkPage, insertPage, apiFbSearchPage, searchPageInfo } = require('./sendToApi')
const { checkMsgIG } = require('./messages')
const { logger } = require('@zanroo/init');

/**
* message = "https://www.facebook.com/Mommy-Is-Here-108444714131126&zone=th"
*/

async function facebook(message) {
    // console.log("===============>", message)
    try {
        if (_.includes(message, "\n")) {
            let urlParams = new URLSearchParams(message)
            let type = "multi"
            logger.info('info', 'checking page type :', type)
            // console.log("111111111111111111")
            let list_page = message.split("\n")
            let zone = urlParams.get('zone') || 'none'
            let tag = urlParams.get('tag') || "0"
            // console.log(list_page)
            // console.log("zone", zone, "tag", tag)
            let list_name = await _.map(list_page, (p) => {
                let page = getPathFromUrl(p)
                return page
            })
            console.log(list_name)
            let item = await getPage(list_name, zone, tag, type)
            // console.log(JSON.stringify(item))
            return item
        } else {
            let type = "single"
            logger.info('info', 'checking page type :', type)
            // console.log("222222222222222222")
            let urlParams = new URLSearchParams(message)
            if (_.includes(message, "fb")) {
                // console.log("11111111111", urlParams)
                let name = urlParams.get('add')
                let zone = urlParams.get('zone') || 'none'
                let tag = urlParams.get('tag') || "0"
                name = encodeURIComponent(name)
                // console.log("+++++>", name, "zone : ", zone)
                let item = await getPage(name, zone, tag)
                return item
            } else {
                // console.log("222222222222")
                let name = await getPathFromUrl(message)
                let zone = urlParams.get('zone') || "none"
                let tag = urlParams.get('tag') || "0"
                var newname = name.split("&")
                newname = encodeURIComponent(newname[0])
                let item = await getPage(newname, zone, tag, type)
                return item

            }
        }
    } catch (error) {
        logger.error('error', JSON.stringify(error))
        return { type: "text", text: `${error}` }
    }
}

function getPathFromUrl(url) {
    let a = url.split("?")[0];
    return a.split("&")[0];
}

async function getPage(page, zone, tag, type) {
    // console.log("+++++++++++++++++ getPage")
    try {
        let info = {
            "type": "flex",
            "altText": "new messages"
        }
        if (type === "single") {
            console.log("single")
            // let pagesInfo = await searchPageInfo(page, zone)
            let pagesInfo = await searchPage(page, zone, tag)
            // console.log("pagesInfo =====================>", JSON.stringify(pagesInfo))
            if (pagesInfo.type === "text") {
                return pagesInfo
            } else {
                info.contents = pagesInfo
                return info
            }
        } else if (type === "multi") {
            // console.log("multi")
            let pagesInfo = await searchPageMulti(page, zone, tag)
            // console.log(JSON.stringify(pagesInfo))
            info.contents = pagesInfo
            return info
        }

    } catch (error) {
        logger.error('error', JSON.stringify(error))
        // console.log(error)
    }

}

async function searchPage(page, zone, tag) {
    // console.log("+++++++++++++++++ searchPage", page)
    // logger.info('info', 'search page : ', page)
    try {
        let pageInfo = await apiFbSearchPage(page)
        // console.log("+++++>", pageInfo.id, "zone : ", zone)
        let pageInDB = await checkPage(pageInfo.id)
        // console.log("=====", pageInDB)
        let newPage = JSON.parse(pageInDB)
        // console.log("===========>", newPage, JSON.stringify(newPage.status), typeof (newPage))
        /**
             * {
             * "status": false ,
             * "type": 1 || 2 
             * }
             */
        if (newPage.status === false && newPage.type === 1) {
            // console.log("1")
            return {
                // "type": "bubble", "body": { "type": "box", "layout": "horizontal", "contents": [{ type: "text", text: `มีคนส่งไปแล้วนะ` }] }
                type: "text", text: `This page is waiting for approval.`
            }
        } else if (newPage.status === false && newPage.type === 2) {
            // console.log("2")
            return {
                // "type": "bubble", "body": { "type": "box", "layout": "horizontal", "contents": [{ type: "text", text: `มีในระบบเราแล้วนะ` }] }
                type: "text", text: `This page already exists.`
            }
        } else {
            let newPageInfo = await formateData(pageInfo, zone, tag)
            return newPageInfo
        }
    } catch (error) {
        logger.error('error', JSON.stringify(error))
        return {
            // "type": "bubble", "body": { "type": "box", "layout": "horizontal", "contents": [{ type: "text", text: `ทำอะไรผิดป่าวววว` }] }
            type: "text", text: `Please check your link url again. Make sure that you send Facebook page’s link.`
        }
    }


}

async function searchPageMulti(page, zone, tag) {
    try {
        let body = []
        let page_list = ''
        let status = []
        for (let i = 0; i < page.length; i++) {
            // console.log("======", page[i])
            let pageInfo = await apiFbSearchPage(page[i])
            if (pageInfo) {
                let pageInDB = await checkPage(pageInfo.id)
                let newPage = JSON.parse(pageInDB)
                status.push(newPage.status)
                /**
                * {
                * "status": false | true ,
                * "type": 1 || 2 || 3
                * }
                */
                if (newPage.status === false && newPage.type === 1) {
                    let list = [{
                        "type": "text",
                        "text": `${page[i]}`,
                        "align": "start",
                        "contents": []
                    }, {
                        "type": "text",
                        "text": "> Already exist in system",
                        "contents": [],
                        "color": "#BE3214"
                    }]
                    body.push(_.map(list, (l) => { return l }))

                } else if (newPage.status === false && newPage.type === 2) {
                    let list = [{
                        "type": "text",
                        "text": `${page[i]}`,
                        "align": "start",
                        "contents": []
                    }, {
                        "type": "text",
                        "text": "> Already exist in system",
                        "contents": [],
                        "color": "#BE3214"
                    }]
                    body.push(_.map(list, (l) => { return l }))

                } else {
                    let list = [{
                        "type": "text",
                        "text": `${page[i]}`,
                        "align": "start",
                        "contents": []
                    }, {
                        "type": "text",
                        "text": "> Not exist in system",
                        "contents": [],
                        "color": "#0BA993"
                    }]
                    // if (i != page.length - 1) {
                    // console.log(i, ":", page.length - 1)
                    page_list += `${pageInfo.id},`
                    body.push(_.map(list, (l) => { return l }))
                    // } else {
                    //     // console.log(i, ":", page.length - 1, "end")
                    //     page_list += `${pageInfo.id}`
                    //     let text_approve = [{
                    //         "type": "separator",
                    //         "margin": "lg"
                    //     },
                    //     {
                    //         "type": "text",
                    //         "text": "Do you want to send all which not exist to approve ?",
                    //         "margin": "lg",
                    //         "wrap": true,
                    //         "contents": []
                    //     }]
                    //     body.push(_.map(text_approve, (t) => { return t }))
                    // }


                }
            } else {
                let list = [{
                    "type": "text",
                    "text": `${page[i]}`,
                    "align": "start",
                    "contents": []
                }, {
                    "type": "text",
                    "text": "> Invalid url",
                    "contents": [],
                    "color": "#BE3214"
                }]
                body.push(_.map(list, (l) => { return l }))
            }
        }
        // console.log(body)
        // console.log('=================')
        // console.log(page_list)
        let link_submit = ""
        if (_.compact(status).length == 0) {
            link_submit = null
        } else {
            let text_approve = [{
                "type": "separator",
                "margin": "lg"
            },
            {
                "type": "text",
                "text": "Do you want to send all which not exist to approve ?",
                "margin": "lg",
                "wrap": true,
                "contents": []
            }]
            body.push(_.map(text_approve, (t) => { return t }))
            link_submit = `&fb&submit=${page_list}&zone=${zone}&tag=${tag}`
        }
        body = _.flatMapDeep(body)
        // console.log(link_submit, "body", body)
        return await formateDataMulti(body, link_submit)
    } catch (error) {
        logger.error('error', JSON.stringify(error))
    }
}

async function formateDataMulti(item, link_submit) {
    // console.log("link_submit", link_submit)
    try {
        logger.info('info', 'formate data multi')
        let data = {
            "type": "bubble",
            "direction": "ltr",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "Multiple Facebook Page Request",
                        "weight": "bold",
                        "align": "center",
                        "contents": []
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical"
            }
        }
        data.body.contents = item
        if (link_submit) {
            data.footer = {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "button",
                        "action": {
                            "type": "message",
                            "label": "Submit",
                            "text": ''
                        },
                        "style": "primary"
                    }
                ]
            }
            data.footer.contents[0].action.text = link_submit
        }
        // console.log(data)
        // if (link_submit) data.footer.contents[0].action.text = link_submit
        return data
    } catch (error) {
        console.log(error)
    }

}

async function formateData(res, zone, tag) {
    // console.log("+++++++++++++++++ formateData")
    logger.info('info', 'formate data single')
    let pageInfo = {
        "type": "bubble",
        "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "Facebook Page Request",
                    "weight": "bold",
                    "align": "center",
                }
            ]
        },
        "hero": {
            "type": "image",
            "size": "full",
            "url": "",
            "aspectRatio": "1.51:1",
            "aspectMode": "fit"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": []
        },
        "footer": {
            "type": "box",
            "layout": "horizontal",
            "spacing": "sm",
            "contents": [
                {
                    "type": "button",
                    "style": "primary",
                    "action": {
                        "type": "message",
                        "label": "Submit",
                        "text": ""
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
                "text": `Page Name: ${res.name}`
            }
            pageInfo.body.contents.push(item)
        }
        if (res.id) {
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `Page ID: ${res.id}`
            }
            pageInfo.body.contents.push(item)
            // pageInfo.footer.contents[0].action.text = `OK เช็คให้นะ`
            pageInfo.footer.contents[0].action.text = `&fb&submit=${res.id}&zone=${zone}&tag=${tag}`
        }
        if (res.fan_count) {
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `Like: ${res.fan_count}`,
                "wrap": true
            }
            pageInfo.body.contents.push(item)
        }
        if (tag === "1") {
            pageInfo.body.contents.push({ "type": "separator", "margin": "lg" })
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `Customer Request: Yes`,
                "wrap": true
            }
            pageInfo.body.contents.push(item)
        } else {
            pageInfo.body.contents.push({ "type": "separator", "margin": "lg" })
            item = {
                "type": "text",
                "margin": "md",
                "size": "sm",
                "color": "#666666",
                "text": `Customer Request: No`,
                "wrap": true
            }
            pageInfo.body.contents.push(item)
        }
    } catch (error) {
        logger.error('error', JSON.stringify(error))
    } finally {
        return pageInfo
    }

}

async function getPageInfo(message, user_token) {
    try {
        logger.info('info', 'get page info facebook')
        let urlParams = new URLSearchParams(message)
        let page_id = urlParams.get('submit')
        let zone = urlParams.get('zone') || "none"
        let tag = urlParams.get('tag') || "0"

        let list = page_id.split(",")
        list = _.uniq(list)
        list = _.compact(list)
        // console.log(list)
        for (let i = 0; i < list.length; i++) {
            const PageInfo = await searchPageInfo(list[i], zone, tag, user_token)
            // console.log(PageInfo)
            await insertPage(PageInfo)
            // console.log("=============>", resDB)
            // if (resDB) {
            return { type: "text", text: "Thanks for your submit.\n\nYour request is waiting for approval and PQ will approve on working day 17:00 (GMT+7).\n\n**If urgent, please contact PQ." }
            // } else {
            //     return { type: "text", text: `This page already exists.` }
            // }
        }
    } catch (error) {
        logger.error('error', JSON.stringify(error))
        // console.log(error)
    }

}

module.exports = {
    facebook,
    getPageInfo
}
