<template>
  <div class="examine">
    <div class="image" @click="toListen">
      <van-image width="20vh" height="20vh" fit="fill" :src="applyInfo.cover">
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

    <div class="btn" v-if="applyInfo.showBtn">
      <div class="btn__reject" @click="showReject">驳回</div>
      <div class="btn__pass" @click="pass">通过</div>
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
import { getSongsDetail, passOrNot } from '@/request/api/admin'

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
  async mounted() {
    const musicInfo = JSON.parse(localStorage.getItem('musicInfo'))
    const [err, res] = await getSongsDetail(musicInfo.id)
    if (!err) {
      const resInfo = res[0]
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
    } else {
      Toast.fail(err)
    }
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
      const [err] = await passOrNot('/admin/noPass', {
        id: this.applyInfo.id,
        noPassReason: reason
      })
      if (!err) {
        this.$store.commit('noPassApply', this.applyInfo.id)
        Toast.clear()
        Toast.success('驳回成功')
        this.$router.replace('/admin/applyList')
      } else {
        Toast.fail(err)
      }
    },
    pass() {
      Dialog.confirm({
        title: '确认通过请求？'
      }).then(async () => {
        Toast.loading({
          message: '请求中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        })
        const [err] = await passOrNot('/admin/pass', { id: this.applyInfo.id })
        if (!err) {
          this.$store.commit('passApply', this.applyInfo.id)
          Toast.clear()
          Toast.success('通过成功')
          this.$router.replace('/admin/applyList')
        } else {
          Toast.fail(err)
        }
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

.btn {
  width: 60vw;
  height: 6.5vh;
  margin: 2.5vh auto;
  border-radius: 10px;
  background-color: #f8fafc;
  box-shadow: 0 0 10px #ccc;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .btn__reject {
    padding: 0 9vw;
  }

  .btn__pass {
    background-color: #fff;
    box-shadow: 0 0 10px #ccc;
    padding: 1.3vh 9vw;
    border-radius: 10px;
  }
}
</style>
