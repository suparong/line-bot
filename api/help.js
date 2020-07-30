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
                    "text": "วิธี add page Facebook"
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
                    "text": `1.ใส่ link page (ex.https://www.facebook.com/TidPromo)`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `2.ใส่ zone มาด้วย ถ้าไม่ใส่มาจะเป็น none`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `ตัวอย่าง`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `https://www.facebook.com/Mommy-Is-Here-108444714131126&zone=th
                    Mommy-Is-Here-108444714131126&zone=th`,
                    "wrap": true
                }
            ]
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `****** add แล้วไม่ได้เข้าเลยนะ ต้องรอ approve ก่อน`,
                    "wrap": true
                }
            ]
        }
    }

}

module.exports = {
    help
}