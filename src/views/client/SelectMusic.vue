<template>
  <div id="ChooseMusic">
    <van-overlay :show="showPick" @click="show = false">
      <SelectMusicList />
    </van-overlay>
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
        disabled
        action-textdisabled
        v-model="form.song1"
        placeholder="请选择歌曲"
      />
      <van-search
        disabled
        action-textdisabled
        v-model="form.song2"
        placeholder="请选择备选歌曲"
      />
      <van-field
        v-model="form.to"
        name="To"
        label="To"
        placeholder="你希望将这首歌送给谁"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="form.username"
        name="姓名"
        label="姓名"
        placeholder="请输入你的姓名"
        :rules="[{ required: true, message: '姓名不得超过六个字' }]"
      />
      <van-field
        v-model="form.tel"
        placeholder="请输入你的手机号"
        type="tel"
        label="手机号"
      />
      <van-field
        v-model="form.campus"
        is-link
        readonly
        label="校区"
        placeholder="请选择你所在的校区"
        @click="showCampus = true"
      />
      <van-popup v-model="showCampus" round position="bottom">
        <van-cascader
          v-model="form.campus"
          title="请选择所在校区"
          :options="options"
          @close="showCampus = false"
          @finish="showCampus = false"
        />
      </van-popup>
      <van-cell
        title="请选择送出日期"
        :value="form.date"
        @click="showCalendar = true"
        ><van-icon v-if="this.form.date.length === 0" name="calendar-o"
      /></van-cell>
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
        maxlength="50"
        placeholder=""
        show-word-limit
      />
      <div style="margin: 16px">
        <van-button type="default" round block native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import SelectMusicList from '@/components/SelectMusicList'
export default {
  components: {
    SelectMusicList
  },
  data() {
    return {
      form: {
        song1: '',
        song2: '',
        to: '',
        username: '',
        tel: '',
        campus: '',
        date: '',
        message: ''
      },
      showPick: false,
      notice:
        '欢迎来到华侨大学点歌台！如果你有想听的歌，或者想要送出的祝福，请认真填写下面的表格，我们会在每天晚上的6：40-7：00将歌曲送出。要记得留下电话号码我们才能够在有需要的时候联系你们哦。',
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
  mounted() {
    this.$store.commit('changeNavText', '点歌')
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    onSubmit() {
      console.log(this.form)
    },
    onConfirm(date) {
      this.showCalendar = false
      this.form.date = this.formatDate(date)
    }
  }
}
</script>

<style lang="less">
body {
  background-color: rgb(250, 251, 253);
}
.van-overlay {
  /* background-color: inherit !important; */
  overflow: scroll;
  z-index: 1;
  padding: 0 !important;
}
.van-form {
  background-color: white;
  .van-notice-bar {
    text-indent: 6vw;
  }
}
</style>
