<template>
  <div>
    <div class="image">
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
    <hr />
    <div class="song-info info">
      <div>
        <div class="song-name van-ellipsis">{{ applyInfo.songName }}</div>
        <div class="singer van-ellipsis">{{ applyInfo.singer }}</div>
      </div>
    </div>
    <hr />
    <div class="user-info info">
      <div>
        <div class="from">
          <div class="from-name">
            <van-icon name="user-o" /><span>{{ applyInfo.from }}</span>
          </div>
          <div class="from-phone">
            <van-icon name="phone-o" /><span>{{ applyInfo.phone }}</span>
          </div>
        </div>
        <div class="to">
          <van-icon name="guide-o" /><span>{{ applyInfo.to }}</span>
        </div>
      </div>
    </div>
    <hr />
    <div class="info">
      <div>
        <div class="title">给TA的话</div>
        <div class="message">{{ applyInfo.message }}</div>
      </div>
    </div>

    <div class="btn1" v-if="showBtn">
      <div @click="reject">驳回</div>
      <div @click="pass" class="btn2">通过</div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'

export default {
  data() {
    return {
      applyInfo: {
        imgUrl:
          'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
        songName: '浮夸',
        singer: '陈奕迅',
        time: '2022-10-5',
        campus: '厦门校区',
        from: '李华',
        phone: '18585858585',
        to: '小明',
        message:
          '至若春和景明，波澜不惊，上下天光，一碧万顷；沙鸥翔集，锦鳞游泳，岸芷汀兰，郁郁青青。而或长烟一空，皓月千里，浮光跃金，静影沉璧；渔歌互答，此乐何极！'
      },
      showBtn: false
    }
  },
  mounted() {
    this.showBtn = this.$route.params.showBtn
  },
  methods: {
    reject() {
      Dialog.confirm({
        title: '确认驳回请求？'
      })
        .then(() => {
          console.log('reject')
        })
        .catch(() => {
          // on cancel
        })
    },
    pass() {
      Dialog.confirm({
        title: '确认通过请求？'
      })
        .then(() => {
          console.log('pass')
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang='less' scoped>
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
    margin-right: 15vw;
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
