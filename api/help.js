const { assign } = require("lodash")

async function help() {
    // let info = {
    //     "type": "flex",
    //     "altText": "new messages"
    // }
    let sendHelpList = []
    // let sendHelpFB = await formatHelpFB()
    // sendHelpList.push(sendHelpFB)
    // doing sendHelpWEB
    let sendHelpWEB = await formatHelpWEB()
    sendHelpList.push(sendHelpWEB)
    return sendHelpList
}

async function formatHelpFB() {
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
                        "text": "How To Add Facebook Page"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "offsetTop": "-25px",
                "contents": [
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   1. Send Facebook page’s link with zone",
                        "wrap": true
                    },
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   Ex.https://www.facebook.com/TidPromo/&zone=th",
                        "wrap": true
                    },
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "    Zone List in Zanroo system:",
                        "wrap": true
                    },
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   th, jp, ph, mm, my, au, kr, sg, hk, id, tw, kh, vn, us, in, nz, nl, fr, de, ru, ae, eg, lk, br, mx, la, pk, gb, bn, ca",
                        "wrap": true
                    },
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   2. If your page does not exist in our system, page info will be shown.",
                        "wrap": true
                    },
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   3. Submit your page and wait for an approval.",
                        "wrap": true
                    }
                ]
            }
        }
    }
}

async function formatHelpWEB() {
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
                        "text": "How to Add Website"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "offsetTop": "-25px",
                "contents": [
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   1. Send domain name of your website.",
                        "wrap": true
                    },
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   E.x. If you want message from web “thairath”, send web=thairath",
                        "wrap": true
                    },
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   2. If your website does not exist in our system, config for your website will be shown.",
                        "wrap": true
                    },
                    {
                        "type": "text",
                        "margin": "md",
                        "size": "sm",
                        "color": "#666666",
                        "text": "   3. Submit your website and wait for and approval.",
                        "wrap": true
                    }
                ]
            }
        }
    }
}

module.exports = {
    help
}