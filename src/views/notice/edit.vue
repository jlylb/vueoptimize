<template>
    <my-form
    :form-columns='formColumns'></my-form>
</template>

<script>
import MyForm from '../common/components/myform'

export default {
  components: { MyForm },
  data() {
    return {
      formColumns: [
        { name: 'name', label: '用户名' },
        {
          name: 'status',
          label: '消息等级',
          type: 'select',
          data: [
            { value: 1, label: '一般' },
            { value: 2, label: '警告' },
            { value: 3, label: '严重' },
            { value: 4, label: '紧急' },
            { value: 5, label: '加急' }
          ],
          props: {
            clearable: true,
            placeholder: '请选择'
          }
        },
        {
          name: 'created_at',
          label: '发送时间',
          type: 'date',
          datatype: 'date'
        }
      ]
    }
  }
}
</script>

