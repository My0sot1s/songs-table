<template>
  <div id="ChooseMusic">
    <NavBar />
    <ApplyForm :musics="musics" @popUp="popUp" />
    <van-popup
      :lock-scroll="false"
      v-model="showPick"
      round
      position="bottom"
      @click="showPick = false"
    >
      <SelectMusicList @confirmMusic="confirmMusic" />
    </van-popup>
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
  z-index: 1000;
  /* padding-bottom: 1vw; */
}
.van-form {
  background-color: white;
}
</style>
