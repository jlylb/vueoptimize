export const warnLevel = () => {
  return {
    1: { lvl: '一级告警', class: 'lvl1' },
    2: { lvl: '二级告警', class: 'lvl2' },
    3: { lvl: '三级告警', class: 'lvl3' },
    4: { lvl: '四级告警', class: 'lvl4' }
  }
}

export const warnClass = val => {
  return warnLevel()[val] && warnLevel()[val]['class'] || ''
}

export default {}
