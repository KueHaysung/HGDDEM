export function downsampleToVoxels(raster, width, height, voxelSize) {
    const voxels = [];
    const step = voxelSize;
  
    // 找到栅格的最小和最大值，用于空间归一化
    const minZ = Math.min(...raster.filter(v => !isNaN(v)));
    const maxZ = Math.max(...raster.filter(v => !isNaN(v)));
  
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = y * width + x;
        const value = raster[index];
  
        // 忽略无效值
        if (value === undefined || isNaN(value)) continue;
  
        // 归一化高度
        const normalizedZ = ((value - minZ) / (maxZ - minZ)) * 100; // 高度映射到 0-100
  
        // 生成从 z = 0 到 z = normalizedZ 的所有体素
        for (let z = 0; z <= normalizedZ; z += step) {
          voxels.push({ x, y, z });
        }
      }
    }
  
    return voxels;
  }
  