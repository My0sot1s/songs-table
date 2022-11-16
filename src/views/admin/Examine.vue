<template>
  <div class="examine">
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
    <div class="info" v-if="applyInfo.state === 2">
      <div>
        <div class="title">未通过原因</div>
        <div class="message">
          {{ applyInfo.noPassReason }}
        </div>
      </div>
    </div>

    <div class="btn1" v-if="applyInfo.showBtn">
      <div @click="showReject">驳回</div>
      <div @click="pass" class="btn2">通过</div>
    </div>

    <FieldDialog
      :show="showDialog"
      title="驳回原因"
      @submit="reject"
      @cancle="showDialog = false"
    />
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import FieldDialog from '@/components/FieldDialog.vue'
import { reject } from '@/api'

export default {
  data() {
    return {
      applyInfo: {},
      showDialog: false
    }
  },
  components: {
    FieldDialog
  },
  mounted() {
    const musicInfo = JSON.parse(localStorage.getItem('musicInfo'))
    this.$axios.get(`/admin/songDetails?id=${musicInfo.id}`).then((res) => {
      if (res.data.code === 200) {
        const resInfo = res.data.data[0]
        const campus = resInfo.school_district
        const from = resInfo.sender_name
        const phone = resInfo.phone_num
        const to = resInfo.receiver_name
        const message = resInfo.blessing_words
        const noPassReason = resInfo.no_pass_reason
        const state = resInfo.status
        this.applyInfo = {
          ...musicInfo,
          state,
          campus,
          from,
          phone,
          to,
          message,
          noPassReason
        }
      }
    })
  },
  methods: {
    showReject() {
      this.showDialog = true
    },
    async reject(reason) {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      try {
        const res = await reject(this.applyInfo.id, reason)
        if (res.data.code === 200 || res.data.code === 406) {
          this.$store.commit('noPassApply', this.applyInfo.id)
          Toast.clear()
          Toast.success('驳回成功')
          this.$router.replace('/admin/applyList')
        } else {
          Toast.fail(res.data.msg)
        }
      } catch (err) {
        Toast.fail(err.message)
      }
    },
    pass() {
      Dialog.confirm({
        title: '确认通过请求？'
      }).then(() => {
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
            if (res.data.code === 200 || res.data.code === 406) {
              this.$store.commit('passApply', this.applyInfo.id)
              Toast.clear()
              this.$router.replace('/admin/applyList')
            } else {
              Toast.fail(res.data.msg)
            }
          })
      })
    },
    toListen() {
      location.href = this.applyInfo.listenUrl
    }
  }
}
</script>

<style lang="less" scoped>
.examine {
  overflow: scroll;
  height: calc(100vh - 94.9px);

  @supports (bottom: env(safe-area-inset-bottom)) {
    & {
      height: calc(100vh - 94.9px - constant(safe-area-inset-bottom));
      height: calc(100vh - 94.9px - env(safe-area-inset-bottom));
    }
  }
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
  padding: 1.5vh 3vw;
  border-radius: 10px;
  box-shadow: 0 0 10px #ddd;
  color: #555;
  font-size: 2vh;
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
