<template>
  <div class="apply-info">
    <div class="body">
      <div class="image">
        <van-image lazy-load fit="fill" width="7vh" height="7vh" :src="cover">
          <template #loading>
            <van-loading type="spinner" size="20" />
          </template>
          <template v-slot:error>
            <van-image
              radius="10px"
              show-loading
              width="15vh"
              height="15vh"
              fit="fill"
              src="https://y.qq.com/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000"
              ><template #loading>
                <van-loading type="spinner" size="20" /> </template
            ></van-image>
          </template>
        </van-image>
      </div>
      <div class="info">
        <div>
          <div class="song-name van-ellipsis">{{ songName }}</div>
          <div>
            <span class="state" v-if="state">{{ STATE[state] }}</span>
            <span class="campus" v-if="campus">{{ campus }}</span>
            <van-icon
              v-if="iconName"
              size="2vh"
              :name="iconName"
              @click.stop="$emit('action', Number(state))"
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
    cover: String,
    songName: String,
    singer: String,
    time: String,
    state: String,
    iconName: String,
    campus: String
  },
  data() {
    return {
      STATE: {
        '-1': '已撤回',
        0: '已结束',
        1: '待审核',
        2: '未通过',
        3: '待播放',
        4: '已播放'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.apply-info {
  width: 80vw;
  margin: 2vh auto;
  border-radius: 10px;
  box-shadow: 0 0 10px #aaa;

  .body {
    display: flex;
    padding: 2vh;

    .image {
      width: 7vh;
      height: 7vh;
      border-radius: 5px;
      box-shadow: 0 0 5px #999;
      overflow: hidden;
      margin-right: 1vh;
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
