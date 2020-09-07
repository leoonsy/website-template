import Test from './Test';
import Vue from 'vue';
import TestComponent from './TestComponent';

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
