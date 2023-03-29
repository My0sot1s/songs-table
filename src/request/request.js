import axios from 'axios'
import { wxLoginRedirect } from '@/request/wxAuth'
import { Toast } from 'vant'

axios.defaults.baseURL = 'https://songs.sends.cc'

/* 不携带token的请求 */
const withoutToken = [
  'login',
  'todaySongs',
  'comingSongs',
  'isLimitDay',
  'notice',
  'musicapi'
]

function addToken(config) {
  if (withoutToken.some((item) => config.url.includes(item))) return config
  if (!document.location.hash.includes('admin')) {
    /* 用户端 */
    /* 若localstorage中不存在token,则不加token至请求头 */
    if (localStorage.getItem('token')) {
      config.headers.token = localStorage.getItem('token') || ''
    }
  } else {
    /* 管理端 */
    if (localStorage.getItem('adminToken')) {
      config.headers.token = localStorage.getItem('adminToken') || ''
    }
  }
  return config
}

/* 请求拦截 */
axios.interceptors.request.use((config) => {
  config = addToken(config)
  return config
})

/* 响应拦截 */
axios.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data || response.result
    if (
      code &&
      ![200, 406].includes(code) &&
      !sessionStorage.getItem('tourist')
    ) {
      if (msg === 'Unauthorized') {
        Toast.fail('用户未登录！')
        wxLoginRedirect(location.hash)
      } else {
        return Promise.reject(msg)
      }
    }
    return response
  },
  (error) => {
    return Promise.reject(error.message)
  }
)

const http = {
  get(url, params = {}) {
    /* 是否出现错误，都返回resolve */
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axios.get(url, { params })
        resolve([null, res.data.data || res.data.result || res.data.songs])
      } catch (err) {
        console.dir(err)
        resolve([err, undefined])
      }
    })
  },
  post(url, data) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axios.post(url, data)
        resolve([null, res.data.data || res.data.result || res.data.songs])
      } catch (err) {
        console.dir(err)
        resolve([err, undefined])
      }
    })
  }
}

export default http
