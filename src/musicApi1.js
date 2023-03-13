import http from '@/request1.js'

export function searchQQMuic(key) {
  return http.get('https://qqmusicapi.sends.cc/search', { key })
}

export function searchCloudMuic(keywords) {
  return http.get('https://neteasecloudmusicapi.sends.cc/search', { keywords })
}
