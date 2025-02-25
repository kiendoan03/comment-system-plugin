import CommentPlugin from '../components/CommentPlugin.vue';
import Vuelidate from 'vuelidate';

const Plugin = {
    install(Vue) {
        Vue.component('CommentPlugin', CommentPlugin);
        Vue.use(Vuelidate);
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
export { CommentPlugin };