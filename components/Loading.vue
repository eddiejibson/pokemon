<template>
  <div
    style="display: flex;flex-direction:column;align-items:center;margin-top:10px;margin-bottom:10px;"
  >
    <img src="icons/192.png" />
    <p class="center-text" style="margin-top: 20px;">{{ msg }}</p>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: "Loading"
    }
  }
};
</script>

<style scoped>
img {
  animation: rotate 1s linear infinite;
  width: 40px;
  height: 40px;
}
p {
  margin-bottom: 0;
}
</style>