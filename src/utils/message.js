import { Message } from 'element-ui'

export default function openMessage(res) {
  const { status = 0, msg = '未知错误' } = res.data || {}
  const statusType = status === 1 ? 'success' : 'error'
  Message({
    message: msg,
    type: statusType,
    duration: 5 * 1000
  })
  return new Promise((resolve, reject) => {
    if (status === 1) {
      resolve()
    } else {
      reject(res)
    }
  })
}
