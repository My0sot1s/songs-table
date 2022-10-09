// 封装axios
import theAxios from 'axios'
const axios = theAxios.create({
  baseURL: '',
  timeout: 20000
})
// 请求拦截
axios.interceptors.request.use(function (config) {
  return config
})

// 响应拦截
axios.interceptors.response.use(
  function (response) {
    return response
  },
  async (error) => {
    console.dir(error)
  }
)
export default ({
  url,
  method = 'GET',
  params = {},
  data = {},
  headers = {},
  baseURL = axios.baseURL
}) => {
  return axios({
    url,
    method,
    params,
    data,
    headers,
    baseURL
  })
}
