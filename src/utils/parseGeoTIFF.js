import GeoTIFF from "geotiff";
import * as Cesium from "cesium";

// 解析GeoTIFF并转换为Cesium HeightmapTerrainData
export async function parseGeoTIFF(file) {
  const tiff = await GeoTIFF.fromUrl(file);
  const image = await tiff.getImage();
  
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters({ interleave: true });

  // 将高度数据转换为Cesium支持的格式
  const heightData = new Float32Array(values);
  
  return new Cesium.HeightmapTerrainData({
    buffer: heightData,
    width: width,
    height: height,
  });
}
