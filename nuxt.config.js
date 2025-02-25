export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'comment-system-plugin',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@/plugins/comment-system-plugin.js'
    ],

    axios: {
        // baseURL: 'https://localhost:7031'
    },

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/bootstrap
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios'
    ],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        extend(config, ctx) {
            // Thêm rule cho các tệp .mjs
            config.module.rules.push({
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            });
        }
    }
}