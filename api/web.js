const _ = require('lodash')
var URL = require('url').URL

async function web(message) {
    console.log("============>", message)
    let webArray = message.split("=")
    let domain = webArray[1]
    if (_.includes(domain, "http") || _.includes(domain, "https")) {
        let url_domain = new URL(domain)
        let newDomain = (url_domain.host).split("www.")
        if (_.includes(url_domain, "www")) {
            domain = newDomain[1]
            console.log("============> 1", domain)
        } else {
            domain = newDomain[0]
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