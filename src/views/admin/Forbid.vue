<template>
  <div id="forbid">
    <van-divider />
    <van-cell center title="启用规则">
      <template #right-icon>
        <van-switch v-model="checked" size="24" />
      </template>
    </van-cell>
    <van-divider />
    <van-form @submit="onSubmit">
      <van-cell
        :style="`color: ${checked ? 'black' : '#c8c9cc'}`"
        title="日期区间"
        :value="date"
        @click.stop="showCalendar = checked"
      />
      <van-calendar
        color="#1989fa"
        v-model="showCalendar"
        type="range"
        :show-confirm="false"
        @confirm="onConfirm"
      />
      <van-field
        :disabled="!this.checked"
        v-model="reason"
        rows="3"
        autosize
        label="原因"
        type="textarea"
        placeholder="请输入原因"
        :rules="[{ required: true, message: '' }]"
      />
      <van-button type="info" round native-type="submit">修改</van-button>
    </van-form>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { limitTime, limitInfo } from '@/api'
export default {
  data() {
    return {
      date: '',
      startTime: '',
      endTime: '',
      showCalendar: false,
      reason: '',
      checked: false,
      firstTime: true
    }
  },
  watch: {
    async checked(val) {
      if (this.firstTime) {
        this.firstTime = false
      } else {
        if (
          (this.startTime ?? '') !== '' &&
          (this.endTime ?? '') !== '' &&
          this.startTime !== 1 &&
          this.endTime !== 2
        ) {
          this.limitTime(!val)
        }
      }
    }
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    onConfirm(date) {
      this.showCalendar = false
      this.startTime = [...date][0].getTime()
      this.endTime = [...date][1].getTime()
      const [start, end] = date
      this.show = false
      this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`
    },
    async limitTime(disable) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      let res
      try {
        if (disable) {
          res = await limitTime(1, this.reason, 2)
        } else {
          res = await limitTime(this.startTime, this.reason, this.endTime)
        }
        if (res.data.code === 200) {
          Toast.success('修改成功')
        } else {
          Toast.fail(res.data.message)
        }
      } catch (err) {
        Toast.fail(err.message)
      }
    },
    async onSubmit() {
      if (this.checked) {
        if (
          (this.startTime ?? '') !== '' &&
          (this.endTime ?? '') !== '' &&
          this.checked
        ) {
          this.limitTime(false)
        } else {
          Toast.fail('请填写时间段')
        }
      } else {
        Toast.fail('请先启用规则')
      }
    }
  },
  async created() {
    try {
      const { data } = await limitInfo()
      console.log(data)
      this.startTime = data.data.startTime
      this.reason = data.data.reason
      this.endTime = data.data.endTime
      if (this.startTime !== 1 && this.endTime !== 2) {
        this.checked = true
        this.date = `${this.formatDate(
          new Date(this.startTime)
        )} - ${this.formatDate(new Date(this.endTime))}`
      } else {
        this.date = '暂无'
      }
    } catch (err) {
      Toast.fail(err.message)
    }
  }
}
</script>

<style scoped>
.van-button {
  width: 70vw;
  margin: 4vw 15vw;
}
</style>
