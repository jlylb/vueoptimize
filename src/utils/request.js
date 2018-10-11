import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '../router'
// import { debounce } from '@/utils'
// create an axios instance
const service = axios.create({
  baseURL: '/api', // api的base_url
  // timeout: 5000, // request timeout
  showLoading: true
})

let loading

function startLoading() {
  loading = Loading.service({
    target: '.table-layout',
    lock: true,
    text: '加载中……'
    // background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {
  loading.close()
}

let needLoadingRequestCount = 0

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

// const tryCloseLoading = () => {
//   if (needLoadingRequestCount === 0) {
//     loading.close()
//   }
// }

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    }
    // if (config.showLoading) {
    //   showFullScreenLoading()
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)
/**
 * 下面的注释为通过在response里，自定义code来标示请求状态
 * 当code返回如下情况则说明权限有问题，登出并返回到登录页
 * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
 * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
 */
// response => {
//   const res = response.data
//   if (res.code !== 20000) {
//     Message({
//       message: res.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//       // 请自行在引入 MessageBox
//       // import { Message, MessageBox } from 'element-ui'
//       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//         confirmButtonText: '重新登录',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }).then(() => {
//         store.dispatch('FedLogOut').then(() => {
//           location.reload() // 为了重新实例化vue-router对象 避免bug
//         })
//       })
//     }
//     return Promise.reject('error')
//   } else {
//     return response.data
//   }
// },
// respone interceptor
service.interceptors.response.use(
  response => {
    // const res = response.data
    // if (res.code !== 4001) {
    //   Message({
    //     message: res.msg,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // }
    // if (response.config.showLoading) {
    //   tryHideFullScreenLoading()
    // }
    return response
  },

  error => {
    const res = error.response
    let errorMsg = error.message
    console.log(error, res, router.to)
    // endLoading()
    if (res.status === 401) {
      MessageBox.confirm('验证失败或账号已失效，请重新登录!', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
      return Promise.reject(error)
    }
    if (res.status === 422) {
      for (const msgKey in res.data) {
        errorMsg = res.data[msgKey][0]
        break
      }
    }
    if (res.status === 403) {
      errorMsg = '用户没有权限'
    }
    if (res.status === 500) {
      errorMsg = '服务器程序运行异常,请联系管理员'
    }
    console.log('err' + error) // for debug
    Message({
      message: errorMsg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
