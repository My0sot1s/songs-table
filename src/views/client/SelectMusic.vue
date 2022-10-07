<template>
  <div id="ChooseMusic">
    <van-overlay :show="show" @click="show = false">
      <SelectMusicList />
    </van-overlay>
  </div>
</template>

<script>
import SelectMusicList from '@/components/SelectMusicList'
export default {
  components: {
    SelectMusicList
  },
  data() {
    return {
      show: true
    }
  },
  mounted() {
    this.$store.commit('changeNavText', '点歌')
  },
  methods: {}
}
</script>

<style>
body {
  background-color: rgb(250, 251, 253);
}
.van-overlay {
  background-color: inherit !important;
  overflow: scroll;
  z-index: 1;
  padding: 0 !important;
}
</style>
