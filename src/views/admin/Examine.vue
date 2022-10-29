<template>
  <div>
    <div class="image" @click="toListen">
      <van-image width="20vh" height="20vh" fit="fill" :src="applyInfo.imgUrl">
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
        <template #error>加载失败</template>
      </van-image>
    </div>
    <div class="broadcast-info">
      <div>{{ applyInfo.time }}</div>
      <div style="font-weight: bold">·</div>
      <div>{{ applyInfo.campus }}</div>
    </div>
    <div class="song-info info">
      <div>
        <div class="song-name van-ellipsis">{{ applyInfo.songName }}</div>
        <div class="singer van-ellipsis">{{ applyInfo.singer }}</div>
      </div>
    </div>
    <div class="user-info info">
      <div>
        <div class="from">
          <div class="from-name">
            <van-icon name="user-o" /><span>{{ applyInfo.from }}</span>
          </div>
          <div class="from-phone" v-if="applyInfo.phone">
            <van-icon name="phone-o" /><span>{{ applyInfo.phone }}</span>
          </div>
        </div>
        <div class="to">
          <van-icon name="guide-o" /><span>{{ applyInfo.to }}</span>
        </div>
      </div>
    </div>
    <div class="info" v-if="applyInfo.message">
      <div>
        <div class="title">给TA的话</div>
        <div class="message">
          {{ applyInfo.message }}
        </div>
      </div>
    </div>

    <div class="btn1" v-if="applyInfo.showBtn">
      <div @click="showReject">驳回</div>
      <div @click="pass" class="btn2">通过</div>
    </div>

    <van-dialog
      @confirm="reject"
      v-model="rejectDialog"
      title="驳回理由"
      show-cancel-button
    >
      <van-field
        v-model="reason"
        rows="3"
        autosize
        type="textarea"
        placeholder="请输入驳回理由"
      />
    </van-dialog>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { reject } from '@/api'

export default {
  data() {
    return {
      applyInfo: {},
      rejectDialog: false,
      reason: ''
    }
  },
  mounted() {
    const musicInfo = JSON.parse(localStorage.getItem('musicInfo'))
    console.log(musicInfo)
    this.$axios.get(`/admin/songDetails?id=${musicInfo.id}`).then((res) => {
      if (res.data.code === 200) {
        const resInfo = res.data.data[0]
        const campus = resInfo.school_district
        const from = resInfo.sender_name
        const phone = resInfo.phone_num
        const to = resInfo.receiver_name
        const message = resInfo.blessing_words
        this.applyInfo = {
          ...musicInfo,
          campus,
          from,
          phone,
          to,
          message
        }
      }
    })
  },
  methods: {
    showReject() {
      this.rejectDialog = true
    },
    async reject() {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      try {
        const res = await reject(this.id, this.reason)
        if (res.data.code === 200) {
          this.$store.commit('noPassApply', this.applyInfo.id)
          Toast.clear()
          this.$router.replace('/admin/applyList')
        } else {
          Toast.fail(res.data.msg)
        }
      } catch (err) {
        Toast.fail(err.message)
      }
      /* this.$axios
        .post('/admin/noPass', {
          id: this.applyInfo.id
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$store.commit('noPassApply', this.applyInfo.id)
            Toast.clear()
            this.$router.replace('/admin/applyList')
          } else {
            Toast.fail(res.data.msg)
          }
        })
        .catch(() => {
          Toast.fail('请求异常')
        }) */
    },
    pass() {
      Dialog.confirm({
        title: '确认通过请求？'
      })
        .then(() => {
          Toast.loading({
            message: '请求中...',
            forbidClick: true,
            loadingType: 'spinner',
            duration: 0
          })
          this.$axios
            .post('/admin/pass', {
              id: this.applyInfo.id
            })
            .then((res) => {
              if (res.data.code === 200) {
                this.$store.commit('passApply', this.applyInfo.id)
                Toast.clear()
                this.$router.replace('/admin/applyList')
              } else {
                Toast.fail(res.data.msg)
              }
            })
            .catch(() => {
              Toast.fail('请求异常')
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    toListen() {
      console.log(this.applyInfo.listenUrl)
      location.href = this.applyInfo.listenUrl
    }
  }
}
</script>

<style lang="less" scoped>
.examine {
  overflow: auto;
}

.image {
  width: 20vh;
  height: 20vh;
  border-radius: 5px;
  margin: 3vh auto;
  box-shadow: 0 0 5px #999;
  overflow: hidden;
}

.broadcast-info {
  padding: 0 20vw 0 20vw;
  display: flex;
  justify-content: space-around;
  font-size: 2vh;
  align-items: center;
}

.info {
  display: flex;
  justify-content: center;
  border-top: 1px solid #ccc;
  padding-top: 1vh;
  margin-top: 1vh;

  & > div {
    width: 80vw;
    padding: 1vh 0 1vh 0;
  }

  span {
    margin-left: 3vw;
  }
}

.song-name {
  font-size: 2.8vh;
  margin-bottom: 1.5vh;
}

.singer {
  font-size: 2vh;
  color: #333;
}

.from {
  display: flex;
  align-items: center;
  font-size: 2.5vh;
  margin-bottom: 1.5vh;

  &-name {
    margin-right: 10vw;
  }
}

.to {
  font-size: 2.5vh;
}

.title {
  font-size: 2.5vh;
  margin-bottom: 1.5vh;
}

.message {
  // background-color: rgba(200, 210, 210, 0.3);
  background-color: #f8fafc;
  padding: 2vh;
  border-radius: 10px;
  box-shadow: 0 0 10px #ccc;
}

.btn1 {
  width: 62vw;
  margin: 3vh auto;
  height: 6vh;
  border-radius: 10px;
  background-color: #f8fafc;
  box-shadow: 0 0 10px #ccc;
  display: flex;
  padding: 0.5vh 0 0.5vh 8vw;
  justify-content: space-around;
  align-items: center;

  .btn2 {
    background-color: #fff;
    box-shadow: 0 0 10px #ccc;
    width: 30vw;
    height: 5vh;
    display: flex;
    align-items: center;
    border-radius: 10px;
    justify-content: center;
  }
}
</style>
