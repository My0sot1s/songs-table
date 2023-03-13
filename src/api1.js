import http from '@/request1.js'
/* import formatDate from '@/tools/FormatDate'
import Vue from 'vue' */

export function userLogin(code) {
  return http.post('/user/login', { code })
}

export function adminLogin(code) {
  return http.post('/admin/login', { code })
}

export function myApplication() {
  return http.get('/user/myApplication')
}

export function submitRequest(form) {
  return http.post('/user/submit', form)
}
