<template>
    <div class='table-layout'>
        <el-form ref="form" :model="formModel" label-width="80px">
            <el-card class="box-card" shadow="hover">
                <div  class="text item">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" border>全选</el-checkbox>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                </div>
            </el-card>   
            <el-card class="box-card" shadow="hover" v-for='(items, key) in allAbility' :key='key'>
                <div slot="header" class="clearfix">
                    <el-checkbox :indeterminate="indeterminate[key]" v-model="itemModel[key]" @change="itemCheckAllChange($event,key)" border>全选</el-checkbox>
                    <span>{{ key   }}</span>
                </div>
                <div  class="text item">
                    <el-checkbox-group v-model="formModel[key]" @change="handleCheckedChange($event,key)">
                        <el-checkbox v-for="item in items" :label="item.value" :key="item.value">{{ item.label  }}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-card>
        </el-form>
    </div>
</template>

<script>
import { fetchRoleAlibity, saveRoleAlibity } from '@/api/roles'
export default {
  data() {
    return {
      allAbility: {},
      roleAbility: {},
      formModel: {
      },
      checkAll: false,
      isIndeterminate: true,
      itemModel: {},
      indeterminate: {},
      desc: {}
    }
  },
  computed: {
    selectedAll: {
      get: function() {
        let flag = true
        for (const item in this.itemModel) {
          if (!this.itemModel[item]) {
            flag = false
            break
          }
        }
        return flag
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.formModel)
      let ability = []
      for (const item in this.formModel) {
        ability = ability.concat(this.formModel[item])
      }
      console.log(ability, this.$route.params.role)
      saveRoleAlibity(this.$route.params.role, { ability })
        .then((res) => {
          this.$message({
            type: 'success',
            message: '授权成功'
          })
        })
        .catch((res) => {
          console.log(res)
        })
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      let model = {}, itemModel = {}, indeterminate = {}
      if (!val) {
        for (const key in this.allAbility) {
          model[key] = []
          itemModel[key] = false
          indeterminate[key] = true
        }
      } else {
        for (const key in this.allAbility) {
          model[key] = this.selectItemAll(this.allAbility[key])
          itemModel[key] = true
          indeterminate[key] = false
        }
      }
      this.formModel = model
      this.itemModel = itemModel
      this.indeterminate = indeterminate
    },
    handleCheckedChange(val, key) {
      console.log(val, key)
      const checkedCount = val.length
      this.itemModel[key] = checkedCount === this.allAbility[key].length
      this.indeterminate[key] = checkedCount > 0 && checkedCount < this.allAbility[key].length
      this.checkAll = this.selectedAll
      this.isIndeterminate = !this.selectedAll
    },
    itemCheckAllChange(val, key) {
      this.itemModel[key] = val
      this.checkAll = this.selectedAll
      this.isIndeterminate = !this.selectedAll
      console.log(this.checkAll, this.itemModel)
      this.$set(this.indeterminate, key, false)
      let itemValue
      if (val) {
        itemValue = this.selectItemAll(this.allAbility[key])
      } else {
        itemValue = []
      }
      this.$set(this.formModel, key, itemValue)
    },
    selectItemAll(data) {
      const selectItem = []
      data.forEach((item) => {
        selectItem.push(item.value)
      })
      return selectItem
      // this.$set(this.formModel, item, selectItem)
    }
  },
  created() {
    fetchRoleAlibity(this.$route.params.role).then((res) => {
      this.allAbility = res.data.data.all
      this.desc = res.data.data.desc
      let model = {}, itemModel = {}
      const indeterminate = {}
      for (const key in this.allAbility) {
        model[key] = []
        indeterminate[key] = true
        itemModel[key] = false
      }
      this.roleAbility = res.data.data.roleAbility
      console.log(this.roleAbility)
      for (const key in this.roleAbility) {
        console.log(key)
        model[key] = this.selectItemAll(this.roleAbility[key])
        itemModel[key] = this.allAbility[key].length === this.roleAbility[key].length
        indeterminate[key] = !itemModel[key]
      }
      this.formModel = model
      this.indeterminate = indeterminate
      this.itemModel = itemModel
      this.checkAll = this.selectedAll
      this.isIndeterminate = !this.selectedAll

      console.log(this.formModel)
    }).catch((res) => {
      console.log(res)
    })
  }
}
</script>

<style lang='scss' scoped>
.box-card {
  margin-bottom: 10px;
}
</style>
