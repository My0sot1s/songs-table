import { request as axios } from '@/request.js'

export const submitRequest = (form) =>
  axios({
    method: 'POST',
    url: '/user/submit',
    data: form
  })

export const updateRequest = (form) =>
  axios({
    method: 'POST',
    url: '/user/update',
    data: form
  })
