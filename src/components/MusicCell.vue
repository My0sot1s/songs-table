<template>
  <div id="cell" ref="cell" @click="ripple">
    <div id="background"></div>
    <van-image
      round
      error-icon="https://y.qq.com/music/photo_new/T002R300x300M0000030lak94GN5Ad_0.jpg"
      width="12vw"
      height="12vw"
      :src="music.cover"
    />
    <div id="detail">
      <van-notice-bar color="black" :text="music.name" />
      <van-notice-bar id="singer" :text="singer" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['music'],
  computed: {
    singer() {
      if (this.music.albumname) {
        return this.music.singer[0].name + ' - ' + this.music.albumname
      } else {
        return this.music.singer[0].name
      }
    }
  },
  methods: {
    ripple(e) {
      if (this.$refs.cell.querySelector('.ripple')) return
      /* 清除原来的选中 */
      const cells = [...document.querySelectorAll('.ripple')]
      cells.forEach((e) => {
        e.remove()
      })

      const x = e.pageX - this.$refs.cell.getBoundingClientRect().left
      const y = e.pageY - this.$refs.cell.getBoundingClientRect().top
      const ripple = document.createElement('span')
      ripple.classList.add('ripple')
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      this.$refs.cell.appendChild(ripple)
    }
  }
}
</script>

<style lang="less">
#cell {
  position: relative;
  height: 18vw;
  margin: 6vw 0;
  padding: 0 4vw;
  border-radius: 4vw;
  box-shadow: 3px 3px 10px 2px rgb(223, 222, 222);
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .van-image {
    z-index: 1;
    border-radius: 1vw;
    box-shadow: 0 0 4px #999;
  }
  span {
    position: absolute;
    z-index: 0;
    background: rgb(239, 242, 247);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ripple 0.3s ease-in;
    animation-fill-mode: forwards;
  }
  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
    }
    100% {
      width: 200vw;
      height: 200vw;
    }
  }
  #background {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    width: 0;
    height: 0;
    z-index: 0;
    transition: width 500ms, height 500ms, background-color 500ms;
  }
  #detail {
    z-index: 1;
    width: 69vw;
    height: 12vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .van-notice-bar {
      height: 0px; /* 真机和开发者工具样式不一致，在真机上加这个，取代默认高度 */
      flex: auto;
      padding: 0 !important;
      background-color: inherit;
      font-size: 4vw;
    }
    #singer {
      font-size: 3vw;
      color: rgb(128, 128, 128);
    }
  }
}
</style>
