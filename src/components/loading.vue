<template>
  <div class="lds-spinner" v-show="show">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
<script>
export default {
  props: ['show']
}
</script>
<style lang="less" scoped>
.lds-spinner {
  color: #000;
  display: block;
  position: relative;
  width: 64px;
  height: 64px;
  margin: 0 auto;
  &:after {
    content: '加载中……';
    width: 120px;
    position: absolute;
    bottom: 0;
    left: 53px;
    color: #666;
    font-size: 14px;
    letter-spacing: 1px;
  }
}
.lds-spinner div {
  transform-origin: 32px 32px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 10px;
  left: 30px;
  width: 4px;
  height: 14px;
  border-radius: 20%;
  background: #666;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(45deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(90deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(135deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(180deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(225deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(270deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(315deg);
  animation-delay: -0.4s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
