<template>
  <div id="manageAdmin">
    <NavBar />
    <van-list
      v-model="loading"
      finished-text="没有更多了"
      :finished="finished"
      @load="onLoad"
    >
      <van-swipe-cell
        :before-close="beforeClose"
        v-for="(item, index) in list"
        :key="item.ID"
        :name="index"
      >
        <van-cell
          :border="false"
          :title="item.note"
          :value="item.is_super_admin === 1 ? '超级管理员' : '管理员'"
        />
        <template #left>
          <van-button square type="info" text="编辑" />
        </template>
        <template #right>
          <van-button square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
    </van-list>
    <van-button
      id="add"
      round
      icon="plus"
      type="info"
      @click="
        show = true
        isEdit = false
      "
    />
    <van-popup round id="popup" v-model="show" @close="resetForm">
      <div class="title">添加管理员</div>
      <van-form @submit="onSubmit">
        <van-field v-model="form.stu_num" name="学号" label="学号：" />
        <van-field v-model="form.note" name="备注名" label="备注名：" />
        <van-cell center title="超级管理员">
          <van-switch v-model="checked" />
        </van-cell>
        <van-cell
          ><van-radio-group
            v-model="form.school_district"
            direction="horizontal"
          >
            <van-radio name="厦门校区">厦门校区</van-radio>
            <van-radio name="泉州校区">泉州校区</van-radio>
          </van-radio-group></van-cell
        >
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
        is_super_admin: 0,
        note: undefined,
        stu_num: undefined,
        school_district: undefined
      },
      loading: false,
      finished: false,
      show: false,
      checked: false,
      isEdit: false
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
    checkStuNum() {
      if (!this.form.stu_num) {
        Toast.fail('请填写学号!')
        return false
      } else {
        return true
      }
    },
    checkNote() {
      if (!this.form.stu_num) {
        Toast.fail('请填写备注名!')
        return false
      } else {
        return true
      }
    },
    checkCampus() {
      if (!this.form.school_district) {
        Toast.fail('请选择校区!')
        return false
      } else {
        return true
      }
    },
    checkFilled() {
      return this.checkStuNum() && this.checkNote() && this.checkCampus()
    },
    resetForm() {
      this.form = {
        is_super_admin: 0,
        note: undefined,
        stu_num: undefined,
        school_district: undefined
      }
      this.checked = false
    },
    async onSubmit() {
      if (!this.checkFilled()) return
      const [err] = await addAdmin(this.form)
      this.show = false
      if (!err) {
        const text = this.isEdit ? '修改成功！' : '添加成功！'
        Toast.success(text)
        this.onLoad()
      } else {
        Toast.fail(err)
      }
    },
    // position 为关闭时点击的位置
    // instance 为对应的 SwipeCell 实例
    beforeClose({ position, instance, name }) {
      const index = name
      switch (position) {
        case 'left':
          this.isEdit = true
          this.form = (({
            is_super_admin,
            note,
            stu_num,
            school_district
          }) => ({
            is_super_admin,
            note,
            stu_num,
            school_district
          }))(this.list[index])
          this.checked = this.form.is_super_admin === 1
          this.show = true
          break
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          Dialog.confirm({
            message: '确定删除吗？'
          }).then(async () => {
            console.log(this.list[index].stu_num)
            const [err] = await deleteAdmin(this.list[index].stu_num)
            if (!err) {
              this.list.splice(index, 1)
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
    padding-bottom: 10vh;
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
