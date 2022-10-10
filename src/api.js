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

/* 网易云搜索歌曲 */
const NetEaseCloudSearch = keywords => {
  return axios({
    url: 'http://124.220.183.86:3000/search',
    method: 'get',
    params: {
      keywords
    }
  })
}

/*
网易云获取歌曲信息
res.data.songs[0].name是歌名
res.data.songs[0].ar[i].name是歌手名，可能有多个歌手，ar是个数组
res.data.songs[0].al.picUrl是专辑封面
res.data.songs[0].al.name是专辑名
*/
const NetEaseCloudDetail = ids => {
  return axios({
    url: 'http://124.220.183.86:3000/song/detail',
    method: 'get',
    params: {
      // ids
      ids: 347230
    }
  })
}

export default {
  QQsearchRequest,
  QQsearchMusic,
  NetEaseCloudSearch,
  NetEaseCloudDetail
}
