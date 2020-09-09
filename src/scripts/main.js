import Test from './Test';
import Vue from 'vue';
import TestComponent from './TestComponent.vue';

Test();

new Vue({
  el: '.wrapper',
  components: {
    TestComponent,
  },
  data: () => ({
    vueContent: 'Vue Content :)',
  }),
});
