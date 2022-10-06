export default function formatDate(dateObj) {
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const date = dateObj.getDate()
  const week = dateObj.toDateString().split(' ')[0]
  let recent = ''
  switch (new Date().getDate() - date) {
    case -1:
      recent = '明日'
      break
    case 0:
      recent = '今日'
      break
    case 1:
      recent = '昨日'
      break
  }
  return `${recent} ${year}-${month}-${date} ${week}`
}
