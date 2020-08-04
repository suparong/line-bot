const _ = require('lodash')
var URL = require('url').URL

async function web(message) {
    console.log("============>", message)
    let webArray = message.split("=")
    const domain = webArray[1]
    if (_.includes(domain, "http") || _.includes(domain, "https")) {
        let url_domain = new URL(domain)
        if (_.includes(url_domain, "www")) {
            let newdomain = (url_domain.host).split("www.")
            domain = newdomain[1]
            console.log("============> 1", domain)
        } else {
            domain = newdomain[0]
            console.log("============> 2", domain)
        }
    } else {
        console.log("============> 3", domain)
    }
    console.log("============> 4", domain)


}

module.exports = {
    web
}