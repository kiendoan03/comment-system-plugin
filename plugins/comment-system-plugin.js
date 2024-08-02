import Vue from 'vue';
import CommentPlugin from '@/components/CommentPlugin.vue';
import Vuelidate from 'vuelidate';

Vue.use(Vuelidate);
Vue.component('CommentPlugin', CommentPlugin);

export default (context, inject) => {
    inject('commentPlugin', CommentPlugin);
};