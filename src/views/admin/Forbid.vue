<template>
  <div id="forbid">
    <NavBar />
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
        v-model="form.reason"
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
import { Toast, Dialog } from 'vant'
import { limitTime, limitInfo } from '@/request/api/admin'
export default {
  data() {
    return {
      date: '',
      form: {
        endTime: '',
        reason: '',
        startTime: ''
      },
      prevForm: '',
      showCalendar: false,
      checked: null
    }
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    onConfirm(date) {
      this.showCalendar = false
      this.form.startTime = [...date][0].getTime()
      this.form.endTime = [...date][1].getTime()
      const [start, end] = date
      this.show = false
      this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`
    },
    // disable为是否禁用规则
    async limitTime(disable) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const [err] = disable
        ? await limitTime({
          startTime: 1,
          reason: this.form.reason,
          endTime: 2
        })
        : await limitTime(this.form)
      if (!err) {
        Toast.success('修改成功')
        this.prevForm = JSON.stringify(this.form)
      } else {
        Toast.fail(err)
      }
    },
    async onSubmit() {
      console.log(this.form)
      if (this.checked) {
        if (
          (this.form.startTime ?? '') !== '' &&
          (this.form.endTime ?? '') !== '' &&
          this.form.startTime !== 1 &&
          this.form.endTime !== 2
        ) {
          this.limitTime(false)
        } else {
          Toast.fail('请填写时间段')
        }
      } else {
        Toast.fail('请先启用规则')
      }
    },
    checkedHandler(val) {
      if (val) {
        this.onSubmit()
      } else {
        this.limitTime(true)
      }
    }
  },
  async created() {
    const [err, res] = await limitInfo()
    if (!err) {
      this.form.startTime = res.startTime
      this.form.reason = res.reason
      this.form.endTime = res.endTime
      this.prevForm = JSON.stringify(this.form)
      if (this.form.startTime !== 1 && this.form.endTime !== 2) {
        this.checked = true
        this.date = `${this.formatDate(
          new Date(this.form.startTime)
        )} - ${this.formatDate(new Date(this.form.endTime))}`
      } else {
        this.date = '暂无'
      }
      // 加载数据后监听
      this.$watch('checked', this.checkedHandler)
    } else {
      Toast.fail(err)
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log(this.prevForm, this.form)
    console.log(JSON.stringify(this.form))
    if (this.prevForm === JSON.stringify(this.form) || !this.checked) {
      console.log('pas')
      next()
    } else {
      Dialog.confirm({
        title: '',
        message: '是否保存修改？',
        closeOnPopstate: false,
        confirmButtonColor: '#1989fa'
      })
        .then(async () => {
          this.onSubmit()
        })
        .catch(() => {
          next()
        })
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
