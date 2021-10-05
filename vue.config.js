module.exports = {
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
            })
        })
        /*   config.when(process.env.NODE_ENV === 'development', config => {
          }) */
    }
}