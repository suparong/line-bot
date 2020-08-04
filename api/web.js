const _ = require('lodash')

async function web(message) {
    console.log("============>", message)
    let webArray = message.split("=")
    const domain = webArray[1]
    if (_.includes(domain, "http") || _.includes(domain, "https")) {
        let url_domain = new URL(domain)
        console.log("============> 1", url_domain.host)
        console.log("============> 1", url_domain.hostname)
    } else {
        console.log("============> 2", domain)
    }



}

module.exports = {
    web
}