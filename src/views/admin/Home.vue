<template>
  <div>
    <div class="admin-content">
      <!-- <div class="admin-header">歌单列表</div> -->
      <van-sticky offset-top="6vh">
        <div class="admin-navBar">
          <div class="title">歌单</div>
          <div class="time" @click="showCalendar = true">
            <div class="time-date">{{ dateString }}</div>
            <div><van-icon size="3.5vh" name="calendar-o" /></div>
          </div>
        </div>
      </van-sticky>

      <ApplyInfo
        v-for="(item, index) in curDayList"
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

    <TabBar />
    <van-calendar
      color="#3c9cff"
      :min-date="new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)"
      :max-date="new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)"
      confirm-text="选择"
      v-model="showCalendar"
      @confirm="selDay"
    />
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
      :message="dialog.message"
      :show-cancel-button="true"
      @confirm="delItem"
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
    ApplyInfo,
    TabBar
  },
  data() {
    return {
      applyList: [
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅',
          time: '2022-10-8',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩',
          time: '2022-10-8',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅',
          time: '2022-10-8',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩',
          time: '2022-10-8',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅',
          time: '2022-10-8',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩',
          time: '2022-10-8',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          singer: '陈奕迅',
          time: '2022-10-8',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          singer: '许嵩',
          time: '2022-10-8',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/bqq6DITA5nj_yd_i6dsiTA==/109951166225429773.jpg',
          songName: '春夏秋冬',
          singer: '张国荣',
          time: '2022-10-6',
          state: '厦门校区'
        },
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          singer: '陈奕迅',
          time: '2022-10-7',
          state: '厦门校区'
        }
      ],
      curIndex: Number,
      dateString: '',
      showCalendar: false,
      actionSheet: {
        show: false,
        actions: [{ name: '取消播送这首歌' }]
      },
      dialog: {
        show: false,
        title: '真的要将其移出歌单吗',
        message: '您可以在 申请列表 - 已处理 - 该日 内找到并将其回复'
      }
    }
  },
  computed: {
    curDayList() {
      return this.applyList.filter(
        (item) => item.time === this.dateString.split(' ')[1]
      )
    }
  },
  methods: {
    /* 选择日期后触发 */
    selDay(Date) {
      this.dateString = formatDate(Date)
      this.showCalendar = false
    },
    /* 确认删除后触发 */
    delItem() {
      console.log(`取消播放第${this.curIndex + 1}首歌`)
    }
  },
  mounted() {
    this.dateString = formatDate(new Date())
  }
}
</script>

<style lang='less' scoped>
.admin-content{
  margin-bottom: 12vh;
}

.admin-navBar {
  display: flex;
  justify-content: space-between;
  background-color: #fafbfd;
  padding: 1vh 0;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;

  & > div {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 2.1vh;
    margin-left: 6vw;
  }

  .time {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 3vw;
    font-size: 1.8vh;

    &-date {
      color: #555;
      margin-right: 2vw;
    }
  }
}
</style>
