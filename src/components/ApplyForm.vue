<template>
  <van-form @submit="onSubmit">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="notice"
      color="black"
      background="inherit"
    ></van-notice-bar>
    <van-divider />
    <van-search
      class="search"
      readonly
      @click="popUp(0)"
      action-textdisabled
      :placeholder="placeHolders[0]"
    />
    <van-search
      class="search"
      readonly
      @click="popUp(1)"
      action-textdisabled
      :placeholder="placeHolders[1]"
    />
    <van-field
      maxlength="12"
      v-model="form.to"
      name="To"
      label="To"
      placeholder="你希望将这首歌送给谁"
      :rules="[{ required: true, message: '' }]"
    />
    <van-field
      maxlength="12"
      v-model="form.username"
      name="姓名"
      label="姓名"
      placeholder="请输入你的姓名"
      :rules="[{ required: true, message: '' }]"
    />
    <van-field
      v-model="form.tel"
      placeholder="请输入你的手机号"
      type="tel"
      label="手机号"
      :rules="[
        { required: true, message: '请填写手机号' },
        {
          pattern:
            /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/,
          message: '请填写正确的手机号'
        }
      ]"
    />
    <van-field
      v-model="form.campus"
      is-link
      readonly
      label="校区"
      placeholder="请选择你所在的校区"
      @click="showCampus = true"
      :rules="[{ required: true, message: '' }]"
    />
    <van-popup v-model="showCampus" round position="bottom">
      <van-cascader
        active-color="#1989fa"
        v-model="form.campus"
        title="请选择所在校区"
        :options="options"
        @close="showCampus = false"
        @finish="showCampus = false"
      />
    </van-popup>
    <van-field
      readonly
      clickable
      name="calendar"
      :value="form.date"
      label="送出日期"
      placeholder="点击选择日期"
      @click="showCalendar = true"
      :rules="[{ required: true, message: '' }]"
    />
    <van-calendar
      :show-confirm="false"
      color="#1989fa"
      v-model="showCalendar"
      @confirm="onConfirm"
    />
    <van-field
      v-model="form.message"
      rows="2"
      autosize
      label="寄语"
      type="textarea"
      maxlength="200"
      placeholder=""
      show-word-limit
      :rules="[{ required: true, message: '请输入寄语' }]"
    />
    <div style="margin: 16px">
      <van-button type="default" round block native-type="submit"
        >提交</van-button
      >
    </div>
  </van-form>
</template>

<script>
import { Notify } from 'vant'
export default {
  props: ['musics'],
  data() {
    return {
      form: {
        songs: this.musics,
        to: '',
        username: '',
        tel: '',
        campus: '',
        date: '',
        message: ''
      },
      placeHolders: [],
      notice:
        '欢迎来到华侨大学点歌台！如果你有想听的歌，或者想要送出的祝福，请认真填写下面的表格，我们会在每天晚上的6：40 - 7：00将歌曲送出。要记得留下电话号码我们才能够在有需要的时候联系你们哦。',
      showCampus: false,
      fieldValue: '',
      cascaderValue: '',
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [
        {
          text: '厦门校区',
          value: '厦门校区'
        },
        {
          text: '泉州校区',
          value: '泉州校区'
        },
        {
          text: '龙舟池校区',
          value: '龙舟池校区'
        }
      ],
      showCalendar: false
    }
  },
  watch: {
    'form.songs': {
      handler() {
        const arr = ['请选择歌曲', '请选择备选歌曲']
        const a = ['首选：', '备选：']
        if (this.form.songs.length > 0) {
          for (let i = 0; i < 2; i++) {
            if (this.form.songs[i]) {
              arr[i] =
                a[i] +
                this.form.songs[i].name +
                ' - ' +
                this.form.songs[i].singer[0].name
            }
          }
        }
        this.placeHolders = arr
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    onSubmit() {
      console.log(this.form)
      const notices = ['请选择首选歌曲', '请选择备选歌曲']
      if (this.form.songs.length === 0) {
        Notify('请选择歌曲')
        return
      }
      for (let i = 0; i < 2; i++) {
        if (!this.form.songs[i]) {
          Notify(notices[i])
          return
        }
      }
    },
    onConfirm(date) {
      this.showCalendar = false
      this.form.date = this.formatDate(date)
    },
    popUp(index) {
      this.$emit('popUp', index)
    }
  }
}
</script>

<style>
.van-button {
  box-shadow: 0 0 5px #999;
}
.van-search {
  color: black !important;
}
.van-notice-bar {
  position: fixed;
}
</style>
