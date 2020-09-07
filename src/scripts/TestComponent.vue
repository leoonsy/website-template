<template>
  <div>
    {{ text }}
    <img src="/images/together.jpg" alt="together" />
  </div>
</template>

<script>
export default {
  name: 'TestComponent',
  data: () => ({
    text: 'Simple component',
  }),
};
</script>
