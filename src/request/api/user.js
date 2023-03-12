import { axios } from '../config'

async function userLogin(code) {
  const res = await axios.post('/user/login', { code })
  if (res.data.data.token) {
    return res.data.data.token
  } else {
    if (res.data.msg === '找不到学号，请绑定桑梓微助手！') {
      alert(res.data.msg)
      window.location.href = 'http://wx.sends.cc/temporary/proxy'
    }
    throw Error(res.data)
  }
}

function submitRequest(form) {
  return axios.post('/user/submit', form)
}

function updateRequest(form) {
  return axios.post('/user/update', form)
}

function getLimitDay() {
  return axios.get('/user/isLimitDay')
}

async function deleteApply(id) {
  const res = await axios.post('/user/delete', { id })
  if (res.data.code === 200) return true
  else return false
}

async function withdrawApply(id) {
  const res = await axios.post('/user/recall', { id })
  if (res.data.code === 200) return true
  else return false
}

async function getDetails(id) {
  const res = await axios.get(`/user/songDetails?id=${id}`)
  return res
}

export {
  userLogin,
  submitRequest,
  updateRequest,
  getLimitDay,
  deleteApply,
  withdrawApply,
  getDetails
}
