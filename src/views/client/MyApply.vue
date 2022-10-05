<template>
  <div>
    <AplyInfo
      v-for="(item, index) in applyList"
      :key="index"
      :imgUrl="item.imgUrl"
      :songName="item.songName"
      :userName="item.userName"
      :time="item.time"
    >
      <template #state>{{ item.state }}</template>
      <template #footer>
        <div class="footer">
          <hr />
          <div
            :class="{ 'flex-end': item.state == '已撤回' }"
            v-if="item.state !== '已结束'"
          >
            <div v-if="item.state !== '已撤回'">
              <van-icon color="#555" name="revoke" /><span>申请撤回</span>
            </div>
            <div>
              <van-icon color="#555" name="guide-o" /><span>{{
                item.state == '已撤回' ? '重新提交' : '查看详情'
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </AplyInfo>
  </div>
</template>

<script>
import AplyInfo from '@/components/ApplyInfo.vue'

export default {
  data() {
    return {
      applyList: [
        {
          imgUrl:
            'http://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg',
          songName: '浮夸',
          userName: 'admin',
          time: '2022-10-5',
          state: ''
        },
        {
          imgUrl:
            'http://p1.music.126.net/Wcs2dbukFx3TUWkRuxVCpw==/3431575794705764.jpg',
          songName: '雅俗共赏',
          userName: 'admin',
          time: '2022-10-5',
          state: ''
        },
        {
          imgUrl:
            'http://p1.music.126.net/bqq6DITA5nj_yd_i6dsiTA==/109951166225429773.jpg',
          songName: '春夏秋冬',
          userName: 'admin',
          time: '2022-10-5',
          state: '已撤回'
        },
        {
          imgUrl:
            'http://p1.music.126.net/jzNxBp5DCER2_aKGsXeRww==/109951167435823724.jpg',
          songName: '富士山下',
          userName: 'admin',
          time: '2022-10-5',
          state: '已结束'
        }
      ]
    }
  },
  components: {
    AplyInfo
  }
}
</script>

<style lang='less' scoped>
.footer {
  hr {
    height: 1px;
    background-color: #ccc;
    border: none;
    margin: 0;
  }

  & > div {
    padding: 2vh;
    display: flex;
    justify-content: space-between;
  }

  span {
    margin-left: 2vw;
    font-size: 2vh;
    color: #555;
  }

  .flex-end {
    justify-content: flex-end;
  }
}
</style>
