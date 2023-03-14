import http from '@/request/request1.js'
import { Toast } from 'vant'

const QQMusicBaseUrl = 'https://qqmusicapi.sends.cc'
const NetEaseCloudBaseUrl = 'https://neteasecloudmusicapi.sends.cc'

export class MusicObject {
  constructor(song, searchPath) {
    this.searchPath = searchPath
    if (searchPath === 'qq') {
      this.name = song.name
      this.songmid = song.songmid
      this.singers = song.singer.map((item) => item.name).join(' / ')
      this.cover = `https://y.qq.com/music/photo_new/T002R300x300M000${song.albummid}_1.jpg?max_age=2592000`
      this.listenUrl = `https://y.qq.com/n/ryqq/songDetail/${song.mid}`
    } else if (searchPath === '网易云') {
      this.name = song.name
      this.songmid = song.id
      this.singers = song.ar.map((item) => item.name).join(' / ')
      this.cover = song.al.picUrl
    }
  }
}

export async function searchQQMuic(key) {
  const [err, res] = await http.get('https://qqmusicapi.sends.cc/search', {
    key
  })
  if (!err) {
    console.log('qq', res)
    const list = res.list.map((song) => new MusicObject(song, 'qq'))
    return [null, list]
  } else {
    Toast.fail(err)
    return [err, undefined]
  }
}

export async function searchCloudMuic(keywords) {
  const [err, res] = await http.get(
    'https://neteasecloudmusicapi.sends.cc/search',
    { keywords }
  )
  if (!err) {
    console.log('cloud', res)
    const list = res.songs.map((song) => new MusicObject(song, '网易云'))
    return [null, list]
  } else {
    Toast.fail(err)
    return [err, undefined]
  }
}

export function QQMusicDetail(ids) {
  // ids = '004Z8Ihr0JIu5s'
  return http.get(`${QQMusicBaseUrl}/song?songmid=${ids}`)
}
/*
网易云获取歌曲信息
data.songs[0].name是歌名
data.songs[0].ar[i].name是歌手名，可能有多个歌手，ar是个数组
data.songs[0].al.picUrl是专辑封面
data.songs[0].al.name是专辑名
*/
export function NetEaseCloudDetail(ids) {
  return http.get(`${NetEaseCloudBaseUrl}/song/detail`, { ids })
}

export function GetMusicDetail(source, id) {
  if (source === '网易云') {
    return NetEaseCloudDetail(id)
  } else if (source === 'qq') {
    return QQMusicDetail(id)
  } else throw Error('未知来源')
}
