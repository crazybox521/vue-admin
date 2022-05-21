module.exports = {
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            /* 设置打包入口 */
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                /* 'vue-quill-editor': 'VueQuillEditor' */
            })

            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = true
                return args
            })
        })
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = false
                return args
            })
        })
    }
}