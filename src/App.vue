<template>
  <div id="app">
    <MouseTrailCanvas />
  </div>
</template>

<script>
import MouseTrailCanvas from './components/MouseTrailCanvas.vue'

export default {
  name: 'App',
  components: {
    MouseTrailCanvas
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
