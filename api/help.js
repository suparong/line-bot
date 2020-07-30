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
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                        {
                            "type": "text",
                            "text": "วิธี add page Facebook",
                            "size": "md",
                            "wrap": true
                        },
                        {
                            "type": "text",
                            "text": "1.ใส่ link page (ex.https://www.facebook.com/TidPromo)",
                            "size": "md",
                            "wrap": true
                        },
                        {
                            "type": "text",
                            "text": "ใส่ zone มาด้วย ถ้าไม่ใส่มาจะเป็น none",
                            "size": "md",
                            "wrap": true
                        },
                        {
                            "type": "text",
                            "text": "Ex.https://www.facebook.com/Mommy-Is-Here-108444714131126&zone=th",
                            "size": "md",
                            "wrap": true
                        },
                        {
                            "type": "text",
                            "text": "****** add แล้วไม่ได้เข้าเลยนะ ต้องรอ approve ก่อน",
                            "size": "lg",
                            "wrap": true
                        }
                    ]
                }
            ]
        }
    }
}

module.exports = {
    help
}