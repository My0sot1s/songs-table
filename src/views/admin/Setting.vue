<template>
  <div>
    <div class="body">
      <div @click="showPick = true">添加备选歌曲</div>
      <div>特殊时间点歌规则</div>
      <div>使用帮助</div>
      <div>意见与反馈</div>
    </div>

    <van-overlay
      :lock-scroll="false"
      :show="showPick"
      @click="showPick = false"
    >
      <SelectMusicList @confirmMusic="confirmMusic" />
    </van-overlay>
    <TabBar />
  </div>
</template>

<script>
import SelectMusicList from '@/components/SelectMusicList'
import TabBar from '@/components/TabBar'
import { Dialog, Toast } from 'vant'

export default {
  components: {
    SelectMusicList,
    TabBar
  },
  data() {
    return {
      showPick: false
    }
  },
  methods: {
    confirmMusic(music) {
      Dialog.confirm({
        title: '将这首歌添加到今日播放？'
      })
        .then(() => {
          this.$axios
            .post('/admin/submit', {
              blessingWords: '-',
              broadcastDate: new Date().getTime(),
              searchPath: music.searchPath,
              songId: music.songmid
            })
            .then((res) => {
              if (res.data.code === 200) {
                this.showPick = false
                Toast.success('添加成功\n返回首页查看')
              } else {
                Toast.fail('添加失败\n请重试')
              }
            })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang='less' scoped>
.body div {
  display: flex;
  align-items: center;
  margin: 3vh auto;
  width: 86vw;
  padding-left: 4vw;
  height: 8vh;
  border-radius: 10px;
  box-shadow: 0 0 10px #aaa;
  font-size: 2.2vh;
  color: #333;
}
</style>
