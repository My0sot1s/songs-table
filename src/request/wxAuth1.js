import { userLogin } from '@/request/api/user1'
import { adminLogin } from '@/request/api/admin1'
import { Toast } from 'vant'
export function wxLoginRedirect(hash) {
  /* 参数 redirect_uri 需要用urlEncode对链接处理 */
  location.href = `https://apps.hqu.edu.cn/wechat-hqu/wechatauth.html?proxyTo=authoauth&sendUrl=/connect/oauth2/authorize?appid=wxfe035b066fb1158b&redirect_uri=${encodeURIComponent(
    `${location.origin}/${hash}`
  )}&encode_flag=Y&response_type=code&scope=snsapi_userinfo#wechat_redirect`
}

function getToken() {
  if (!location.hash.includes('admin')) {
    /* 用户端 */
    return localStorage.getItem('token')
  } else {
    /* 管理端 */
    return localStorage.getItem('adminToken')
  }
}

async function setToken(wxCode) {
  if (!location.hash.includes('admin')) {
    /* 用户端 */
    const [err, res] = await userLogin(wxCode)
    if (!err) {
      localStorage.setItem('token', res.token)
    } else {
      Toast.fail(err)
    }
  } else {
    /* 管理端 */
    const [err, res] = await adminLogin(wxCode)
    if (!err) {
      localStorage.setItem('adminToken', res.token)
    } else {
      Toast.fail(err)
    }
  }
}
async function checkWxCode() {
  const wxCode = location.hash.split('code=')[1]?.split('&')[0]
  location.hash = location.hash.split('?')[0]
  if (wxCode) {
    await setToken(wxCode)
  }
}

function checkToken() {
  if (!getToken()) {
    if (!location.hash.includes('admin')) {
      wxLoginRedirect(location.hash)
    } /*  else {
      location.hash = '/admin/login'
    } */
  }
}

export async function wxLogin() {
  if (location.isTourist) {
    sessionStorage.setItem('tourist', 1)
  }
  if (sessionStorage.getItem('tourist')) {
    return
  }
  await checkWxCode()
  checkToken()
}
