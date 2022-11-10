<template>
  <van-form @submit="onSubmit" :disabled="form.disabled">
    <van-notice-bar v-show="!form.disabled" color="#1989fa" background="#ecf9ff" left-icon="volume-o"
      :style="`margin: 2vw 0`" :scrollable="false">
      <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item>周五为英语点歌台，点歌请用英文噢~</van-swipe-item>
        <van-swipe-item>周日为粤语点歌台，我们将用粤语送出你的祝福~</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
    <van-notice-bar v-show="!(form.reason ?? '') !== '' && !form.disabled" wrapable :scrollable="false" :text="notice"
      :style="`text-indent: 6vw`" color="black" background="inherit"></van-notice-bar>
    <van-notice-bar v-show="form.reason ?? '' !== ''" color="#ee0a24" wrapable :scrollable="false"
      :text="'驳回理由：' + form.reason" />
    <van-divider />
    <van-search shape="round" class="search" readonly @click="!form.disabled && popUp(0)" action-textdisabled
      :placeholder="placeHolders[0]" />
    <van-search shape="round" class="search" readonly @click="!form.disabled && popUp(1)" action-textdisabled
      :placeholder="placeHolders[1]" v-if="false" />
    <van-field maxlength="12" v-model="form.receiverName" label="To" placeholder="你希望将这首歌送给谁"
      :rules="[{ required: true, message: '' }]" />
    <van-field maxlength="12" v-model="form.senderName" label="姓名" placeholder="请输入你的姓名"
      :rules="[{ required: true, message: '' }]" />
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
    <van-field v-model="form.schoolDistrict" is-link readonly label="校区" placeholder="请选择你所在的校区"
      :rules="[{ required: true, message: '' }]" @click="onlyAmoy" />
    <van-popup v-model="showschoolDistrict" round position="bottom">
      <van-cascader active-color="#1989fa" v-model="form.schoolDistrict" title="请选择所在校区" :options="options"
        @close="showschoolDistrict = false" @finish="showschoolDistrict = false" />
    </van-popup>
    <van-field readonly clickable :value="showingDate" label="送出日期" placeholder="点击选择日期"
      @click="!form.disabled && (showCalendar = true)" :rules="[{ required: true, message: '' }]" />
    <van-calendar :show-confirm="false" color="#1989fa" v-model="showCalendar" @confirm="onConfirm" />
    <van-field v-model="form.blessingWords" rows="2" autosize label="寄语" type="textarea" maxlength="200" placeholder=""
      show-word-limit :rules="[{ required: true, message: '请输入寄语' }]" />
    <div style="margin: 16px" v-if="!form.disabled">
      <van-button type="info" round block native-type="submit">{{
          form.btn || '提交'
      }}</van-button>
    </div>
  </van-form>
</template>

<script>
import { submitRequest, updateRequest } from '@/api.js'
import { Toast, Dialog } from 'vant'
export default {
  props: ['musics'],
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
      showingDate: '',
      placeHolders: [],
      notice:
        '欢迎来到华侨大学点歌台！如果你有想听的歌，或者想要送出的祝福，请认真填写下面的表格，我们会在每天晚上的6：20 - 6：40将歌曲送出。',
      showschoolDistrict: false,
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
                this.musics[i].name + ' - ' + this.musics[i].singer[0].name
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
    async onSubmit() {
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
      try {
        let res
        if (this.form.id) {
          res = await updateRequest(this.form)
        } else {
          res = await submitRequest(this.form)
        }
        // // console.log(res)
        if (res.data.code === 200) {
          Toast.success('提交成功！')
          this.$router.replace('/myApply')
        } else {
          Toast.fail(res.data.msg)
        }
      } catch (err) {
        // console.log(err.message)
        Toast.fail(err.message)
      }
      /* for (let i = 0; i < 2; i++) {
        if (!this.musics[i]) {
          Toast.fail(notices[i])
          return
        }
      } */
    },
    onConfirm(date) {
      this.showCalendar = false
      this.form.broadcastDate = date.getTime()
      this.showingDate = this.formatDate(date)
    },
    popUp(index) {
      this.$emit('popUp', index)
    },
    onlyAmoy() {
      Dialog.alert({
        message: '目前只支持厦门校区点歌哦',
        confirmButtonColor: '#1989fa'
      })
    }
  },
  mounted() {
    if (localStorage.limitDay === 'true') {
      Toast.fail('今天不可以点歌哦')
    }
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

<style>
.van-search__content {
  background-color: rgb(250, 251, 253) !important;
}

.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
