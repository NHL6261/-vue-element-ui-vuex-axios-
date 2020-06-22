const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    lintOnSave: false,
    devServer: {
        open: true,
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://localhost:4001',
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ''
                }
            }
        }
    },
    // 绝对路径
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src"))
    },
}