module.exports = {
    apps: [{
        name: "backend",
        command: "dist/index.js",
        node_arg: "-r dotenv/config" 
    }]
}