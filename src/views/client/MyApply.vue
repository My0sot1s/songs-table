<template>
  <div>
    <van-sticky offset-top="6vh">
      <van-dropdown-menu active-color="#1989fa">
        <van-dropdown-item v-model="menu.state" :options="menu.states" />
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <ApplyInfo
        v-for="(item, index) in curList"
        :key="item.id"
        :imgUrl="item.imgUrl"
        :songName="item.songName"
        :singer="item.singer"
        :time="item.time"
        :state="item.state"
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
              <div @click.stop="toForms(item.state)">
                <van-icon color="#555" name="guide-o" /><span>{{
                  item.state === -1 || item.state === 2
                    ? '重新提交'
                    : '查看详情'
                }}</span>
              </div>
            </div>
          </div>
        </template>
      </ApplyInfo>
    </div>
    <div ref="lottie" v-show="curList.length === 0"></div>
  </div>
</template>

<script>
import ApplyInfo from '@/components/ApplyInfo.vue'
import { Dialog, Toast } from 'vant'
import lottie from 'lottie-web'
import empty from '@/assets/empty.json'

export default {
  components: {
    ApplyInfo
  },
  data() {
    return {
      applyList: [
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅',
          time: '2022-10-5',
          state: -1,
          id: 1
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩',
          time: '2022-10-5',
          state: 0,
          id: 2
        },
        {
          imgUrl:
            'http://p1.music.126.net/bqq6DITA5nj_yd_i6dsiTA==/109951166225429773.jpg',
          songName: '春夏秋冬',
          singer: '张国荣',
          time: '2022-10-5',
          state: 1,
          id: 3
        },
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          singer: '陈奕迅',
          time: '2022-10-5',
          state: 2,
          id: 4
        }
      ] /* 请求列表 */,
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
      }
    }
  },
  watch: {
    'menu.state': function (val) {
      this.curList = this.applyList.filter(
        (item) => val === -2 || item.state === val
      )
      console.log(this.curList)
    }
  },
  mounted() {
    this.$axios
      .get('/user/myApplication')
      .then((res) => {
        res.data.data.forEach((item) => {
          const temp = {}
          temp.id = item.ID
          // temp.time = item.CreatedAt
          temp.time = item.CreatedAt.split('T')[0]
          temp.state = item.status
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
      .finally(() => {
        this.curList = this.applyList
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
    delApply(state, index) {
      this.curIndex = index
      Toast.clear()
      if (state === -1 || state === 0 || state === 2) {
        Dialog.confirm({
          title: '删除后不可找回，确定删除？'
        })
          .then(() => {
            this.$axios
              .post('/user/delete', {
                id: this.curList[index].id
              })
              .then((res) => {
                console.log(res)
                if (res.data.code === 200) {
                  this.curList.splice(index, 1)
                  this.curIndex = -1
                  Toast.success('删除成功')
                } else {
                  Toast.fail('删除失败')
                }
              })
              .catch(() => Toast.fail('请求异常'))
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
    withdraw(index) {
      Dialog.confirm({
        title: '确认撤回请求？'
      })
        .then(() => {
          this.$axios
            .post('/user/recall', {
              id: this.curList[index].id
            })
            .then((res) => {
              if (res.data.code === 200) {
                this.curList[index].state = -1
                Toast.success('撤回成功')
              } else {
                Toast.fail('撤回失败')
              }
            })
            .catch(() => Toast.fail('请求异常'))
        })
        .catch(() => {
          // on cancel
        })
    },
    /* 点击查看详情或重新提交时 */
    toForms(state) {
      if (state === -1 || state === 2) {
        console.log('重新提交')
      } else {
        console.log('查看详情')
      }
    }
  }
}
</script>

<style lang="less" scoped>
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

.van-dropdown-menu__item {
  flex: 0.5 !important;
}
</style>
