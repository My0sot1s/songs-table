<template>
  <div id="manageAdmin">
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <van-swipe-cell
        :before-close="beforeClose"
        v-for="item in list"
        :key="item.ID"
        :name="item.stu_num"
      >
        <van-cell
          :border="false"
          :title="item.note"
          :value="item.is_super_admin === 1 ? '超级管理员' : '管理员'"
        />
        <template #right>
          <van-button square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
    </van-list>
    <van-button id="add" round icon="plus" type="info" @click="show = true" />
    <van-popup round id="popup" v-model="show">
      <div class="title">添加管理员</div>
      <van-form @submit="onSubmit">
        <van-field v-model="form.stu_num" name="学号" label="学号：" />
        <van-field v-model="form.note" name="备注名" label="备注名：" />
        <van-cell title="超级管理员">
          <van-switch v-model="checked" />
        </van-cell>
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form></van-popup
    >
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { adminList, deleteAdmin, addAdmin } from '@/request/api/admin'
export default {
  data() {
    return {
      list: [],
      form: {
        is_super_admin: undefined,
        note: undefined,
        stu_num: undefined
      },
      loading: false,
      finished: false,
      show: false,
      checked: false
    }
  },
  watch: {
    checked(val) {
      if (val) {
        this.form.is_super_admin = 1
      } else {
        this.form.is_super_admin = 0
      }
    }
  },
  methods: {
    async onLoad() {
      const [err, res] = await adminList()
      this.loading = false
      this.finished = true
      if (!err) {
        this.list = res
      } else {
        Toast.fail(err)
      }
    },
    async onSubmit() {
      console.log(this.form)
      const [err] = await addAdmin(this.form)
      this.show = false
      if (!err) {
        Toast.success('添加成功！')
        this.onLoad()
      } else {
        Toast.fail(err)
      }
    },
    // position 为关闭时点击的位置
    // instance 为对应的 SwipeCell 实例
    beforeClose({ position, instance, name }) {
      switch (position) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          Dialog.confirm({
            message: '确定删除吗？'
          }).then(async () => {
            console.log(name)
            const [err] = await deleteAdmin(name)
            if (!err) {
              this.list.splice(
                this.list.findIndex((item) => item.stu_num === name),
                1
              )
              instance.close()
            } else {
              Toast.fail(err)
            }
          })
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
#manageAdmin {
  background-color: rgb(247, 248, 250);
  .van-list {
    .van-swipe-cell {
      margin-top: 3vw;
      box-shadow: 3px 3px 10px 2px rgb(223, 222, 222);
    }
  }
  #add {
    position: fixed;
    bottom: 15vh;
    right: 5vw;
    border-radius: 50%;
    box-sizing: border-box;
    width: 12vw;
    height: 12vw;
  }
  #popup {
    .title {
      padding: 5vw 0;
    }
    width: 80vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
