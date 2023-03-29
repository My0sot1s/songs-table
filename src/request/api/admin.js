import http from '@/request/request'

export function adminLogin(code) {
  return http.post('/admin/login', { code })
}

export function passOrNot(url, data) {
  return http.post(url, data)
}

export function getSongsDetail(id) {
  return http.get(`/admin/songDetails?id=${id}`)
}

export function limitTime({ startTime, reason, endTime }) {
  return http.post('/admin/limitTime', { startTime, reason, endTime })
}

export function limitInfo() {
  return http.get('/admin/limitInfo')
}

export function submit(form) {
  return http.post('/admin/submit', form)
}

export function getSongNotice() {
  return http.get('/admin/songNotice')
}

export function getHomeNotice() {
  return http.get('/admin/homeNotice')
}

export function publishHomeNotice(notice) {
  return http.post('/admin/publishHomeNotice', { notice })
}

export function publishSongNotice(notice) {
  return http.post('/admin/publishSongNotice', { notice })
}

export function adminList() {
  return http.get('/admin/adminList')
}

export function deleteAdmin(stuNum) {
  return http.post('/admin/deleteAdmin', { stu_num: stuNum })
}

export function addAdmin(form) {
  return http.post('/admin/addAdmin', form)
}
