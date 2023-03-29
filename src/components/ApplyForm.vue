<template>
  <van-form @submit="onSubmit" :disabled="form.disabled">
    <van-notice-bar
      v-show="!form.disabled && this.notice"
      color="#1989fa"
      background="#ecf9ff"
      left-icon="volume-o"
      :style="`margin: 2vw 0`"
      scrollable
      :text="notice"
    >
    </van-notice-bar>
    <van-notice-bar
      v-show="!(form.reason ?? '') !== '' && !form.disabled"
      wrapable
      :scrollable="false"
      :text="noticeDetail"
      :style="`text-indent: 6vw`"
      color="black"
      background="inherit"
    ></van-notice-bar>
    <van-notice-bar
      v-show="form.reason ?? '' !== ''"
      color="#ee0a24"
      wrapable
      :scrollable="false"
      :text="'驳回理由：' + form.reason"
    />
    <van-divider />
    <van-search
      shape="round"
      class="search"
      readonly
      @click="!form.disabled && popUp(0)"
      action-textdisabled
      :placeholder="placeHolders[0]"
    />
    <van-search
      shape="round"
      class="search"
      readonly
      @click="!form.disabled && popUp(1)"
      action-textdisabled
      :placeholder="placeHolders[1]"
      v-if="false"
    />
    <van-field
      maxlength="12"
      v-model="form.receiverName"
      label="To"
      placeholder="你希望将这首歌送给谁"
      :rules="[{ required: true, message: '' }]"
    />
    <van-field
      maxlength="12"
      v-model="form.senderName"
      label="姓名"
      placeholder="请输入你的姓名"
      :rules="[{ required: true, message: '' }]"
    />
    <!-- <van-field
      v-model="form.phoneNum"
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
    /> -->
    <van-field
      v-model="form.schoolDistrict"
      is-link
      readonly
      label="校区"
      placeholder="请选择你所在的校区"
      :rules="[{ required: true, message: '' }]"
      @click="showSchoolDistrict = true"
    />
    <van-popup v-model="showSchoolDistrict" round position="bottom">
      <van-cascader
        active-color="#1989fa"
        v-model="form.schoolDistrict"
        title="请选择所在校区"
        :options="options"
        @close="showSchoolDistrict = false"
        @finish="showSchoolDistrict = false"
      />
    </van-popup>
    <van-field
      readonly
      clickable
      :value="showingDate"
      label="送出日期"
      placeholder="点击选择日期"
      @click="!form.disabled && (showCalendar = true)"
      :rules="[{ required: true, message: '' }]"
    />
    <van-calendar
      :show-confirm="false"
      color="#1989fa"
      v-model="showCalendar"
      @confirm="onConfirm"
    />
    <van-field
      v-model="form.blessingWords"
      rows="2"
      autosize
      label="寄语"
      type="textarea"
      maxlength="200"
      placeholder=""
      show-word-limit
      :rules="[{ required: true, message: '请输入寄语' }]"
    />
    <div style="margin: 16px" v-if="!form.disabled">
      <van-button type="info" round block native-type="submit">{{
        form.btn || '提交'
      }}</van-button>
    </div>
    <TouristNotice />
  </van-form>
</template>

<script>
import { submitRequest, updateRequest } from '@/request/api/user'
import { Toast } from 'vant'
import TouristNotice from './TouristNotice.vue'
export default {
  props: ['musics'],
  components: {
    TouristNotice
  },
  data() {
    return {
      form: {
        songId: '',
        searchPath: '',
        receiverName: '',
        senderName: '',
        /* phoneNum: '', */
        schoolDistrict: '厦门校区',
        broadcastDate: '',
        blessingWords: '',
        disabled: false,
        songName: ''
      },
      plusText: '',
      broadcastTime: '',
      showingDate: '',
      placeHolders: [],
      notice: '欢迎来到华侨大学点歌台！',
      showSchoolDistrict: false,
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
        }
      ],
      showCalendar: false,
      tourist: false
    }
  },
  computed: {
    noticeDetail() {
      return `欢迎来到华侨大学点歌台！如果你有想听的歌，或者想要送出的祝福，请认真填写下面的表格，我们会在每天晚上的 ${this.broadcastTime} 将歌曲送出。${this.plusText}`
    }
  },
  watch: {
    musics: {
      handler() {
        this.form.songName = this.musics[0]?.name
        this.form.songId = this.musics[0]?.songmid.toString()
        this.form.searchPath = this.musics[0]?.searchPath
        const arr = ['请选择歌曲', '请选择备选歌曲']
        /* const a = ['首选：', '备选：'] */
        if (this.musics.length > 0) {
          for (let i = 0; i < 2; i++) {
            if (this.musics[i]) {
              arr[i] =
                /* a[i] + */
                this.musics[i].name + ' - ' + this.musics[i].singers
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
    checkNotice() {
      if (
        localStorage.getItem('campus') === '厦门校区' &&
        localStorage.getItem('XMSongNotice')
      ) {
        this.notice = localStorage.getItem('XMSongNotice')
      } else if (
        localStorage.getItem('campus') === '泉州校区' &&
        localStorage.getItem('QZSongNotice')
      ) {
        this.notice = localStorage.getItem('QZSongNotice')
      }
    },
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    async onSubmit() {
      if (sessionStorage.getItem('tourist')) {
        this.tourist = true
        return
      }
      Toast.loading({
        forbidClick: true
      })
      if (localStorage.limitDay === 'true') {
        Toast.fail('今天不可以点歌哦')
        return
      }
      // console.log(this.form)
      /* const notices = ['请选择首选歌曲', '请选择备选歌曲'] */
      if (!this.form.songId && !this.form.searchPath) {
        Toast.fail('请选择歌曲')
        return
      }
      const [err] = this.form.id
        ? await updateRequest(this.form)
        : await submitRequest(this.form)
      if (!err) {
        Toast.success('提交成功！')
        this.$router.replace('/myApply')
      } else {
        Toast.fail(err)
      }
    },
    onConfirm(date) {
      this.showCalendar = false
      this.form.broadcastDate = date.getTime()
      this.showingDate = this.formatDate(date)
    },
    popUp(index) {
      this.$emit('popUp', index)
    }
  },
  mounted() {
    if (localStorage.getItem('campus') === '厦门校区') {
      this.broadcastTime = ' 6:20 - 6:40 '
    } else {
      this.broadcastTime = ' 6:40 - 7:10 '
      this.plusText = '未放完歌曲将在次日其余时间播放。'
    }
    if (localStorage.limitDay === 'true') {
      Toast.fail('今天不可以点歌哦')
    }
    this.checkNotice()
    this.form.schoolDistrict = localStorage.getItem('campus') || undefined
    const applyInfo = JSON.parse(localStorage.getItem('applyInfo'))
    if (applyInfo) {
      const { placeHolder, ...form } = applyInfo
      this.placeHolders.splice(0, 1, placeHolder)
      this.form = form
      this.showingDate = this.formatDate(new Date(applyInfo.broadcastDate))
    }
  },
  destroyed() {
    localStorage.removeItem('applyInfo')
  }
}
</script>

<style scoped>
.van-search__content {
  background-color: rgb(250, 251, 253) !important;
}

.notice-swipe {
  height: 40px;
  line-height: 40px;
}
.van-button {
  margin-top: 8vw;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.07);
}
</style>
