<template>
  <remote-js :src="this.jsUrl" @load-js-finish="jsLoadedCb"></remote-js>
</template>
<script>
export default {
  props: {
    jsUrl: { type: String, required: true },
    // 外部js加载完成回调
    jsLoadedCb: Function
  },
  components: {
    'remote-js': {
      render (createElement) {
        console.log('self', this)
        const self = this
        return createElement('script', {
          attrs: { type: 'text/javascript', src: this.src },
          on: {
            load: function () {
              self.$emit('load-js-finish')
              console.log('load js completed')
            }
          },
          props: {
            src: { type: String, required: true }
          }
        })
      },
      props: {
        src: { type: String, required: true }
      }
    }
  }
}
</script>
