<template>
   <div class='table-layout'>
      <div class='table-inner'>
            <device-card class='running-custom'>

                <device-component 
                    v-for='(item, index) in data' 
                    :key='index'
                    :is-active='index==videoIndex'
                    @click.native='handleVideo(index, item)' 
                    icon-name="video">

                     设备编号: {{ item.pdi_index }}
                </device-component>

            </device-card>
            <div class='video'>
              <video-player :src='curSrc'  controls='controls'></video-player>
            </div>
      </div>
   </div>
</template>

<script>
import { fetchList } from '@/api/video'
import DeviceComponent from '@/components/deviceComponent'
import DeviceCard from '@/components/device'
import VideoPlayer from './VideoPlayer'
import movie1 from '@/assets/movie.ogg'

export default {
  components: { DeviceComponent, DeviceCard, VideoPlayer },
  data() {
    return {
      data: [],
      curSrc: movie1,
      videoIndex: 0,
      
    }
  },
  methods: {
    getList(query) {
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data
      }).catch((res) => {})
    },
    handleVideo(index, item) {
      this.videoIndex = index
      this.curSrc = ''
    },
  },
  created() {
    this.getList();
  }
}
</script>

<style lang="scss" scoped>
.table-inner {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
}
.video {
  text-align: center;
  padding: 10px 0;
}
</style>
