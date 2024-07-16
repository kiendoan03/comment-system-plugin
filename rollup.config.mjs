// import babel from '@rollup/plugin-babel';
// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

// export default {
//     input: 'plugins/comment-system-plugin.js',
//     output: {
//         file: 'dist/comment-system-plugin.umd.js',
//         format: 'umd',
//         name: 'CommentSystemPlugin',
//         globals: {
//             vue: 'Vue',
//             '@/components/CommentPlugin.vue': 'CommentPlugin'
//         }
//     },
//     // external: ['vue'],
//     external: ['vue', '@/components/CommentPlugin.vue'],
//     plugins: [
//         resolve(),
//         commonjs(),
//         babel({ babelHelpers: 'bundled' })
//     ]
// };

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-only';

export default {
    input: 'plugins/comment-system-plugin.js',
    output: {
        file: 'dist/comment-system-plugin.umd.js',
        format: 'umd',
        name: 'CommentSystemPlugin',
        exports: 'named',
        globals: {
            vue: 'Vue'
        }
    },
    external: ['vue'],
    plugins: [
        resolve({
            extensions: ['.js', '.vue']
        }),
        commonjs(),
        vue({
            css: true,
            compileTemplate: true
        }),
        css({ output: 'comment-system-plugin.css' }),
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env'],
            babelHelpers: 'bundled'
        }),
        json()
    ]
};