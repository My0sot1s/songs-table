<template>
  <div>
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

export default {
  data() {
    return {
      username: '',
      password: '',
      login: false
    }
  },
  mounted() {
    Toast.setDefaultOptions({ duration: 800 })
  },
  methods: {
    onSubmit() {
      Toast.loading({
        message: '登录中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      this.$axios
        .post('/admin/login', {
          name: this.username,
          password: this.password
        })
        .then((res) => {
          console.log(res)
          if (res.data.code === 200) {
            localStorage.setItem('admin_token', res.data.data.token)
            Toast.clear()
            this.$router.replace('/admin/home')
          } else {
            Toast.fail(res.data.msg)
          }
        })
        .catch(() => {
          Toast.fail('请求异常')
        })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
