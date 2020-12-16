module.exports = {
    apps: [{
        name: "line-bot",
        script: "./index.js",
        env: {
            NODE_ENV: "production"
        }
    }]
}
