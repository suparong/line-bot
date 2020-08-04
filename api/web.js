const _ = require('lodash')

async function web(message) {
    console.log("============>", message)
    let webArray = message.split("=")
    const domain = webArray[1]
    if (_.includes("http") || _.includes("https")) {
        let url_domain = new URL(domain)
        console.log("============> 1", url_domain.host)
    } else {
        console.log("============> 2", domain)
    }



}

module.exports = {
    web
}