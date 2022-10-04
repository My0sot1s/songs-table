<template>
  <div class="content">
    <MusicList title="今日歌单" :showIcon="true"></MusicList>
    <hr />
    <MusicList title="即将到来" :showIcon="false"></MusicList>
    <hr />
  </div>
</template>

<script>
import MusicList from '@/components/MusicList'

export default {
  data() {
    return {}
  },
  components: {
    MusicList
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 3vw;
}

hr {
  height: 1px;
  background-color: #ccc;
  border: none;
  margin-top: 2vh;
}
</style>>
