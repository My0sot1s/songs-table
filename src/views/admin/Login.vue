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
    <van-loading v-if="login" size="40px" type="spinner" vertical
      >登录中...</van-loading
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      login: false
    }
  },
  methods: {
    onSubmit() {
      this.login = true
      this.$axios
        .post('/admin/login', {
          name: this.username,
          password: this.password
        })
        .then((res) => {
          console.log(res)
        })
        .finally(() => (this.login = false))
    }
  }
}
</script>

<style lang='less' scoped>
</style>
