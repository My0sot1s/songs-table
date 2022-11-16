<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <van-dialog v-model="show" :title="title" :show-confirm-button="false">
      <van-form @submit="submit">
        <div style="margin: 1.5vh 1vh">
          <slot name="field">
            <van-field
              v-model="value"
              rows="3"
              autosize
              type="textarea"
              placeholder="请输入驳回理由"
              :rules="[{ required: true, message: '' }]"
            />
          </slot>
        </div>
        <div class="form-btns">
          <van-button class="form-btns-btn" @click="cancle" native-type="button"
            >取消</van-button
          >
          <van-button class="form-btns-btn" native-type="submit"
            >确定
          </van-button>
        </div>
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: String
  },
  data() {
    return {
      value: ''
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.value)
    },
    cancle() {
      this.$emit('cancle')
    }
  }
}
</script>

<style lang='less' scoped>
.form-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-btn {
    height: 6vh;
    width: 50%;
    border: none;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    color: #ee0a24;
  }

  &-btn:first-child {
    border-left: none;
    color: #323233;
  }
}
</style>
