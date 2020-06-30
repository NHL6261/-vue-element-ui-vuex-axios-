const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}
// pc适配方案库 lib-flexible 和 postcss-px2rem 原理:将原尺寸进行10等分 1920 / 10 = 192
// const px2rem = require("postcss-px2rem");
// const postcss = px2rem({
//     remUnit: 192 //1920px
//         // remPrecision: 5
// });
module.exports = {
    lintOnSave: false,
    devServer: {
        open: true,
        port: 7878,
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
    // css: {
    //     // 添加postcss配置
    //     loaderOptions: {
    //         postcss: {
    //             plugins: [postcss]
    //         }
    //     }
    // },
    // 绝对路径
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src"))
            // 发布模式
    },
}