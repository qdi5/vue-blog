<template>
<div class="login">
    <div class="home-color-bg"></div>
    <div class="login-wrap" id="login">
        <div class="social-login-wrap">
          <h2 class="choose-text">请选择快捷登录方式</h2>
          <div class="social-login flex-horizontal flex-horizontal-around flex-vertical-center">
                <a :href="baseUrl + '/login/github'">
                    <i class="iconfont icon-github github"></i>
                    <span>github登录</span>
                </a>
                <a :href="baseUrl + '/login/qq'">
                    <i class="iconfont icon-QQ qq"></i>
                    <span>QQ登录</span>
                </a>
                <a :href="baseUrl + '/login/weibo'">
                    <i class="iconfont icon-weibo weibo"></i>
                    <span>微博登录</span>
                </a>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import config from '../utils/default'
export default {
  data () {
    return { baseUrl: config.backend.baseUrl }
  }

}
</script>
<style lang="less" scoped>

.avatar-icon {
  width: 50px;
  height: 50px;
}
.home-color-bg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #003973;
    background: linear-gradient(to right,#31A9B3 0,#e5e5be 100%);
}
.login-title {
  text-align: center;
  color: white;
}
.choose-text {
  color: #333;
  text-align: center;
  margin: 15px 0 25px 0;
}
.login {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.login-wrap {
  -webkit-user-select: none;
  position: absolute;
  z-index: 10;
  width: 440px;
  height: 240px;
  background: rgba(255, 255, 255,.8);
  left: 50%;
  top: 50%;
  margin-left: -220px;
  margin-top: -120px;
  padding: 20px 0;
  border-radius: 12px;
  color: #eee;
  font-family: Georgia,serif;
}
.social-login {
  & > a {
    display: block;
    text-align: center;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
    & > i {
      display: block;
      font-size: 60px;
      &.github {
        color: #000000;
      }
      &.qq {
        color: #0187FA;
      }
      &.weibo {
        color: #ef8575;
      }
    }
    & > span {
      color: #959595;
    }
  }
}
@media (max-width: 768px) {
  .login-wrap {
    width: 310px;
    margin-left: -155px;
  }
}
</style>
