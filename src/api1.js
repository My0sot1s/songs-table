import http from '@/request/request1.js'
/* import formatDate from '@/tools/FormatDate'
import Vue from 'vue' */

/* 登录 */
export function userLogin(code) {
  return http.post('/user/login', { code })
}
export function adminLogin(code) {
  return http.post('/admin/login', { code })
}

/* 首页 */
export function getLimitDay() {
  return http.get('/user/isLimitDay')
}

export function myApplication() {
  return http.get('/user/myApplication')
}

export function submitRequest(form) {
  return http.post('/user/submit', form)
}
