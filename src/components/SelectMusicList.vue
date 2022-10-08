<template>
  <div id="selectMusicList" @click.stop>
    <van-form>
      <van-search shape="round" v-model="value" placeholder="" />
    </van-form>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <MusicCell
        ref="cells"
        v-for="music in musicList"
        :key="music.id"
        :music="music"
        @click.native="select(music.id)"
      />
    </van-list>
    <van-button type="default">确认</van-button>
  </div>
</template>

<script>
import MusicCell from '@/components/MusicCell'
import { searchRequest } from '@/api'
export default {
  components: {
    MusicCell
  },
  data() {
    return {
      value: '',
      timer: null,
      list: [],
      loading: false,
      finished: false,
      musicList: [
        {
          id: 0,
          img: '',
          name: '恋爱脑',
          singer: 'nana'
        },
        {
          id: 1,
          img: '',
          name: 'Solace',
          singer: 'Feint'
        },
        {
          id: 2,
          img: '',
          name: 'A Moment Apart游戏《极限竞速：地平线4》背景音乐',
          singer: 'ODESZA'
        },
        {
          id: 3,
          img: '',
          name: 'ココロスペアキー',
          singer: '会沢紗弥'
        }
      ]
    }
  },
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    select(id) {
      this.$refs.cells.forEach((e) => {
        e.$el.style.backgroundColor = 'inherit'
      })
      this.$refs.cells[id].$el.style.backgroundColor = 'rgb(239, 242, 247)'
    },
    search() {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.value.length === 0) return
        const res = await searchRequest({ s: this.value })
        console.log(res)
      }, 200)
    }
  },
  watch: {
    value: {
      handler: 'search'
    }
  }
}
</script>

<style lang="less" scoped>
#selectMusicList {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 22vw 2vw 1vw 2vw;
  padding: 8vw 7vw 0 7vw;
  border-radius: 4vw;
  box-shadow: 0 0 5px #999;
  overflow: scroll;
  z-index: 1;
  .van-search {
    padding: 0;
    margin-bottom: 6vw;
    position: -webkit-sticky;
    position: sticky;
    top: 0 vw;
  }
  .van-list {
    max-height: 100vw;
    padding: 0 1vw 0 1vw;
    border-top: 2px solid rgb(250, 251, 253);
    overflow: scroll;
  }
  .van-button {
    box-shadow: 0 0 5px #999;
    margin: 2vw 11vw 10vw 11vw;
  }
}
</style>
