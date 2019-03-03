<template>
    <el-select v-model="formModel" @change="schange" :placeholder="placeholder">
        <el-option v-for="item in pdata" :value="item.value" :label="item.label" :key="item.value"></el-option>
    </el-select>
</template>

<script>
import { getDataValue } from '@/utils';
export default {
props: {
    data: {
        type: [Array, Object],
        default() {
            return []
        }
    },
    source: {
        type: [Array, Object],
        default() {
            return {}
        }
    },
    link: {
        type: [Array],
        default() {
            return []
        }
    },
    placeholder: {
        type: [String],
        default: ''
    },
    value: [String, Number]
},
data() {
    return {
        formModel: null,
        pdata: this.data
    }
},
methods: {
    schange(val, init=false) {
       console.log('schange...........')
        this.formModel = val
        this.$emit('input', val)
         this.setData(val, init)
    },
    setData(val, init) {
        let nval = val
        const refs = this.$parent.$refs
        let nlink = init?(this.link[0]?[this.link[0]]:[]):this.link
        console.log('schange...........', nlink)
        nlink.forEach(item=>{
            let curref = refs[item]||null
            if(curref) {
                curref.pdata = curref['source'][nval]
                nval = getDataValue(curref.pdata, [0, 'value'])
                curref.formModel = (init&&curref.value)?curref.value:nval
                curref.$emit('input', curref.formModel)
            }
        })
    },

},
mounted(){
    this.schange(this.value, true)
}
}
</script>

<style>

</style>
