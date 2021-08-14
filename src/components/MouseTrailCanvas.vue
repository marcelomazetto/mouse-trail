<template>
    <canvas ref="canvas"></canvas>
</template>

<script>
import { MouseTrail } from '../classes/MouseTrail'

export default {
    name: 'MouseTrailCanvas',
    mounted() {
        this.mouseTrail = new MouseTrail(this.$refs["canvas"]);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
    background-color: #1f1f1f;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
}
</style>
