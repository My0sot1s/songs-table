import { request as axios } from '@/request.js'
import formatDate from '@/tools/FormatDate'
import Vue from 'vue'

export const submitRequest = (form) =>
  axios({
    method: 'POST',
    url: '/user/submit',
    data: form
  })

export const updateRequest = (form) =>
  axios({
    method: 'POST',
    url: '/user/update',
    data: form
  })

export const getList = (url, list, that) => {
  return new Promise((resolve) => {
    let promise = Promise.resolve()

    axios({
      method: 'GET',
      url
    })
      .then(async (res) => {
        if (res.data.code === 200 && res.data.data) {
          res.data.data.forEach((item) => {
            promise = promise.then(() => {
              return new Promise((resolve) => {
                if (!that || (that && inTime(item.broadcast_date))) {
                  if (item.search_path === '网易云') {
                    Vue.prototype.$musicApi
                      .NetEaseCloudDetail(item.song_id)
                      .then((detail) => {
                        if (detail.data.songs.length === 0) {
                          resolve()
                        } else {
                          const temp = getTemp(item, detail)
                          if (that) {
                            that.$store.commit('pushApply', temp)
                          } else {
                            list.push(temp)
                          }
                          resolve()
                        }
                      })
                  } else if (item.search_path === 'qq') {
                    Vue.prototype.$musicApi
                      .QQMusicDetail(item.song_id)
                      .then((detail) => {
                        if (!detail.data.data.track_info.name) {
                          resolve()
                        } else {
                          const temp = getTemp(
                            item,
                            detail.data.data.track_info
                          )
                          if (that) {
                            that.$store.commit('pushApply', temp)
                          } else {
                            list.push(temp)
                          }
                          resolve()
                        }
                      })
                  } else {
                    resolve()
                  }
                } else {
                  resolve()
                }
              })
            })
          })
          return await promise
        }
      })
      .then(() => {
        resolve(list)
      })
  })
}

export const reject = (id, reason) =>
  axios({
    method: 'POST',
    url: '/admin/noPass',
    data: {
      id,
      noPassReason: reason
    }
  })

export const getLimitDay = () =>
  axios({
    method: 'GET',
    url: '/user/isLimitDay'
  })

export const limitTime = (endTime, reason, startTime) =>
  axios({
    method: 'POST',
    url: 'admin/limitTime',
    data: {
      endTime,
      reason,
      startTime
    }
  })

function getTemp(item, detail) {
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

function inTime(time) {
  const later = new Date().getTime() + 7 * 24 * 3600 * 1000
  const before = new Date().getTime() - 7 * 24 * 3600 * 1000
  const flag =
    new Date(time).getTime() <= later && new Date(time).getTime() >= before
  return flag
}
