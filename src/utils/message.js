import { Message } from 'element-ui'

export default function openMessage(res) {
  const status = res.data.status === 1 ? 'success' : 'error'
  Message({
    message: res.data.msg,
    type: status,
    duration: 5 * 1000
  })
  return new Promise(resolve => {
    if (res.data.status === 1) {
      resolve()
    }
  })
}
