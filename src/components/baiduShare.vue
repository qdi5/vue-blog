<template>
  <div class="bdsharebuttonbox" data-tag="share_1">
      <a class="bds_weixin" data-cmd="weixin"></a>
      <a class="bds_qzone" data-cmd="qzone" href="#"></a>
      <a class="bds_tsina" data-cmd="tsina"></a>
      <a class="bds_tqq" data-cmd="tqq"></a>
      <a class="bds_more" data-cmd="more"></a>
  </div>
</template>

<script>
export default {
  props: ['title', 'summary', 'url'],
  mounted () {
    const _this = this
    this.$nextTick(() => {
      window._bd_share_config = {
        common: {
          bdSnsKey: {},
          bdText: _this.title,
          bdDesc: _this.summary,
          bdUrl: _this.url,
          bdMini: '2',
          bdPic: '',
          bdStyle: '0',
          bdSize: '24'
        },
        share: {}
      }
      console.log('window._bd_share_config', window._bd_share_config)
      console.log('baiduShareDom:', document.getElementById('baiduShare'))
      if (document.getElementById('baiduShare') === null) {
        const s = document.createElement('script')
        s.type = 'text/javascript'
        s.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)
        s.setAttribute('id', 'baiduShare')
        document.body.appendChild(s)
      } else {
        // 初始化百度分享
        window._bd_share_main.init()
      }
    })
  }
}
</script>
