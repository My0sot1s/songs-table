import { axios } from '@/request/config'
import formatDate from '@/tools/FormatDate'
import { GetMusicDetail } from '@/request/api/music'

export const getList = async (url, list, that) => {
  const promiseList = []

  const res = await axios.get(url)

  if (res.data.code === 200 && res.data.data) {
    res.data.data.forEach(item => {
      if (!that || (that && inTime(item.broadcast_date))) {
        const promise = new Promise((resolve, reject) => {
          try {
            GetMusicDetail(item.search_path, item.song_id).then(detail => {
              let isEmpty = false
              if (item.search_path === '网易云' && detail.data.songs.length === 0) isEmpty = true
              else if (item.search_path === 'qq' && !detail.data.data.track_info.name) isEmpty = true
              if (isEmpty) {
                reject(new Error('无此歌曲'))
              } else {
                detail = item.search_path === 'qq' ? detail.data.data.track_info : detail
                const temp = formatItem(item, detail)
                if (that) {
                  that.$store.commit('pushApply', temp)
                } else {
                  list.push(temp)
                }
                resolve()
              }
            })
          } catch (error) {
            reject(error)
          }
        })
        promiseList.push(promise)
      }
    })
  }

  await Promise.allSettled(promiseList)
}

function formatItem(item, detail) {
  const temp = {}
  temp.id = item.ID
  temp.time = formatDate(new Date(item.broadcast_date)).split(' ')[1]
  temp.campus = item.school_district
  temp.state = item.status
  if (item.search_path === '网易云') {
    temp.listenUrl = `https://music.163.com/#/song?id=${detail.data.songs[0].id}`
    temp.imgUrl = detail.data.songs[0].al.picUrl
    temp.songName = detail.data.songs[0].name
    temp.singer = detail.data.songs[0].ar[0].name
    for (let i = 1; i < detail.data.songs[0].ar.length; i++) {
      temp.singer += ' ' + detail.data.songs[0].ar[i].name
    }
  } else if (item.search_path === 'qq') {
    temp.listenUrl = `https://y.qq.com/n/ryqq/songDetail/${detail.mid}`
    temp.imgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${detail.album.mid}.jpg`
    temp.songName = detail.name
    temp.singer = detail.singer[0].name
    for (let i = 1; i < detail.singer.length; i++) {
      temp.singer += ' ' + detail.singer[i].name
    }
  }

  return temp
}
// 限制时间为前后七天
function inTime(time) {
  const later = new Date().getTime() + 7 * 24 * 3600 * 1000
  const before = new Date().getTime() - 7 * 24 * 3600 * 1000
  const flag =
    new Date(time).getTime() <= later && new Date(time).getTime() >= before
  return flag
}
