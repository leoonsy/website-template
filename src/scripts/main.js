import Test from './Test';
import Vue from 'vue';
import TestComponent from './TestComponent.vue';

// Test();
console.log(Vue);
debugger;

new Vue({
  el: '.wrapper',
  components: {
    TestComponent,
  },
  data: () => ({
    vueContent: 'Vue Content :)',
  }),
});
