<template>
  <div>
    <NavBar />
    <Tabs
      ref="tabsComponent"
      :navList="['歌单']"
      :applyList="[curDayList]"
      :dateString="dateString"
      :showEmpty="curDayList.length === 0"
      showCampus
      :showDialog="showDialog"
      :actions="[{ name: '取消播送这首歌' }]"
      @selDay="selDay"
      @allDate="dateString = ''"
      @selAction="selAction"
      @cancelDialog="showDialog = false"
      @submitDialog="delItem"
    />
  </div>
</template>

<script>
import formatDate from '@/tools/FormatDate'
import { Toast } from 'vant'
import { getList } from '@/request/api/common'
import { passOrNot } from '@/request/api/admin'
import Tabs from '@/components/Tabs.vue'

export default {
  name: 'AdminHome',
  components: {
    Tabs
  },
  data() {
    return {
      dateString: '',
      showDialog: false
    }
  },
  computed: {
    curDayList() {
      return this.$store.state.applyList
        .filter(
          (item) =>
            item.time === this.dateString.split(' ')[1] &&
            (item.state === 3 || item.state === 0)
        )
        .sort((a, b) => (a.time > b.time ? 1 : -1))
    }
  },
  mounted() {
    this.dateString = formatDate(new Date())
  },
  activated() {
    this.getApplyList()
  },
  methods: {
    getApplyList() {
      if (!this.$store.state.load) {
        this.$store.commit('setShowLoading', true)
        this.$store.commit('changeLoad')
        getList('/admin/songList', this.$store.state.applyList, this).then(
          () => {
            this.$store.commit('setShowLoading', false)
            this.$refs.tabsComponent.onLoad()
            Toast.success('加载完成')
          }
        )
      }
    },
    /* 选择日期后触发 */
    selDay(Date) {
      this.dateString = formatDate(Date)
    },
    selAction() {
      this.showDialog = true
    },
    /* 确认删除后触发 */
    async delItem({ reason, curIndex }) {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      const [err] = await passOrNot('/admin/noPass', {
        id: this.curDayList[curIndex].id,
        noPassReason: reason
      })
      if (!err) {
        this.$store.commit('noPassApply', this.curDayList[curIndex].id)
        Toast.clear()
        Toast.success('驳回成功')
        this.showDialog = false
      } else {
        Toast.fail(err)
      }
    }
  }
}
</script>
