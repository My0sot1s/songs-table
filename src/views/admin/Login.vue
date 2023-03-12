<template>
  <div id="login">
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        autocomplete
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { adminLogin } from '@/request/api/admin'

export default {
  data() {
    return {
      username: '',
      password: '',
      login: false
    }
  },
  methods: {
    async onSubmit() {
      Toast.loading({
        message: '登录中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })

      try {
        const res = await adminLogin(this.username, this.password)
        if (res.data.code === 200) {
          localStorage.setItem('admin_token', res.data.data.token)
          localStorage.setItem('username', this.username)
          localStorage.setItem('psw', this.password)
          Toast.clear()
          this.$router.replace('/admin/home')
        } else {
          Toast.fail(res.data.msg)
        }
      } catch (error) {
        Toast.fail('请求异常')
      }
    }
  },
  mounted() {
    Toast.setDefaultOptions({ duration: 800 })
    if (localStorage.getItem('username') && localStorage.getItem('psw')) {
      this.username = localStorage.getItem('username')
      this.password = localStorage.getItem('psw')
      this.onSubmit()
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  box-sizing: border-box;
  width: 100vw;
}
</style>
