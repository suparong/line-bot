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
                            "type": "icon",
                            "url": "https://example.com/flex/images/icon.png",
                            "size": "md"
                        },
                        {
                            "type": "text",
                            "text": "The quick brown fox jumps over the lazy dog",
                            "size": "md"
                        }
                    ]
                },
                {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                        {
                            "type": "icon",
                            "url": "https://example.com/flex/images/icon.png",
                            "size": "lg"
                        },
                        {
                            "type": "text",
                            "text": "The quick brown fox jumps over the lazy dog",
                            "size": "lg"
                        }
                    ]
                },
                {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                        {
                            "type": "icon",
                            "url": "https://example.com/flex/images/icon.png",
                            "size": "xl"
                        },
                        {
                            "type": "text",
                            "text": "The quick brown fox jumps over the lazy dog",
                            "size": "xl"
                        }
                    ]
                },
                {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                        {
                            "type": "icon",
                            "url": "https://example.com/flex/images/icon.png",
                            "size": "xxl"
                        },
                        {
                            "type": "text",
                            "text": "The quick brown fox jumps over the lazy dog",
                            "size": "xxl"
                        }
                    ]
                },
                {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                        {
                            "type": "icon",
                            "url": "https://example.com/flex/images/icon.png",
                            "size": "3xl"
                        },
                        {
                            "type": "text",
                            "text": "The quick brown fox jumps over the lazy dog",
                            "size": "3xl"
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