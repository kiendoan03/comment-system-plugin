// import Vue from 'vue';
// import CommentPlugin from '@/components/CommentPlugin.vue';

// Vue.component('CommentPlugin', CommentPlugin);

// export default (context, inject) => {
//     inject('commentPlugin', CommentPlugin);
// };

import Vue from 'vue';
import CommentPlugin from '../components/CommentPlugin.vue';

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
export { CommentPlugin };