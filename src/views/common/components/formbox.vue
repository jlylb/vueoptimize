<template>
    <div class='form-box'>
        
        <div class='form-box-header'>
            <slot name='header'>
                <slot name='headerTitle'>
                    <span>标题</span>
                </slot>
                <el-button 
                class='header-button' 
                type="text"
                @click='toggelBody' 
                :icon='icon'></el-button>
            </slot>
        </div>
        
        <div class='form-box-body' v-show='isShow'>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isShow: true,
            icon: 'el-icon-minus'
        }
    },
    methods: {
        toggelBody() {
            this.isShow = !this.isShow
            this.icon = this.isShow ? 'el-icon-minus' : 'el-icon-plus'
        },
        setButtonIcon(icon) {
            this.icon = icon
        },
        setShow(isShow) {
            this.isShow = isShow
        }
    }

}
</script>

<style lang='scss' scoped>

.header-button {
    float: right;
    padding: 3px 0;
}

.form-box {
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #ebeef5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    color: #303133;
}
.form-box-header {
    padding: 18px 20px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
}

.form-box-body {
    padding: 20px;
}

</style>
