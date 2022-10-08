<template>
  <div>
    <div class="admin-content">
      <!-- <div class="admin-header">申请列表</div> -->
      <van-sticky offset-top="6vh">
        <div class="admin-navBar">
          <div>
            <div
              class="nav"
              v-for="(nav, index) in ['待处理', '已处理']"
              :key="index"
              :class="{ 'active-nav': curNav === index }"
              @click="curNav = index"
            >
              {{ nav }}
            </div>
          </div>
          <div class="time" @click="showCalendar = true">
            <div>{{ dateString || '所有时间' }}</div>
            <div><van-icon size="3.5vh" name="calendar-o" /></div>
          </div>
        </div>
      </van-sticky>

      <div v-if="curNav === 0">
        <ApplyInfo
          v-for="(item, index) in curDayPendingList"
          :key="index"
          :imgUrl="item.imgUrl"
          :songName="item.songName"
          :singer="item.singer"
          :time="item.time"
          :state="item.state"
          @click.native="toExamine(index)"
        />
      </div>
      <div v-else>
        <ApplyInfo
          v-for="(item, index) in curDayProcessedList"
          :key="index"
          :imgUrl="item.imgUrl"
          :songName="item.songName"
          :singer="item.singer"
          :time="item.time"
          :state="item.state"
          iconName="ellipsis"
          @action="
            actionSheet.show = true
            curIndex = index
          "
        />
      </div>
    </div>

    <TabBar />
    <van-calendar
      color="#3c9cff"
      :min-date="new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)"
      :max-date="new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)"
      v-model="showCalendar"
      @select="selDay"
    >
      <template #footer>
        <div class="calendar-footer">
          <van-button
            class="calendar-btn"
            round
            color="#3c9cff"
            @click="
              dateString = ''
              showCalendar = false
            "
            >全部日期</van-button
          >
        </div>
      </template>
    </van-calendar>
    <van-action-sheet
      v-model="actionSheet.show"
      :actions="actionSheet.actions"
      cancel-text="取消"
      close-on-click-action
      close-on-popstate
      @select="dialog.show = true"
    />
    <van-dialog
      v-model="dialog.show"
      :title="dialog.title"
      :show-cancel-button="true"
      @confirm="retried"
    >
    </van-dialog>
  </div>
</template>

<script>
import ApplyInfo from '@/components/ApplyInfo'
import TabBar from '@/components/TabBar'
import formatDate from '@/tools/FormatDate'

export default {
  components: {
    TabBar,
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
          time: '2022-10-6',
          state: ''
        },
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          singer: '陈奕迅',
          time: '2022-10-7',
          state: '未通过'
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
          time: '2022-10-6',
          state: ''
        },
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          singer: '陈奕迅',
          time: '2022-10-7',
          state: '未通过'
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
          time: '2022-10-6',
          state: ''
        },
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          singer: '陈奕迅',
          time: '2022-10-7',
          state: '未通过'
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
          time: '2022-10-6',
          state: ''
        },
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          singer: '陈奕迅',
          time: '2022-10-7',
          state: '未通过'
        }
      ],
      dateString: '',
      /* 当前导航 0：待处理，1：已处理 */
      curNav: 0,
      /* 当前点击的卡片 */
      curIndex: Number,
      showCalendar: false,
      actionSheet: {
        show: false,
        actions: [{ name: '重新审核' }]
      },
      dialog: {
        show: false,
        title: '要重新审核该歌曲吗'
      }
    }
  },
  computed: {
    curDayPendingList() {
      return this.applyList.filter(
        (item) =>
          (!this.dateString || item.time === this.dateString.split(' ')[1]) &&
          !item.state.includes('通过')
      )
    },
    curDayProcessedList() {
      return this.applyList.filter(
        (item) =>
          (!this.dateString || item.time === this.dateString.split(' ')[1]) &&
          item.state.includes('通过')
      )
    }
  },
  methods: {
    selDay(date) {
      this.dateString = formatDate(date)
      this.showCalendar = false
    },
    toExamine(index) {
      console.log(index)
      this.$router.push('/admin/examine')
    },
    retried() {
      console.log(`重新审核第${this.curIndex + 1}首歌`)
    }
  }
}
</script>

<style lang='less' scoped>
.admin-content {
  margin-bottom: 20vh;
}

.admin-navBar {
  .nav {
    margin-left: 6vw;
    font-size: 2.1vh;
    color: #ccc;
  }

  .active-nav {
    color: #333;
  }

  .time div {
    margin-right: 3vw;
    font-size: 1.8vh;
    color: #333;
  }
}

.calendar-footer {
  margin-bottom: 1vh;
  display: flex;
  justify-content: center;

  .calendar-btn {
    width: 90vw;
    height: 4.4vh;
  }
}
</style>
