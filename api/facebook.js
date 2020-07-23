const got = require('got')
const query = "about,picture,fan_count"
const access_token = 'EAAG4BSmPZAe0BAHFYkRTYyE1MvWd3hTRdZB57oZCRYzdqUxb1HLPAqBR2prXdbRUmYY9Jb8UaoF41MDOAe1U5SgaujkT3c0RTgRZC6A487wxuhRRn6eshhUfT9jcZA6WjlyUlv9dZBqFQqzxVotKOxwOR2pgEubyr43hdgK4A7oBtB3G46Vq6RpNotWgh4nssZD'


async function facebook(message) {
    /**
     * message = "(fb,facebook)?page=ABCDEFG"
     */
    let urlParams = new URLSearchParams(message)
    let page = urlParams.get('page')
    console.log("+++++>", page)
    if (!page) return null
    let item = await request(page)
}

async function request(page) {
    try {
        var options = {
            'url': `https://graph.facebook.com/v4.0/${page}?fields=${query}&access_token=${access_token}`,
            'headers': {},
            json: true
        };
        let res = await got.get(options)
        let newres = await formateData(res)
        return newres
    } catch (error) {
        return error
    }
}

async function formateData(res) {
    let item = []
    let data = {}
    try {

        if (res.picture) {
            data = {
                type: "image",
                originalContentUrl: res.picture.data.url,
                previewImageUrl: res.picture.data.url
            }
            item.push(data)
        }
        if (res.fan_count) {
            data = {
                type: "text",
                text: `page count ${res.fan_count}`
            }
            item.push(data)
        }
        if (res.id) {
            data = {
                type: "text",
                text: `page_id ${res._id}`
            }
            item.push(data)
        }
    } catch (error) {
        console.log(error)
    } finally {
        return item
    }

}



module.exports = {
    facebook
}