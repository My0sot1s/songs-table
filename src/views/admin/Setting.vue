<template>
  <div>
    <div class="header">管理</div>
    <hr />
    <div class="body">
      <div>特殊时间点歌规则</div>
      <div>使用帮助</div>
      <div>意见与反馈</div>
    </div>
    <TabBar></TabBar>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'

export default {
  components: {
    TabBar
  }
}
</script>

<style lang='less' scoped>
.header {
  margin: 2vh;
  font-size: 3vh;
}

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
