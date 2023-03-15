import { userLogin } from './api/user'

// 封装公众号授权
const location = {
  origin: document.location.origin,
  search: document.location.search,
  isInWechat: window.navigator.userAgent.includes('MicroMessenger'),
  isTourist: document.location.href.includes('tourist')
}

function wxLoginRedirect() {
  window.location.href = `https://apps.hqu.edu.cn/wechat-hqu/wechatauth.html?proxyTo=authoauth&sendUrl=/connect/oauth2/authorize?appid=wxfe035b066fb1158b&redirect_uri=${encodeURIComponent(
    `${location.origin}`
  )}&encode_flag=Y&response_type=code&scope=snsapi_userinfo#wechat_redirect`
}

function setToken(token) {
  localStorage.setItem('token', token)
  state.token = token
}

function initState() {
  return {
    token: localStorage.getItem('token'),
    adminToken: localStorage.getItem('admin_token')
  }
}

const state = initState()

async function checkCode() {
  if (location.search) {
    const searchParams = new URLSearchParams(document.location.search)
    const wxCode = searchParams.get('code')
    if (wxCode) {
      try {
        setToken(await userLogin(wxCode))
      } catch (err) {
        console.log(err)
      }
      window.location.replace('/')
    }
  }
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

async function wxAuth(vue) {
  if (location.isTourist) {
    sessionStorage.setItem('tourist', 1)
  }
  // 不是游客或管理员
  if (
    !document.location.hash.includes('admin') &&
    !sessionStorage.getItem('tourist')
  ) {
    await checkCode()
    await checkToken()
    sessionStorage.removeItem('tourist')
  }
}

export { wxLoginRedirect, state, wxAuth }
