
import store from '@/store'

function checkAbility(value) {
  const roles = store.getters && store.getters.roles
  if (roles.indexOf('superadmin') > -1) {
    return true
  }
  const abilities = store.getters && store.getters.abilities
  const permissionAbility = value
  let hasPermission
  if (permissionAbility) {
    hasPermission = abilities.indexOf(permissionAbility) > -1
  } else {
    hasPermission = false
  }
  return hasPermission
}

// if (!hasPermission) {
//   el.parentNode && el.parentNode.removeChild(el)
// }
export default{
  inserted(el, binding, vnode) {
    const { value } = binding
    el.style.display = checkAbility(value) ? 'inline-block' : 'none'
  },
  update(el, binding) {
    const { value, oldValue } = binding
    console.log(value, oldValue, 888888)
    if (value === oldValue) {
      return false
    }
    el.style.display = checkAbility(value) ? 'inline-block' : 'none'
  }
}
