import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

export function checkAbility(value) {
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

