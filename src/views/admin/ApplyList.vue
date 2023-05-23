<template>
  <div>
    <NavBar />
    <Tabs
      ref="tabsComponent"
      :navList="['待处理', curState]"
      :applyList="[curDayPendingList, curDayProcessedList]"
      :dateString="dateString"
      :menu="menu"
      :showEmpty="showEmpty"
      showFooter
      :showDialog="showDialog"
      :actions="[{ name: '重新审核' }]"
      @changeNav="changeNav"
      @changeMenu="changeMenu"
      @selDay="selDay"
      @allDate="dateString = ''"
      @selAction="selAction"
      @cancelDialog="showDialog = false"
      @submitDialog="retried($event, 'noPass')"
    />
  </div>
</template>

<script>
import formatDate from '@/tools/FormatDate'
import { Dialog, Toast } from 'vant'
import { getList } from '@/request/api/common'
import { passOrNot } from '@/request/api/admin'
import Tabs from '@/components/Tabs.vue'

export default {
  name: 'ApplyList',
  components: {
    Tabs
  },
  data() {
    return {
      curNav: 0,
      dateString: '',
      menu: {
        state: -2,
        states: [
          { text: '已处理', value: -2 },
          { text: '已撤回', value: -1 },
          { text: '已结束', value: 0 },
          { text: '未通过', value: 2 },
          { text: '待播放', value: 3 }
        ]
      },
      showDialog: false
    }
  },
  computed: {
    // 当前日期待处理列表
    curDayPendingList() {
      return this.$store.state.applyList
        .filter(
          (item) =>
            (!this.dateString || item.time === this.dateString.split(' ')[1]) &&
            item.state === 1
        )
        .sort((a, b) => (a.time > b.time ? 1 : -1))
    },
    // 当前日期 已处理/选定状态 列表
    curDayProcessedList() {
      return this.$store.state.applyList
        .filter(
          (item) =>
            (!this.dateString || item.time === this.dateString.split(' ')[1]) &&
            ((this.menu.state === -2 && item.state !== 1) ||
              item.state === this.menu.state)
        )
        .sort((a, b) => (a.time < b.time ? 1 : -1))
    },
    showEmpty() {
      return (
        (this.curNav === 0 && this.curDayPendingList.length === 0) ||
        (this.curNav === 1 && this.curDayProcessedList.length === 0)
      )
    },
    curState() {
      return this.menu.states.filter((item) => {
        return item.value === this.menu.state
      })[0].text
    }
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
          (res) => {
            this.$store.commit('setShowLoading', false)
            this.$refs.tabsComponent.onLoad()
            Toast.success('加载完成')
          }
        )
      }
    },
    changeNav(curNav) {
      this.curNav = curNav
    },
    changeMenu(state) {
      this.menu.state = state
    },
    selDay(date) {
      this.dateString = formatDate(date)
    },
    selAction(curIndex) {
      const state = this.curDayProcessedList[curIndex].state
      if (state === 3) {
        this.showDialog = true
      } else {
        Dialog.confirm({
          title: '要重新通过该歌曲吗？'
        }).then(() => {
          this.retried({ reason: null, curIndex }, 'pass')
        })
      }
    },
    // 重新审核歌曲
    async retried({ reason, curIndex }, type) {
      Toast.loading({
        message: '请求中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      const submitObj = {
        id: this.curDayProcessedList[curIndex].id
      }

      if (reason !== null) {
        submitObj.noPassReason = reason
      }

      const [err] = await passOrNot(`/admin/${type}`, submitObj)
      if (!err) {
        this.$store.commit(
          `${type}Apply`,
          this.curDayProcessedList[curIndex].id
        )
        Toast.clear()
        Toast.success('更改成功')
        if (reason !== null) this.showDialog = false
      } else {
        console.dir(err)
        Toast.fail(err)
      }
    }
  }
}
</script>
