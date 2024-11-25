import { Color } from "cesium";  // 确保从 Cesium 导入 Color

export function getColorFromHeight(height) {
  if (height <100) return Color.BLUE;
  if (height < 150) return Color.GREEN;
  if (height < 200) return Color.YELLOW;
  return Color.RED;
}