<template>
  <div>
    <div v-if="applyList.length !== 0">
      <ApplyInfo
        v-for="(item, index) in applyList"
        :key="index"
        :imgUrl="item.imgUrl"
        :songName="item.songName"
        :singer="item.singer"
        :time="item.time"
        :state="item.state"
        iconName="delete-o"
        @click.native="curIndex = curIndex === index ? -1 : index"
        @action="delApply"
      >
        <template #footer>
          <div
            class="footer"
            v-show="curIndex === index && item.state !== '已结束'"
          >
            <div
              :class="{ 'flex-end': item.state == '已撤回' }"
              v-if="item.state !== '已结束'"
            >
              <!-- 撤回请求 -->
              <div v-if="item.state !== '已撤回'" @click.stop="withdraw">
                <van-icon color="#555" name="revoke" /><span>申请撤回</span>
              </div>
              <!-- 产看详情或重新提交 -->
              <div @click.stop="toForms(item.state)">
                <van-icon color="#555" name="guide-o" /><span>{{
                  item.state == '已撤回' ? '重新提交' : '查看详情'
                }}</span>
              </div>
            </div>
          </div>
        </template>
      </ApplyInfo>
    </div>
    <div ref="lottie" class="myApply" v-else></div>
  </div>
</template>

<script>
import ApplyInfo from '@/components/ApplyInfo.vue'
import { Dialog } from 'vant'
import lottie from 'lottie-web'
import empty from '@/assets/empty.json'

export default {
  data() {
    return {
      applyList: [] /* 请求列表 */,
      curIndex: 0 /* 当前显示footer的index */
    }
  },
  components: {
    ApplyInfo
  },
  mounted() {
    this.$axios.get('/user/myApplication').then((res) => {
      res.data.data.forEach((item) => {
        const temp = {}
        temp.id = item.ID
        temp.time = item.CreatedAt.split('T')[0]
        temp.state = item.status + ''
        this.$musicApi.NetEaseCloudDetail(item.song_id).then((detail) => {
          if (!detail.data.songs || detail.data.songs.length === 0) return
          temp.imgUrl = detail.data.songs[0].al.picUrl
          temp.songName = detail.data.songs[0].name
          temp.singer = detail.data.songs[0].ar[0].name
          for (let i = 1; i < detail.data.songs[0].ar.length; i++) {
            temp.singer += ' ' + detail.data.songs[0].ar[i].name
          }
          this.applyList.push(temp)
        })
      })
    })

    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: empty
    })
  },
  methods: {
    /* 点击删除图标时 */
    delApply(state) {
      if (state === '已结束' || state === '已撤回') {
        Dialog.confirm({
          title: '删除后不可找回，确定删除？'
        })
          .then(() => {
            this.$axios
              .post('/user/delete', {
                id: this.applyList[this.curIndex].id
              })
              .then((res) => {
                console.log(res)
              })
          })
          .catch(() => {
            // on cancel
          })
      } else {
        Dialog.alert({
          message: '请先撤回请求'
        })
      }
    },
    /* 点击撤回请求时 */
    withdraw() {
      Dialog.confirm({
        title: '确认撤回请求？'
      })
        .then(() => {
          this.$axios
            .post('/user/recall', {
              id: this.applyList[this.curIndex].id
            })
            .then((res) => {})
        })
        .catch(() => {
          // on cancel
        })
    },
    /* 点击查看详情或重新提交时 */
    toForms(state) {
      if (state === '已撤回') {
        console.log('重新提交')
      } else {
        console.log('查看详情')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.myApply {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fefefe;
}

.footer {
  border-top: 1px solid #ccc;

  & > div {
    padding: 2vh;
    display: flex;
    justify-content: space-between;
  }

  span {
    margin-left: 2vw;
    font-size: 2vh;
    color: #555;
  }

  .flex-end {
    justify-content: flex-end;
  }
}
</style>
