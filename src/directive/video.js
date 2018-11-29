import Vue from 'vue'
import GrindSwf from '@/assets/swf/GrindPlayer.swf'

// let player

const prefix = 'GrindPlayer'
let i = 1
// const SWFS = []

const jsbridge = (playerId, event, data) => {
  // if (player == null) {
  //   player = document.getElementById(playerId)
  // }
  switch (event) {
    case 'onJavaScriptBridgeCreated':
      console.log(event, data)
      break
    case 'timeChange':
    case 'timeupdate':
    case 'progress':
      break
    default:
      console.log(event, data)
  }
}

const createSWF = function(el, binding) {
  const { url } = binding.value
  let { wmode, width, height } = binding.value
  const parameters = {
    src: url,
    autoPlay: 'true',
    verbose: true,
    controlBarAutoHide: 'true',
    controlBarPosition: 'bottom',
    javascriptCallbackFunction: jsbridge,
    scaleMode: 'stretch'
  }

  wmode = wmode || 'direct'
  width = width || 640
  height = height || 400

  const wmodeOptions = ['direct', 'opaque', 'transparent', 'window']
  if (wmodeOptions.indexOf(wmode) < 0) {
    throw new Error(wmodeOptions.join(','))
  }
  const id = `${prefix}${i++}`
  el.id = id
  Vue.nextTick(() => {
    swfobject.embedSWF(
      GrindSwf,
      id,
      width,
      height,
      '10.1.0',
      null,
      parameters,
      {
        allowFullScreen: 'true',
        wmode: wmode
      },
      {
        name: id,
        class: 'video-item'
      }
    )
  })
}

const afterSet = (w, curIndex) => {
  const index = curIndex
  const id = `${prefix}${index}`
  document.getElementById(id).width = w
}
let isDelete = false
const deleteSet = (sNUM, delNum) => {
  if (sNUM > delNum) {
    return
  }
  console.log(isDelete, 'deleting............')
  if (isDelete) {
    return
  }

  for (let i = sNUM; i <= delNum; i++) {
    const id = `${prefix}${i}`
    const curNode = document.getElementById(id)
    if (curNode) {
      curNode.parentNode.removeChild(curNode)
    }
  }
  isDelete = true
}
const suffix = id => {
  return id.replace(prefix, '')
}

export default {
  bind: (el, binding) => {
    createSWF(el, binding)
  },
  inserted(el, binding, vnode) {},
  update: (el, binding, vnode) => {
    const { data } = vnode.context
    console.log(binding, 'updating.....', vnode, data, suffix(el.id), i)
    const len = data.length
    const { width } = binding.value
    Vue.nextTick(() => {
      afterSet(width, suffix(el.id))
      deleteSet(len + 1, 8)
    })
  },
  componentUpdated: (el, binding, vnode) => {},
  unbind: el => {
    if (i > 1) {
      i--
    } else {
      i = 1
    }
    isDelete = false
  }
}
