// api/axiosInstance.ts
import axios from 'axios'

// 建立 axios 實例
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 改成你的後端 API 路徑
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器：自動加入 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api