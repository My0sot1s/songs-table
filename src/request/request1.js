import axios from 'axios'
import { wxLoginRedirect } from '@/request/wxAuth1'
import { Toast } from 'vant'

function addToken(config) {
  if (config.url.includes('musicapi')) return config
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
    if (response.data.code) {
      const { code } = response.data || response.result
      if (code === 401) {
        Toast.fail('未登录!')
        if (location.hash.includes('admin')) {
          location.hash = '/admin/login'
        } else {
          wxLoginRedirect(location.hash)
        }
      }
    }
    return response
  },
  (error) => {
    Toast.fail(error)
    console.dir(error)
  }
)

const http = {
  get(url, params = {}) {
    /* 是否出现错误，都返回resolve */
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axios.get(url, { params })
        if (!res.data.code || [200, 406].includes(res.data.code)) {
          resolve([null, res.data.data || res.data.result || res.data.songs])
        } else {
          resolve([res.data.msg, undefined])
        }
      } catch (err) {
        resolve(['请求异常：' + err, undefined])
      }
    })
  },
  post(url, data) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axios.post(url, data)
        if (!res.data.code || [200, 406].includes(res.data.code)) {
          resolve([null, res.data.data || res.data.result || res.data.songs])
        } else {
          resolve([res.data.msg, undefined])
        }
      } catch (err) {
        resolve(['请求异常：' + err, undefined])
      }
    })
  }
}

export default http
