import http from '@/request/request1'

export function adminLogin(name, password) {
  return http.post('/admin/login', {
    name,
    password
  })
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
