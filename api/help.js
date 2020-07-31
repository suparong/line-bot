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
                    "text": `   1.ใส่ link page (Ex.https://www.facebook.com/TidPromo)`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `   2.ใส่ zone มาด้วย ถ้าไม่ใส่มาจะเป็น none `,
                    "wrap": true
                }, {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `zone ทีีมีในระบบ : th, jp, ph, mm, my, au, kr, sg, hk, id, tw, kh, vn, us, in, nz, nl, fr, de, ru, ae, eg, lk, br, mx, la, pk, gb, bn, ca`,
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
                    "text": `   https://www.facebook.com/Mommy-Is-Here/&zone=th`,
                    "wrap": true
                },
                {
                    "type": "text",
                    "margin": "md",
                    "size": "sm",
                    "color": "#666666",
                    "text": `****** กด submit แล้วรอ approve นะจ๊ะ`,
                    "wrap": true
                }
            ]
        }
    }

}

module.exports = {
    help
}