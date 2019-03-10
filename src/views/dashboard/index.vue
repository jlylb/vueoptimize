<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import dialogPage from '@/views/common/components/dialogPage'
import posts from '../post/layoutadd'

export default {
  name: 'dashboard',
  components: { adminDashboard, dialogPage, posts },
  data() {
    return {
      currentRole: 'adminDashboard',
      dvisible: true,
      dialogProps: {
       closeOnClickModal: false
      },

    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {

  }
}
</script>
