import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import CommentPlugin from '../components/CommentPlugin.vue';

const CustomElement = wrap(Vue, CommentPlugin);

window.customElements.define('comment-plugin', CustomElement);

const Plugin = {
    install(Vue) {
        Vue.component('CommentPlugin', CommentPlugin);
    }
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(Plugin);
}

export default Plugin;
export { CommentPlugin, CustomElement };