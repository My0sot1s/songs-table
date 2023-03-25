<template>
  <div>
    <NavBar />
    <div class="body">
      <div @click="showPick = true">添加备选歌曲</div>
      <div @click="showPublish = true">管理公告</div>
      <div @click="$router.push('/admin/forbid')">禁止点歌时间段</div>
      <div @click="$router.push('/admin/manageAdmin')">管理员设置</div>
      <div>使用帮助</div>
      <div>意见与反馈</div>
    </div>

    <van-popup round id="popup" v-model="showPublish">
      <div id="title">管理公告</div>
      <van-form @submit="onSubmitNotice">
        <van-field
          autofocus
          v-model="notice"
          rows="2"
          autosize
          type="textarea"
          maxlength="100"
          placeholder="请输入公告内容"
          show-word-limit
        /><van-button round block type="info" native-type="submit"
          >发布公告</van-button
        >
      </van-form>
      <div class="delete" @click="deleteNotice">删除当前公告</div></van-popup
    >

    <van-popup
      :lock-scroll="false"
      v-model="showPick"
      position="bottom"
      round
      @click="showPick = false"
    >
      <SelectMusicList @confirmMusic="confirmMusic" />
    </van-popup>

    <van-dialog
      v-model="dialog.show"
      :title="dialog.title"
      :show-confirm-button="false"
    >
      <van-form @submit="submitMusic">
        <div style="margin: 1.5vh 1vh">
          <van-field
            v-model="apply.schoolDistrict"
            is-link
            readonly
            label="校区"
            placeholder="请选择你所在的校区"
            @click="dialog.cascader.show = true"
            :rules="[{ required: true, message: '' }]"
          />
        </div>
        <div class="form-btns">
          <van-button
            class="form-btns-btn"
            @click="dialog.show = false"
            native-type="button"
            >取消</van-button
          >
          <van-button
            class="form-btns-btn"
            native-type="submit"
            :loading="loading"
            loading-type="spinner"
            >确定
          </van-button>
        </div>
      </van-form>
    </van-dialog>

    <van-popup v-model="dialog.cascader.show" round position="bottom">
      <van-cascader
        active-color="#1989fa"
        v-model="apply.schoolDistrict"
        title="请选择所在校区"
        :options="dialog.cascader.options"
        @close="dialog.cascader.show = false"
        @finish="dialog.cascader.show = false"
      />
    </van-popup>
  </div>
</template>

<script>
import SelectMusicList from '@/components/SelectMusicList'
import formatDate from '@/tools/FormatDate'
import { Toast } from 'vant'
import { submit, noticeInfo, publishNotice } from '@/request/api/admin'

export default {
  components: {
    SelectMusicList
  },
  data() {
    return {
      apply: {
        songId: '',
        broadcastDate: '',
        searchPath: '',
        schoolDistrict: '',
        songName: ''
      },
      music: {
        cover: '',
        singer: '',
        songName: ''
      },
      showCalendar: false,
      showPick: false,
      showTime: false,
      showPublish: false,
      notice: '',
      date: '',
      dialog: {
        show: false,
        title: '',
        cascader: {
          show: false,
          options: [
            {
              text: '厦门校区',
              value: '厦门校区'
            },
            {
              text: '泉州校区',
              value: '泉州校区'
            },
            {
              text: '龙舟池校区',
              value: '龙舟池校区'
            }
          ]
        }
      },
      loading: false
    }
  },
  watch: {
    'music.schoolDistrict': {
      handler: function (newVal) {
        if (newVal !== '') this.dialog.title = '将此歌添加到今日播放？'
        else this.dialog.title = '请选择校区'
      },
      immediate: true
    }
  },
  methods: {
    confirmMusic(music) {
      this.apply.broadcastDate = new Date().getTime()
      this.apply.searchPath = music.searchPath
      this.apply.songId = music.songmid
      this.apply.songName = music.name
      this.music.cover = music.cover
      this.music.songName = music.songname
      this.music.singer = music.singers
      this.dialog.show = true
    },
    async submitMusic() {
      Toast.clear()
      this.loading = true
      const [err, res] = await submit(this.apply)
      this.loading = false
      if (!err) {
        this.$store.commit('pushApply', {
          campus: this.apply.schoolDistrict,
          id: res.id,
          state: 3,
          time: formatDate(new Date(this.apply.broadcastDate)).split(' ')[1],
          ...this.music
        })
        this.showPick = false
        this.dialog.show = false
        Toast.success('添加成功\n返回首页查看')
      } else {
        Toast.fail(err)
      }
    },
    async onSubmitNotice() {
      if (!this.notice) {
        Toast.fail('请输入公告内容！')
        return
      }
      const [err] = await publishNotice(this.notice)
      if (!err) {
        Toast.success('发布成功！')
      } else {
        Toast.fail(err)
      }
    },
    async deleteNotice() {
      const [err] = await publishNotice('')
      if (!err) {
        Toast.success('删除公告成功！')
      } else {
        Toast.fail(err)
      }
    }
  },
  async mounted() {
    const [err, res] = await noticeInfo()
    if (!err) {
      if (res) {
        this.notice = res
      }
    } else {
      Toast.fail(err)
    }
  }
}
</script>

<style lang="less" scoped>
.body div {
  display: flex;
  align-items: center;
  margin: 3vh auto;
  width: 86vw;
  padding-left: 4vw;
  height: 8vh;
  border-radius: 10px;
  box-shadow: 0 0 10px #aaa;
  font-size: 2.2vh;
  color: #333;
}

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
#popup {
  padding: 5vw;
  width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    padding: 5vw 0;
  }
  .van-form {
    width: 80vw;
    .van-field {
      margin: 5vw 0;
      border-radius: 2vw;
    }
  }
  .delete {
    padding: 3vw 0 1vw 0;
    font-size: 75%;
    color: rgb(238, 10, 36);
    text-decoration: underline;
  }
}
</style>
