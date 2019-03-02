<template>
    <el-dialog :title="label" :visible.sync="visible" @open='dialogOpen' @close="dialogClose" v-bind="dialogProps">
         <slot>
         </slot>
    </el-dialog>
</template>

<script>

export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: "标题"
        },
        dialogProps: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            visible: this.value
        }
    },
    methods: {
        dialogOpen() {
            this.$emit("input", true)
        },
        dialogClose() {
           this.$emit("input", false) 
        }
    },
    render(h, data) {
        return h('div', this.$slots.default)
    },
    mounted() {

    },
    created(){
      
    }
}
</script>

<style>

</style>
