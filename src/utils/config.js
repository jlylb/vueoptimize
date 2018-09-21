export const warnLevel = () => {
  return {
    1: { lvl: '一级报警', class: 'lvl1' },
    2: { lvl: '二级报警', class: 'lvl2' },
    3: { lvl: '三级报警', class: 'lvl3' },
    4: { lvl: '四级报警', class: 'lvl4' }
  }
}

export const warnClass = val => {
  return warnLevel()[val]['class']
}

export default {}
