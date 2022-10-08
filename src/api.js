// 封装请求api
import axios from '@/request.js'
import encrypt from '@/tools/encrypt.js'
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
