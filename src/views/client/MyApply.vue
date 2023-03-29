<template>
  <div>
    <div class="my-apply">
      <NavBar />
      <ApplyInfo
        v-for="(item, index) in curList"
        :key="item.id"
        :cover="item.cover"
        :songName="item.songName"
        :singer="item.singer"
        :time="item.time"
        :state="item.state + ''"
        iconName="delete-o"
        @click.native="curIndex = curIndex === index ? -1 : index"
        @action="delApply($event, index)"
      >
        <template #footer>
          <!-- 当前点击且未结束时显示 -->
          <div class="footer" v-show="curIndex === index && item.state !== 0">
            <div :class="{ 'flex-end': item.state === -1 || item.state === 2 }">
              <!-- 状态不是已撤回或者未通过时显示 -->
              <div
                v-if="!(item.state === -1 || item.state === 2)"
                @click.stop="withdraw(index)"
              >
                <van-icon color="#555" name="revoke" /><span>申请撤回</span>
              </div>
              <!-- 状态是已撤回或者未通过时显示重新提交,其它显示查看详情 -->
              <div @click.stop="toForms(item.state, index)">
                <van-icon color="#555" name="guide-o" /><span>{{
                  item.state === -1 || item.state === 2
                    ? '查看详情'
                    : '查看详情'
                }}</span>
              </div>
            </div>
          </div>
        </template>
      </ApplyInfo>
    </div>

    <van-dropdown-menu v-show="applyList.length !== 0" active-color="#1989fa">
      <van-dropdown-item v-model="menu.state" :options="menu.states" />
    </van-dropdown-menu>

    <div ref="lottie" v-if="curList.length === 0"></div>
    <TouristNotice :tourist="tourist" />
  </div>
</template>

<script>
import TouristNotice from '@/components/TouristNotice.vue'
import ApplyInfo from '@/components/ApplyInfo.vue'
import { Dialog, Toast } from 'vant'
import lottie from 'lottie-web'
import empty from '@/assets/empty.json'
import { getList } from '@/request/api/common'
import { deleteApply, withdrawApply, getDetails } from '@/request/api/user'

export default {
  components: {
    ApplyInfo,
    TouristNotice
  },
  data() {
    return {
      applyList0: [],
      curList: [],
      curIndex: 0 /* 当前显示footer的index */,
      menu: {
        state: -2,
        states: [
          { text: '全部状态', value: -2 },
          { text: '已撤回', value: -1 },
          { text: '已结束', value: 0 },
          { text: '待审核', value: 1 },
          { text: '未通过', value: 2 },
          { text: '待播放', value: 3 }
        ]
      },
      tourist: false
    }
  },
  watch: {
    'menu.state': {
      handler: function (val) {
        this.curList = this.applyList
          .filter((item) => val === -2 || item.state === val)
          .sort((a, b) => (a.time > b.time ? 1 : -1))
      },
      immediate: true
    },
    applyList: {
      handler: function (val) {
        this.curList = val
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    applyList() {
      return [...this.applyList0].sort((a, b) => (a.time > b.time ? 1 : -1))
    }
  },
  mounted() {
    if (sessionStorage.getItem('tourist')) {
      this.tourist = true
    }
    // 获取列表
    getList('/user/myApplication', this.applyList0)
    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottie,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: empty
    })
  },
  destroyed() {
    if (!this.lottieInstance) return
    this.lottieInstance.destroy()
    this.lottieInstance = null
  },
  methods: {
    /* 点击删除图标时 */
    delApply(state, index) {
      this.curIndex = index
      Toast.clear()
      if (state === -1 || state === 0 || state === 2) {
        Dialog.confirm({
          title: '删除后不可找回，确定删除？'
        }).then(async () => {
          const [err] = await deleteApply(this.curList[index].id)
          if (!err) {
            this.curList.splice(index, 1)
            this.curIndex = -1
            Toast.success('删除成功!')
          } else {
            Toast.fail(err)
          }
        })
      } else {
        Dialog.alert({
          message: '请先撤回请求'
        })
      }
    },
    /* 点击撤回请求时 */
    withdraw(index) {
      Dialog.confirm({
        title: '确认撤回请求？'
      }).then(async () => {
        const [err] = await withdrawApply(this.curList[index].id)
        if (!err) {
          this.curList[index].state = -1
          Toast.success('撤回成功')
        } else {
          Toast.fail(err)
        }
      })
    },
    /* 点击查看详情或重新提交时 */
    async toForms(state, index) {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      const disabled = !(state === -1 || state === 2)
      const [err, res] = await getDetails(this.curList[index].id)
      if (!err) {
        const data = res[0]
        localStorage.setItem(
          'applyInfo',
          JSON.stringify({
            id: this.curList[index].id,
            songName: data.song_name,
            songId: data.song_id,
            searchPath: data.search_path,
            receiverName: data.receiver_name,
            senderName: data.sender_name,
            phoneNum: data.phone_num,
            schoolDistrict: data.school_district,
            broadcastDate: new Date(data.broadcast_date).getTime(),
            blessingWords: data.blessing_words,
            placeHolder:
              this.curList[index].songName + '-' + this.curList[index].singer,
            disabled,
            reason: data.no_pass_reason,
            btn: (data.no_pass_reason ?? '') !== '' ? '重新提交' : '提交'
          })
        )
        Toast.clear()
        this.$router.push('/selectMusic')
      } else {
        Toast.fail(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-apply {
  @supports (bottom: env(safe-area-inset-bottom)) {
    & {
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
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

::v-deep .van-dropdown-menu {
  position: fixed;
  right: 5vw;
  top: 0;
  z-index: 9999;
  height: 45px;
  background-color: transparent;
  box-shadow: none;
}
</style>
