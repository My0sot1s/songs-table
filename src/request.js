// 封装axios
import theAxios from 'axios'
// import qs from 'qs'
const location = {
  origin: document.location.origin,
  search: document.location.search,
  searchParams: new URLSearchParams(document.location.search),
  isInWechat: window.navigator.userAgent.includes('MicroMessenger'),
  isTourist: document.location.href.includes('tourist')
}

function wxLoginRedirect() {
  window.location.href = `https://apps.hqu.edu.cn/wechat-hqu/wechatauth.html?proxyTo=authoauth&sendUrl=/connect/oauth2/authorize?appid=wxfe035b066fb1158b&redirect_uri=${encodeURIComponent(
    `${location.origin}`
  )}&encode_flag=Y&response_type=code&scope=snsapi_userinfo#wechat_redirect`
}

const axios = theAxios.create({
  // headers: { 'content-Type': 'application/x-www-form-urlencoded' },
  baseURL: '',
  timeout: 20000
})

function getStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function setStorage(key, value) {
  try {
    return localStorage.setItem(key, value)
  } catch {
    return null
  }
}

function setToken(token) {
  setStorage('token', token)
  state.token = token
}

function initState() {
  return {
    token: getStorage('token'),
    adminToken: getStorage('admin_token')
  }
}

const state = initState()

function checkCode() {
  return new Promise((resolve, reject) => {
    if (location.search) {
      const searchParams = new URLSearchParams(document.location.search)
      const wxCode = searchParams.get('code')
      if (wxCode) {
        axios
          .post('/user/login', { code: wxCode })
          .then((res) => {
            if (res.data.data.token) {
              setToken(res.data.data.token)
              resolve()
            } else {
              if (res.data.msg === '找不到学号，请绑定桑梓微助手！') {
                alert(res.data.msg)
                window.location.href = 'http://wx.sends.cc/temporary/proxy'
              }
              reject(res.data)
            }
          })
          .catch((err) => console.log(err))
          .finally(() => {
            window.location.replace('/')
          })
      }
    } else {
      resolve()
    }
  })
}

function checkToken() {
  return new Promise((resolve, reject) => {
    if (!state.token && !location.isTourist) {
      wxLoginRedirect()
      reject(new Error('should_wx_login'))
    } else {
      resolve()
    }
  })
}

// 请求拦截
axios.interceptors.request.use(
  function (config) {
    // config.data = qs.stringify(config.data)
    if (!document.location.hash.includes('admin') && state.token) {
      config.headers.token = state.token
    } else if (document.location.hash.includes('admin')) {
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
          /* wxLoginRedirect() */
        }
      }
    }
    return response
  },
  async (error) => {
    console.dir(error)
  }
)

export default function initAxios(vue) {
  vue.prototype.$axios = axios
  vue.prototype.setToken = (token) => {
    setToken(token)
  }

  return new Promise((resolve) => {
    vue.prototype.isInWechat = location.isInWechat
    /* if (!location.isInWechat) {
      return resolve()
    } */
    if (location.isTourist) {
      sessionStorage.setItem('tourist', 1)
    }
    if (
      !document.location.hash.includes('admin') &&
      !sessionStorage.getItem('tourist')
    ) {
      checkCode().then(checkToken).then(resolve)
      sessionStorage.removeItem('tourist')
    } else {
      resolve()
    }
  })
}
export const request = ({
  url,
  method = 'GET',
  params = {},
  data = {},
  baseURL = axios.baseURL
}) => {
  return axios({
    url,
    method,
    params,
    data,
    baseURL
  })
}
