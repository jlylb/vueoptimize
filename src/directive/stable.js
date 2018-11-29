import Vue from 'vue'

export default {
  bind: (el, binding, vnode) => {
    const { data } = vnode.context
    console.log(vnode)

    Vue.nextTick(() => {
      const wrapper = vnode.child.bodyWrapper
      const isFindDom = wrapper.querySelector('.el-table__empty-block')
      isFindDom.style.cssText = 'width: 100%;'
      const { $el, data } = vnode.child
      const addClass = 'no-data'
      if (data.length === 0) {
        $el.className = $el.className + ' ' + addClass
      } else {
        $el.className = $el.className.replace(' ' + addClass, '')
      }
    })
  },
  inserted(el, binding, vnode) {},
  update: (el, binding, vnode) => {
    // const { data } = vnode.context
    // console.log(vnode)
    // Vue.nextTick(() => {
    // })
  },
  componentUpdated: (el, binding, vnode) => {},
  unbind: el => {}
}
