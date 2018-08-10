import { debounce } from '@/utils'

export default {
  mounted() {
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        console.log('resize')
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHanlder)
  }
}
