import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-only';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default {
    input: 'plugins/comment-system-plugin-vue.js',
    output: {
        file: 'dist/comment-system-plugin.umd.js',
        format: 'umd',
        name: 'CommentSystemPlugin',
        exports: 'named',
        globals: {
            vue: 'Vue',
        }
    },
    external: ['vue'],
    plugins: [
        resolve({
            extensions: ['.js', '.vue'],
            preferBuiltins: false
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
        json(),
        polyfillNode()
    ],
};