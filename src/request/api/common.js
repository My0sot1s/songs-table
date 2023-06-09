import http from '@/request/request'
import formatDate from '@/tools/FormatDate'
import { GetMusicDetail } from '@/request/api/music'
import { Toast } from 'vant'

export async function getList(url, list, that, immediate = false) {
  const promiseList = []
  const [err, res] = await http.get(url)
  if (!err) {
    res.forEach((item) => {
      if (that && !inTime(item.broadcast_date)) return
      const promise = new Promise((resolve, reject) => {
        const temp = new OrderItem(item)
        if (immediate) {
          temp.getDetail().then(() => {
            if (that) {
              that.$store.commit('pushApply', temp)
            } else {
              list.push(temp)
            }
            resolve()
          })
        } else {
          if (that) {
            that.$store.commit('pushApply', temp)
          } else {
            list.push(temp)
          }
          resolve()
        }
      })
      promiseList.push(promise)
    })
  } else {
    Toast.fail(err)
  }
  await Promise.allSettled(promiseList)
}

class OrderItem {
  constructor(item) {
    this.id = item.ID
    this.time = formatDate(new Date(item.broadcast_date)).split(' ')[1]
    this.campus = item.school_district
    this.state = item.status
    this.blessingWords = item.blessing_words
    this.senderName = item.sender_name
    this.receiverName = item.receiver_name
    this.search_path = item.search_path
    this.song_id = item.song_id

    this.listenUrl = ''
    this.cover = ''
    this.songName = ''
    this.singer = ''
  }

  getDetail() {
    return new Promise((resolve, reject) => {
      GetMusicDetail(this.search_path, this.song_id)
        .then((arr) => {
          let [, detail] = arr
          let isEmpty = false
          if (this.search_path === '网易云' && detail.length === 0) {
            isEmpty = true
          } else if (this.search_path === 'qq' && !detail.track_info.name) {
            isEmpty = true
          }
          if (isEmpty) {
            reject(new Error('无此歌曲'))
          } else {
            detail = this.search_path === 'qq' ? detail.track_info : detail
            if (this.search_path === '网易云') {
              detail = detail[0]
              this.listenUrl = `https://music.163.com/#/song?id=${detail.id}`
              this.cover = detail.al.picUrl
              this.songName = detail.name
              this.singer = detail.ar.map((item) => item.name).join(' / ')
            } else if (this.search_path === 'qq') {
              this.listenUrl = `https://y.qq.com/n/ryqq/songDetail/${detail.mid}`
              if (detail.album.mid) {
                this.cover = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${detail.album.mid}.jpg`
              } else {
                this.cover =
                  'https://y.qq.com/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'
              }
              this.songName = detail.name
              this.singer = detail.singer.map((item) => item.name).join(' / ')
            }
            resolve()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }
}
// 限制时间为前后七天
function inTime(time) {
  const later = new Date().getTime() + 7 * 24 * 3600 * 1000
  const before = new Date().getTime() - 7 * 24 * 3600 * 1000
  const flag =
    new Date(time).getTime() <= later && new Date(time).getTime() >= before
  return flag
}
