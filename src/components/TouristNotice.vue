<template>
  <van-dialog
    v-model="show"
    title="提示"
    confirm-button-text="知道了"
    confirm-button-color="#3c9cff"
    cancel-button-text="去登录"
    message="当前为游客身份，请通过校内认证登录"
    show-cancel-button
    @cancel="toLogin"
  >
  </van-dialog>
</template>

<script>
export default {
  props: ['tourist'],
  data() {
    return {
      show: this.tourist
    }
  },
  watch: {
    tourist(newVal) {
      this.show = newVal
    },
    show(newVal) {
      this.$emit('update:tourist', newVal)
    }
  },
  methods: {
    toLogin() {
      window.location.href = `https://apps.hqu.edu.cn/wechat-hqu/wechatauth.html?proxyTo=authoauth&sendUrl=/connect/oauth2/authorize?appid=wxfe035b066fb1158b&redirect_uri=${encodeURIComponent(
        `${location.origin}`
      )}&encode_flag=Y&response_type=code&scope=snsapi_userinfo#wechat_redirect`
      sessionStorage.removeItem('tourist')
    }
  },
  mounted() {
    // 游客首次进入弹窗
  }
}
</script>
