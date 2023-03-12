// 封装axios
import _axios from 'axios'
import { state, wxLoginRedirect } from './wxAuth'

export const axios = _axios.create({
  baseURL: '',
  timeout: 20000
})

// 请求拦截
axios.interceptors.request.use(
  function (config) {
    const hash = document.location.hash
    if (!hash.includes('admin') && state.token) {
      config.headers.token = state.token
    } else if (hash.includes('admin')) {
      if (!state.adminToken) {
        state.adminToken = localStorage.getItem('admin_token')
      }
      config.headers.token = state.adminToken
    }
    return config
  },
  async (error) => {
    console.dir(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  function (response) {
    if (response.data.code) {
      const code = response.data.code.toString()
      if (['401', '440', '441'].includes(code)) {
        if (document.location.hash.includes('admin')) {
          window.location.hash = '/admin/login'
        } else {
          if (!sessionStorage.tourist) wxLoginRedirect()
        }
      }
    }
    return response
  },
  async (error) => {
    console.dir(error)
  }
)
