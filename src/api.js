// 封装请求api
import axios from '@/request.js'
import encrypt from '@/tools/encrypt.js'
// 跨域了，啥用没有
export const searchRequest = ({ s }) => {
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
export const searchMusic = ({ key, pageNo = 1, pageSize = 20, t = 0 }) =>
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
