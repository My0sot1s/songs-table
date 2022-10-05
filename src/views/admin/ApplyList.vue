<template>
  <div>
    <div class="header">申请列表</div>
    <hr />
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

</style>
