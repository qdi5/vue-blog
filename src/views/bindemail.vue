<template>
  <Modal
        v-model="value"
        title="绑定邮箱"
        @on-ok="ok"
        @on-cancel="cancel">
    <i-input v-model="email" placeholder="邮箱是本站的唯一凭证"></i-input>
  </Modal>
</template>
<script>
export default {
  data () {
    return {
      value: true,
      email: ''
    }
  },
  methods: {
    ok: function () {},
    cancel: function () {}
  }
}
</script>
<style>
</style>
