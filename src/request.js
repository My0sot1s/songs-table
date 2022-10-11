// 封装axios
import theAxios from 'axios'
import qs from 'qs'

const location = {
  origin: document.location.origin,
  search: document.location.search,
  searchParams: new URLSearchParams(document.location.search),
  isInWechat: window.navigator.userAgent.includes('MicroMessenger'),
  isAdmin: document.location.hash.includes('admin')
}

function wxLoginRedirect() {
  window.location.href = `https://apps.hqu.edu.cn/wechat-hqu/wechatauth.html?proxyTo=authoauth&sendUrl=/connect/oauth2/authorize?appid=wxfe035b066fb1158b&redirect_uri=${encodeURIComponent(
    `${location.origin}`
  )}&encode_flag=Y&response_type=code&scope=snsapi_userinfo#wechat_redirect`
}

const axios = theAxios.create({
  headers: { 'content-Type': 'application/x-www-form-urlencoded' },
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
    if (!state.token) {
      wxLoginRedirect()
      reject(new Error('should_wx_login'))
    }
  })
}

// 请求拦截
axios.interceptors.request.use(
  function (config) {
    config.data = qs.stringify(config.data)
    if (!location.isAdmin && state.token) {
      config.headers.token = state.token
    } else if (location.isAdmin && state.token) {
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
    if (!location.isAdmin && response.data.code) {
      const code = response.data.code.toString()
      if (['401', '440', '441'].includes(code)) {
        wxLoginRedirect()
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

    if (!location.isInWechat) {
      return resolve()
    }

    /* 关闭授权就注释下面几行和响应拦截 */
    if (!location.isAdmin) {
      checkCode().then(checkToken).then(resolve())
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
