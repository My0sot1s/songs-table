<template>
  <div class="apply-info">
    <div class="body">
      <div class="image">
        <van-image
          width="8vh"
          height="8vh"
          fit="fill"
          :src="imgUrl"
          :lazy-load="lazeLoad"
        >
          <template #loading>
            <van-loading type="spinner" size="20" />
          </template>
          <template #error>加载失败</template>
        </van-image>
      </div>
      <div class="info">
        <div>
          <div class="song-name van-ellipsis">{{ songName }}</div>
          <div>
            <span class="state" v-if="state">{{ grtState(state) }}</span>
            <span class="campus" v-if="campus">{{ campus }}</span>
            <van-icon
              size="2vh"
              :name="iconName"
              @click.stop="$emit('action', state)"
            />
          </div>
        </div>
        <div>
          <div class="singer">
            <van-icon name="user-o" />
            <div class="van-ellipsis">{{ singer || '佚名' }}</div>
          </div>
          <div class="time">
            <van-icon name="calendar-o" />
            <div class="van-ellipsis">{{ time }}</div>
          </div>
        </div>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: String,
    songName: String,
    singer: String,
    time: String,
    state: Number,
    iconName: String,
    campus: String,
    lazeLoad: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      STATE: {
        '-1': '已撤回',
        0: '已结束',
        1: '待审核',
        2: '未通过',
        3: '待播放'
      }
    }
  },
  methods: {
    grtState(num) {
      return this.STATE[num]
    }
  }
}
</script>

<style lang='less' scoped>
.apply-info {
  width: 80vw;
  margin: 2vh auto;
  border-radius: 10px;
  box-shadow: 0 0 10px #aaa;

  .body {
    display: flex;
    padding: 2vh;

    .image {
      width: 8vh;
      height: 8vh;
      border-radius: 5px;
      box-shadow: 0 0 5px #999;
      overflow: hidden;
      margin-right: 2.5vw;
    }

    .info {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      & > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .song-name {
        font-size: 2.5vh;
        width: 30vw;
      }

      .singer,
      .time {
        font-size: 2vh;
        color: #555;
        display: flex;
        align-items: center;

        div {
          margin-left: 1vw;
        }
      }

      .singer {
        width: 23vw;
        margin-right: 1vw;
      }

      .time {
        width: 30vw;
      }

      .state,
      .campus {
        font-size: 1.6vh;
        color: #999;
        margin-right: 2vw;
      }
    }
  }
}
</style>
