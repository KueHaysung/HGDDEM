<template>
  <div ref="container" style="width: 100%; height: 100%;"></div>
  <div class="sidebar">
    <h3>坐标输入</h3>

    <div class="input-group">
      <h4>出发点</h4>
      <label>X: <input v-model="start.x" type="number" /></label>
      <label>Y: <input v-model="start.y" type="number" /></label>
      <label>Z: <input v-model="start.z" type="number" /></label>
    </div>

    <div class="input-group">
      <h4>目的地</h4>
      <label>X: <input v-model="end.x" type="number" /></label>
      <label>Y: <input v-model="end.y" type="number" /></label>
      <label>Z: <input v-model="end.z" type="number" /></label>
    </div>

    <button @click="addCoordinates">添加</button>
  </div>
  
</template>

<script>
import { onMounted, ref } from 'vue';
import { loadGeoTIFF } from '../utils/loadGeoTIFF';
import { downsampleToVoxels } from '../utils/downsampleToVoxels';
import { createScene } from '../utils/createScene';
import { addVoxelsToScene } from '../utils/addVoxelsToScene';

export default {
  setup() {
    const container = ref(null);
    const start = ref({ x: 0, y: 0, z: 0 }); // 出发点坐标
    const end = ref({ x: 0, y: 0, z: 0 });   // 目的地坐标1

    // 添加坐标逻辑
    const addCoordinates = () => {
      console.log('出发点:', start.value);
      console.log('目的地:', end.value);
      // 在这里添加具体的业务逻辑处理，例如将坐标传递给 3D 场景
    };

    onMounted(async () => {
      const { raster, width, height } = await loadGeoTIFF('../../public/B.tif');
      const voxels = downsampleToVoxels(raster, width, height, 10);

      const { scene } = createScene(container.value);
      addVoxelsToScene(scene, voxels);
    });

    return { container, start, end, addCoordinates };
  },
};
</script>

<style>
body,
html,
#app {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>