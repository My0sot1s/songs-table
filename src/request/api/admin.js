import { axios } from '../config'

function adminLogin(name, password) {
  return axios.post('/admin/login', {
    name,
    password
  })
}

function passOrNot(url, data) {
  return axios.post(url, data)
}

function getSongsDetail(id) {
  return axios.get(`/admin/songDetails?id=${id}`)
}

function limitTime({ startTime, reason, endTime }) {
  return axios.post('/admin/limitTime', { startTime, reason, endTime })
}

function limitInfo() {
  return axios.get('/admin/limitInfo')
}

function submit(form) {
  return axios.post('/admin/submit', form)
}

export {
  adminLogin,
  passOrNot,
  getSongsDetail,
  limitTime,
  limitInfo,
  submit
}
