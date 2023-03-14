import http from '@/request/request1.js'
/* 登录 */
export function userLogin(code) {
  return http.post('/user/login', { code })
}

/* 首页 */
export function getLimitDay() {
  return http.get('/user/isLimitDay')
}

/* 表单 */
export function submitRequest(form) {
  return http.post('/user/submit', form)
}
export function updateRequest(form) {
  return http.post('/user/update', form)
}

export function deleteApply(id) {
  return http.post('/user/delete', { id })
}

export function withdrawApply(id) {
  return http.post('/user/recall', { id })
}

export function getDetails(id) {
  return http.get(`/user/songDetails?id=${id}`)
}
