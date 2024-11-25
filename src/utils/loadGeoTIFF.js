import { fromUrl } from 'geotiff';

export async function loadGeoTIFF(url) {
  const tiff = await fromUrl(url);
  const image = await tiff.getImage();
  
  // 获取栅格数据
  const [raster] = await image.readRasters({ samples: [0] });

  const width = image.getWidth();
  const height = image.getHeight();

  return { raster, width, height };
}

