const { assign } = require("lodash")

async function help() {
    let info = {
        "type": "flex",
        "altText": "new messages"
    }

    let sendHelp = await formatHelp()
    info.contents = sendHelp
    return info
}

async function formatHelp() {
    return {
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
                    "text": "How To Add Facebook Page"
                }
            ]
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `   1. Send Facebook page’s link with zone`,
                    "wrap": true
                }, {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `   Ex.https://www.facebook.com/TidPromo/&zone=th`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `    Zone List in Zanroo system:`,
                    "wrap": true
                }, {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `   th, jp, ph, mm, my, au, kr, sg, hk, id, tw, kh, vn, us, in, nz, nl, fr, de, ru, ae, eg, lk, br, mx, la, pk, gb, bn, ca`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "text": `ตัวอย่าง`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `   2. If your page does not exist in our system, page info will be shown.`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `   3. Submit your page and wait for an approval.`,
                    "wrap": true
                }
            ]
        }
    }

}

module.exports = {
    help
}