<script>
export default {
  functional: true,
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    render: {
      type: Function,
      default: () => {}
    }
  },
  render(h, params) {
    const render = params.props.render
    console.log(render)
    // if (render) return render(h,params.props.data)
    // return params.props.data.column.renderCell(h,params.props.data)
  }
}
</script>
