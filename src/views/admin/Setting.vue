<template>
  <div>
    <div class="body">
      <div @click="showPick = true">添加备选歌曲</div>
      <div @click="$router.push('/admin/forbid')">禁止点歌时间段</div>
      <div>使用帮助</div>
      <div>意见与反馈</div>
    </div>

    <van-overlay
      :lock-scroll="false"
      :show="showPick"
      @click="showPick = false"
    >
      <SelectMusicList @confirmMusic="confirmMusic" />
    </van-overlay>
    <TabBar />

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
import TabBar from '@/components/TabBar'
import { Toast } from 'vant'

export default {
  components: {
    SelectMusicList,
    TabBar
  },
  data() {
    return {
      apply: {
        songId: '',
        broadcastDate: '',
        searchPath: '',
        schoolDistrict: ''
      },
      music: {
        imgUrl: '',
        singer: '',
        songName: ''
      },
      showCalendar: false,
      showPick: false,
      showTime: false,
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
      this.music.imgUrl = music.cover
      this.music.songName = music.songname
      this.music.singer = music.singer[0].name
      for (let i = 1; i < music.singer.length; i++) {
        this.music.singer += ' ' + music.singer[i].name
      }
      this.dialog.show = true
    },
    submitMusic() {
      Toast.clear()
      this.loading = true
      this.$axios.post('/admin/submit', this.apply).then((res) => {
        this.loading = false
        if (res.data.code === 200) {
          this.$store.commit('pushApply', {
            campus: this.apply.schoolDistrict,
            id: res.data.data.id,
            state: 3,
            time: formatDate(new Date(this.apply.broadcastDate)).split(' ')[1],
            ...this.music
          })
          this.showPick = false
          this.dialog.show = false
          Toast.success('添加成功\n返回首页查看')
        } else {
          Toast.fail('添加失败\n请重试')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.body {
  height: 91vh;
}

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
</style>
