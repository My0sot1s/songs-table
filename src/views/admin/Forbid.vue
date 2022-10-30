<template>
  <div id="forbid">
    <van-divider />
    <van-form @submit="onSubmit">
      <van-cell
        title="选择日期区间"
        :value="date"
        @click.stop="showCalendar = true"
      />
      <van-calendar
        color="#1989fa"
        v-model="showCalendar"
        type="range"
        :show-confirm="false"
        @confirm="onConfirm"
      />
      <van-field
        v-model="reason"
        rows="3"
        autosize
        label="原因"
        type="textarea"
        placeholder="请输入原因"
        :rules="[{ required: true, message: '' }]"
      />
      <van-button type="info" round native-type="submit">提交</van-button>
    </van-form>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { limitTime } from '@/api'
export default {
  data() {
    return {
      date: '',
      startTime: '',
      endTime: '',
      showCalendar: false,
      reason: ''
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
    async onSubmit() {
      if ((this.startTime ?? '') !== '' && (this.endTime ?? '') !== '') {
        try {
          const { data } = await limitTime(
            this.startTime,
            this.reason,
            this.endTime
          )
          if (data.code === 200) {
            Toast.success('提交成功')
          } else {
            Toast.fail(data.message)
          }
        } catch (err) {
          Toast.fail(err.message)
        }
      } else {
        Toast.fail('请填写时间段')
      }
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
