import { userLogin, adminLogin } from '@/api1.js'
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
  localStorage.setItem('token', 123)
  if (!location.hash.includes('admin')) {
    /* 用户端 */
    const [err, res] = await userLogin(wxCode)
    /* alert(err, res) */
    if (!err) {
      localStorage.setItem('token', res.token)
    }
  } else {
    /* 管理端 */
    const [err, res] = await adminLogin(wxCode)
    if (!err) {
      localStorage.setItem('adminToken', res.token)
    }
  }
}
async function checkWxCode() {
  const wxCode = location.hash.split('code=')[1]?.split('&')[0]
  location.hash = location.hash.split('?')[0]
  if (wxCode) {
    setToken(wxCode)
  }
}

function checkToken() {
  if (!getToken()) wxLoginRedirect(location.hash)
}

export default {
  async install() {
    await checkWxCode()
    checkToken()
  }
}
