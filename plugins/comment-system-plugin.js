import Vue from 'vue';
import CommentPlugin from '@/components/CommentPlugin.vue';

Vue.component('CommentPlugin', CommentPlugin);

export default (context, inject) => {
    inject('commentPlugin', CommentPlugin);
};

// import Vue from 'vue';
// import CommentPlugin from '../components/CommentPlugin.vue';

// const Plugin = {
//     install(Vue) {
//         Vue.component('CommentPlugin', CommentPlugin);
//     }
// };

// let GlobalVue = null;
// if (typeof window !== 'undefined') {
//     GlobalVue = window.Vue;
// } else if (typeof global !== 'undefined') {
//     GlobalVue = global.Vue;
// }
// if (GlobalVue) {
//     GlobalVue.use(Plugin);
// }

// export default Plugin;
// export { CommentPlugin };

// import Vue from 'vue';
// import wrap from '@vue/web-component-wrapper';
// import CommentPlugin from '../components/CommentPlugin.vue';

// const CustomElement = wrap(Vue, CommentPlugin);

// window.customElements.define('comment-plugin', CustomElement);


// import Vue from 'vue';
// import wrap from '@vue/web-component-wrapper';
// import CommentPlugin from '../components/CommentPlugin.vue';

// // Đóng gói component Vue thành Web Component
// const CustomElement = wrap(Vue, CommentPlugin);

// // Đăng ký Web Component
// window.customElements.define('comment-plugin', CustomElement);

// // Định nghĩa plugin Vue
// const Plugin = {
//     install(Vue) {
//         Vue.component('CommentPlugin', CommentPlugin);
//     }
// };

// // Kiểm tra môi trường và tự động cài đặt plugin nếu Vue toàn cục tồn tại
// let GlobalVue = null;
// if (typeof window !== 'undefined') {
//     GlobalVue = window.Vue;
// } else if (typeof global !== 'undefined') {
//     GlobalVue = global.Vue;
// }
// if (GlobalVue) {
//     GlobalVue.use(Plugin);
// }

// // Xuất plugin và Web Component để sử dụng ở nơi khác
// export default Plugin;
// export { CommentPlugin, CustomElement };