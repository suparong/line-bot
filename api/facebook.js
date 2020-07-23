const got = require('got')
const query = "about,picture,fan_count"
const access_token = 'EAAbXHzk3yrYBAOoDZBiZAXZCbTicjEDOsEY4NIoAxLv24tBYjbFQaJHBhgRwuNWEmN7P0VVGiWo1ZAFEiYY12WRPh8rIM9VvfHUj414QTlsFP2fAXEmoeQ0ygBbCM83rEQ41udsZCq3gRDSsUrgPzAXY7hajZASdk22OZBKON6rCtGwzbD1sZBYkAx5106fj1RIZD'


async function facebook(message) {
    /**
     * message = "(fb,facebook)&page=AAAAAA"
     */
    let urlParams = new URLSearchParams(message)
    // console.log("11111111111", urlParams)
    let page = urlParams.get('page')
    // console.log("+++++>", page)
    let item = await request(page)
    return item
}

async function request(page) {
    try {
        // var options = {
        //     'url': `https://graph.facebook.com/v4.0/${page}?fields=${query}&access_token=${access_token}`,
        //     'headers': {},
        //     json: true
        // };
        let res = await got.get(`https://graph.facebook.com/v4.0/${page}?fields=${query}&access_token=${access_token}`, { responseType: 'json' })
        // console.log("###############################>", res.body)
        if (res.error) return res.error
        let newres = await formateData(res.body)
        return newres
    } catch (error) {
        return error
    }
}

async function formateData(res) {
    let item = []
    let data = {}
    try {

        // if (res.picture) {
        //     data = {
        //         type: "image",
        //         originalContentUrl: res.picture.data.url,
        //         previewImageUrl: res.picture.data.url
        //     }
        //     item.push(data)
        // }
        // if (res.fan_count) {
        //     data = {
        //         type: "text",
        //         text: `page count ${res.fan_count}`
        //     }
        //     item.push(data)
        // }
        if (res.id) {
            data = {
                type: "text",
                text: `page_id ${res.id}`
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