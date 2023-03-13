import axios from 'axios'
import { wxLoginRedirect } from '@/tools/wxLogin'
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
      const { code, msg } = response.data || response.result
      if (code === 200) {
        Toast.success('')
      } else {
        Toast.fail(msg)
        if (code === 401) {
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
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axios.get(url, { params })
        resolve([null, res.data.data || res.data.result])
      } catch (err) {
        resolve([err, undefined])
      }
    })
  },
  post(url, data) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const res = await axios.post(url, data)
        resolve([null, res.data.data || res.data.result])
      } catch (err) {
        resolve([err, undefined])
      }
    })
  }
}

export default http
