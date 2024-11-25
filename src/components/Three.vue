<template>
    <div ref="rendererContainer" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as THREE from "three";
import * as GeoTIFF from "geotiff";
import { onMounted, onUnmounted, ref } from "vue";
export default {
    name: "TiffViewer",
    setup() {
        const rendererContainer = ref(null);

        let scene, camera, renderer;

        const initThree = () => {
            scene = new THREE.Scene();
            const aspect = window.innerWidth / window.innerHeight;
            camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
            camera.position.set(0, 0, 10);

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            rendererContainer.value.appendChild(renderer.domElement);

            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(10, 10, 10);
            scene.add(light);
        };

        const colorMap = [
            { min: 0, max: 50, color: new THREE.Color(0, 0, 1) }, // 蓝色
            { min: 51, max: 100, color: new THREE.Color(0, 1, 0) }, // 绿色
            { min: 101, max: 150, color: new THREE.Color(1, 1, 0) }, // 黄色
            { min: 501, max: 1000, color: new THREE.Color(1, 0, 0) }, // 红色
        ]; 

        const loadTiff = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch TIFF file. Status: ${response.status}`);
                }
                
                const arrayBuffer = await response.arrayBuffer();
                const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
                const image = await tiff.getImage();

                const width = image.getWidth();
                const height = image.getHeight();
                const data = await image.readRasters();

                const geometry = new THREE.BufferGeometry();
                const positions = [];
                const colors = [];
                console.log("DEM Data:", { width, height, data });
                console.log(data[0].length);

                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const value = data[0][y * width + x];
                        const normalizedValue = value / 65535;

                        positions.push(x, -y, normalizedValue * 10);

                        // 根据高程值选择颜色
                        const color = getColorFromValue(normalizedValue * 10);
                        colors.push(color.r, color.g, color.b);
                    }
                }

                geometry.setAttribute(
                    "position",
                    new THREE.Float32BufferAttribute(positions, 3)
                );
                geometry.setAttribute(
                    "color",
                    new THREE.Float32BufferAttribute(colors, 3)
                );

                const material = new THREE.PointsMaterial({
                    vertexColors: true,
                    size: 0.1,
                });
                const points = new THREE.Points(geometry, material);
                scene.add(points);
            } catch (error) {
                console.error("Error loading TIFF file:", error);
                alert("Failed to load TIFF file: " + error.message);
            }
        };

        // 根据高程值获取对应的颜色
        const getColorFromValue = (elevation) => {
            for (let i = 0; i < colorMap.length; i++) {
                if (elevation >= colorMap[i].min && elevation <= colorMap[i].max) {
                    return colorMap[i].color;
                }
            }
            return new THREE.Color(1, 1, 1); // 默认颜色（白色），如果高程值不在定义的范围内
        };

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        onMounted(() => {
            initThree();
            loadTiff("http://localhost:12345/IPCLiveServer/dem/output.tif");
            animate();
        });

        onUnmounted(() => {
            renderer.dispose();
        });

        return { rendererContainer };
    },
};
</script>

<style>
html,
body,
#app {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>