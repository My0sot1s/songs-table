<template>
  <van-popup round id="popup" v-model="show">
    <div id="title">{{ title }}</div>
    <van-form @submit="onSubmitNotice">
      <van-field
        autofocus
        v-model="notice"
        rows="2"
        autosize
        type="textarea"
        maxlength="100"
        placeholder="请输入内容"
        show-word-limit
      /><van-button round block type="info" native-type="submit"
        >发布</van-button
      >
    </van-form>
    <div class="delete" @click="deleteNotice">删除当前</div></van-popup
  >
</template>

<script>
import { Toast } from 'vant'
export default {
  props: ['title', 'getApi', 'publishApi', 'showPublish'],
  data() {
    return {
      show: this.showPublish,
      notice: ''
    }
  },
  watch: {
    showPublish(newVal) {
      this.show = newVal
    },
    show(newVal) {
      this.$emit('update:showPublish', newVal)
    }
  },
  methods: {
    async onSubmitNotice() {
      if (!this.notice) {
        Toast.fail('请输入公告内容！')
        return
      }
      const [err] = await this.publishApi(this.notice)
      if (!err) {
        Toast.success('发布成功！')
      } else {
        Toast.fail(err)
      }
    },
    async deleteNotice() {
      const [err] = await this.publishApi('')
      if (!err) {
        Toast.success('删除公告成功！')
      } else {
        Toast.fail(err)
      }
    }
  },
  async mounted() {
    const [err, res] = await this.getApi()
    if (!err) {
      if (res) {
        this.notice = res.notice
      }
    } else {
      Toast.fail(err)
    }
  }
}
</script>

<style lang="less">
#popup {
  padding: 5vw;
  width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    padding: 5vw 0;
  }
  .van-form {
    width: 80vw;
    .van-field {
      margin: 5vw 0;
      border-radius: 2vw;
    }
  }
  .delete {
    padding: 3vw 0 1vw 0;
    font-size: 75%;
    color: rgb(238, 10, 36);
    text-decoration: underline;
  }
}
</style>
