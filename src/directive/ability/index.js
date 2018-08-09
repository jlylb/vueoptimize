import ability from './permission'

const install = function(Vue) {
  Vue.directive('ability', ability)
}

if (window.Vue) {
  window['ability'] = ability
  Vue.use(install); // eslint-disable-line
}

ability.install = install
export default ability
