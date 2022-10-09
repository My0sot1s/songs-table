<template>
  <div id="ChooseMusic">
    <van-overlay lock-scroll :show="showPick" @click="showPick = false">
      <SelectMusicList @confirmMusic="confirmMusic" />
    </van-overlay>
    <ApplyForm :musics="musics" @popUp="popUp" />
  </div>
</template>

<script>
import SelectMusicList from '@/components/SelectMusicList'
import ApplyForm from '@/components/ApplyForm.vue'
export default {
  components: {
    SelectMusicList,
    ApplyForm
  },
  data() {
    return {
      showPick: false,
      musicIndex: 0,
      musics: []
    }
  },
  mounted() {
    this.$store.commit('changeNavText', '点歌')
  },
  methods: {
    popUp(index) {
      this.showPick = true
      this.musicIndex = index
    },
    confirmMusic(music) {
      this.musics[this.musicIndex] = music
      this.$set(this.musics, this.musicIndex, music)
      this.showPick = false
    }
  }
}
</script>

<style lang="less">
body {
  background-color: rgb(250, 251, 253);
}
.van-overlay {
  /* background-color: inherit !important; */
  overflow: scroll;
  z-index: 1;
  padding-bottom: 1vw;
}
.van-form {
  background-color: white;
  .van-notice-bar {
    text-indent: 6vw;
  }
}
</style>
