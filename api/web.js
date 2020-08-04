const _ = require('lodash')
var URL = require('url').URL

async function web(message) {
    console.log("============>", message)
    let webArray = message.split("=")
    const domain = webArray[1]
    if (_.includes(domain, "http") || _.includes(domain, "https")) {
        let url_domain = new URL(domain)
        let newdomain = (url_domain.host).split("www.")
        console.log("============> 1", newdomain)
    } else {
        console.log("============> 2", domain)
    }



}

module.exports = {
    web
}