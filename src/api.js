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

/*
 url: 请求地址
 list： 组件实例对象的data中对应的list
 tempObj: 获取的项目所包含的属性
 stateCondition： 是否进行状态筛选，传入false或状态值
 returnOnEnd： 在结束后返回还是每获取一个便添加到页面
 */
export const getList = (url, list, tempObj, stateCondition, returnOnEnd) => {
  return new Promise((resolve) => {
    let promise = Promise.resolve()
    const tempList = []
    const curList = returnOnEnd ? tempList : list

    axios({
      method: 'GET',
      url
    }).then(async (res) => {
      if (res.data.code === 200 && res.data.data) {
        res.data.data.forEach((item) => {
          if (!stateCondition || item.status === stateCondition) {
            promise = promise.then(() => {
              return new Promise((resolve) => {
                if (item.search_path === '网易云') {
                  Vue.prototype.$musicApi
                    .NetEaseCloudDetail(item.song_id)
                    .then((detail) => {
                      if (detail.data.songs.length === 0) {
                        resolve()
                      } else {
                        curList.push(getTemp(item, detail, tempObj))
                        resolve()
                      }
                    })
                } else if (item.search_path === 'qq') {
                  Vue.prototype.$musicApi.QQMusicDetail(item.song_id).then((detail) => {
                    if (!detail.data.data.track_info.name) {
                      resolve()
                    } else {
                      curList.push(
                        getTemp(item, detail.data.data.track_info, tempObj)
                      )
                      resolve()
                    }
                  })
                } else {
                  resolve()
                }
              })
            })
          }
        })
        return await promise
      }
    }).then(() => {
      console.log(curList)
      resolve(curList)
    })
  })
}

function getTemp(item, detail, tempObj) {
  const temp = {}
  tempObj.id && (temp.id = item.ID)
  tempObj.time && (temp.time = formatDate(new Date(item.broadcast_date)).split(' ')[1])
  tempObj.campus && (temp.campus = item.school_district)
  tempObj.state && (temp.state = item.status)
  if (item.search_path === '网易云') {
    temp.imgUrl = detail.data.songs[0].al.picUrl
    temp.songName = detail.data.songs[0].name
    temp.singer = detail.data.songs[0].ar[0].name
    for (let i = 1; i < detail.data.songs[0].ar.length; i++) {
      temp.singer += ' ' + detail.data.songs[0].ar[i].name
    }
  } else if (item.search_path === 'qq') {
    temp.imgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${detail.album.mid}.jpg`
    temp.songName = detail.name
    temp.singer = detail.singer[0].name
    for (let i = 1; i < detail.singer.length; i++) {
      temp.singer += ' ' + detail.singer[i].name
    }
  }

  return temp
}
