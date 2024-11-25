<template>
  <div id="cesiumContainer" style="width: 100%; height: 100vh;"></div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import * as Cesium from "cesium";
import * as GeoTIFF from "geotiff";

export default defineComponent({
  name: "CesiumViewer",
  setup() {

    // 初始化 Cesium Viewer
    const initCesium = () => {
      const viewer = new Cesium.Viewer('cesiumContainer', {});

      // 开启帧率
      viewer.scene.debugShowFramesPerSecond = true;

      // 清除默认地形
      viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});

      // 加载火星地形
      // viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      //   url: 'http://data.mars3d.cn/terrain'
      // });

      加载本地地形
      viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
          url: "http://localhost:12345/IPCLiveServer/dem/output.tif"
      });



    };
    



    // 组件挂载后初始化 Cesium 并加载 DEM 数据
    onMounted(() => {
      initCesium();
      // loadAndRenderDem();
    });

    return {};
  },
});
</script>

<style>
@import "cesium/Build/Cesium/Widgets/widgets.css";
</style>
