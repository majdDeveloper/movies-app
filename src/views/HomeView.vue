<template>
  <div class="home">
    <MainComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import MainComponent from '@/components/MainComponent.vue'

export default {
  name: 'HomeView',
  components: {
    MainComponent
  }
}
</script>
