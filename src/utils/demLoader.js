import { fromUrl } from "geotiff";

export async function loadDemData(url) {
  const tiff = await fromUrl(url);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const data = await image.readRasters({ interleave: true });
  return { width, height, data };
}
