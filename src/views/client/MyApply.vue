<template>
  <div>
    <AplyInfo
      v-for="(item, index) in applyList"
      :key="index"
      :imgUrl="item.imgUrl"
      :songName="item.songName"
      :singer="item.singer"
      :time="item.time"
      :state="item.state"
      iconName="delete-o"
      @click.native="curIndex = curIndex === index ? -1 : index"
      @action="action"
    >
      <template #footer>
        <div
          class="footer"
          v-show="curIndex === index && item.state !== '已结束'"
        >
          <hr />
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
    </AplyInfo>
    <van-dialog
      v-model="dialog.show"
      :title="dialog.title"
      :show-cancel-button="dialog.showCancel"
      @confirm="delApply"
    >
    </van-dialog>
  </div>
</template>

<script>
import AplyInfo from '@/components/ApplyInfo.vue'

export default {
  data() {
    return {
      applyList: [
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅',
          time: '2022-10-5',
          state: ''
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩',
          time: '2022-10-5',
          state: ''
        },
        {
          imgUrl:
            'http://p1.music.126.net/bqq6DITA5nj_yd_i6dsiTA==/109951166225429773.jpg',
          songName: '春夏秋冬',
          singer: '张国荣',
          time: '2022-10-5',
          state: '已撤回'
        },
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          singer: '陈奕迅',
          time: '2022-10-5',
          state: '已结束'
        }
      ] /* 请求列表 */,
      curIndex: 0 /* 当前显示footer的index */,
      dialog: {
        show: false,
        title: '',
        showCancel: false
      } /* 弹窗相关 */
    }
  },
  components: {
    AplyInfo
  },
  methods: {
    /* 点击删除图标时 */
    action(state) {
      if (state === '已结束' || state === '已撤回') {
        this.dialog.title = '删除后不可找回，确定删除？'
        this.dialog.showCancel = true
      } else {
        this.dialog.title = '请先撤回请求'
        this.dialog.showCancel = false
      }
      this.dialog.show = true
    },
    /* 确认删除时 */
    delApply() {
      if (this.dialog.showCancel) {
        console.log('删除请求')
      }
    },
    /* 点击撤回请求时 */
    withdraw() {
      console.log('撤回请求')
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

<style lang='less' scoped>
.footer {
  hr {
    height: 1px;
    background-color: #ccc;
    border: none;
    margin: 0;
  }

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
