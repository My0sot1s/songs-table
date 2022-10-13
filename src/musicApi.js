// 封装请求api
import axios from 'axios'
import encrypt from '@/tools/encrypt.js'
// 跨域了，啥用没有
const QQsearchRequest = ({ s }) => {
  const { params, encSecKey } = encrypt({ s })
  console.log(params, encSecKey)
  return axios({
    url: 'https://music.163.com/weapi/cloudsearch/get/web?csrf_token=',
    method: 'POST',
    data: {
      params,
      encSecKey
    }
  })
}

const QQsearchMusic = ({ key, pageNo = 1, pageSize = 20, t = 0 }) =>
  axios({
    baseURL: 'http://124.222.111.191:3300',
    url: '/search',
    method: 'GET',
    params: {
      key,
      pageNo,
      pageSize,
      t
    }
  })

/*
QQ音乐获取歌曲信息
data.track_info.name  歌名
data.track_info.singer[0].name 歌手

data.track_info.album.name 专辑名
data.track_info.album.mid 专辑id
`https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg` 专辑封面
*/
const QQMusicDetail = (ids) => {
  // ids = '001Nl0W80sBSwJ'
  return axios({
    url: `http://124.222.111.191:3300/song?songmid=${ids}`,
    method: 'GET'
  })
}

/* 网易云搜索歌曲 */
const NetEaseCloudSearch = (keywords, limit = 15, offset = 0) => {
  return axios({
    url: 'http://124.220.183.86:3000/search',
    method: 'get',
    params: {
      keywords,
      limit,
      offset
    }
  })
}

/*
网易云获取歌曲信息
data.songs[0].name是歌名
data.songs[0].ar[i].name是歌手名，可能有多个歌手，ar是个数组
data.songs[0].al.picUrl是专辑封面
data.songs[0].al.name是专辑名
*/
const NetEaseCloudDetail = (ids) => {
  return axios({
    url: 'http://124.220.183.86:3000/song/detail',
    method: 'get',
    params: {
      ids
      // ids: 347230
    }
  })
}

export default {
  QQsearchRequest,
  QQsearchMusic,
  QQMusicDetail,
  NetEaseCloudSearch,
  NetEaseCloudDetail
}
