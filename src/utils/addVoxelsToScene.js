import * as THREE from "three";

export function addVoxelsToScene(scene, voxels) {
  const geometry = new THREE.BoxGeometry(10, 10, 10);

  const minZ = Math.min(...voxels.map((v) => v.z));
  const maxZ = Math.max(...voxels.map((v) => v.z));
  scene.background = new THREE.Color(0x808080); // 灰色
  const voxelMap = new Map();
  const objects = [
    {
      id: 0,
      startStep: 0,
      start: {
        x: voxels[voxels.length - 5].x,
        y: voxels[voxels.length - 5].y,
        z: voxels[voxels.length - 5].z,
      },
      goal: { x: voxels[0].x, y: voxels[0].y, z: voxels[0].z },
    },
    {
      id: 1,
      startStep: 0,
      start: { x: voxels[0].x, y: voxels[0].y, z: voxels[0].z },
      goal: {
        x: voxels[voxels.length - 1].x,
        y: voxels[voxels.length - 1].y,
        z: voxels[voxels.length - 1].z,
      },
    },
    {
      id: 2,
      startStep: 0,
      start: { x: voxels[1].x, y: voxels[1].y, z: voxels[1].z },
      goal: {
        x: voxels[voxels.length - 2].x,
        y: voxels[voxels.length - 2].y,
        z: voxels[voxels.length - 2].z,
      },
    },
    {
      id: 3,
      startStep: 0,
      start: { x: voxels[2].x, y: voxels[2].y, z: voxels[2].z },
      goal: {
        x: voxels[voxels.length - 3].x,
        y: voxels[voxels.length - 3].y,
        z: voxels[voxels.length - 3].z,
      },
    },
    {
      id: 4,
      startStep: 0,
      start: { x: voxels[3].x, y: voxels[3].y, z: voxels[3].z },
      goal: {
        x: voxels[voxels.length - 4].x,
        y: voxels[voxels.length - 4].y,
        z: voxels[voxels.length - 4].z,
      },
    },

    {
      id: 5,
      startStep: 0,
      start: {
        x: voxels[voxels.length - 61].x,
        y: voxels[voxels.length - 61].y,
        z: voxels[voxels.length - 61].z,
      },
      goal: { x: voxels[15].x, y: voxels[15].y, z: voxels[15].z },
    },
    {
      id: 6,
      startStep: 0,
      start: {
        x: voxels[voxels.length - 171].x,
        y: voxels[voxels.length - 171].y,
        z: voxels[voxels.length - 171].z,
      },
      goal: { x: voxels[16].x, y: voxels[16].y, z: voxels[16].z },
    },
    {
      id: 7,
      startStep: 0,
      start: {
        x: voxels[voxels.length - 83].x,
        y: voxels[voxels.length - 83].y,
        z: voxels[voxels.length - 83].z,
      },
      goal: { x: voxels[771].x, y: voxels[771].y, z: voxels[771].z },
    },
    {
      id: 8,
      startStep: 0,
      start: {
        x: voxels[voxels.length - 81].x,
        y: voxels[voxels.length - 81].y,
        z: voxels[voxels.length - 81].z,
      },
      goal: { x: voxels[11].x, y: voxels[11].y, z: voxels[11].z },
    },
    {
      id: 9,
      startStep: 0,
      start: {
        x: voxels[voxels.length - 40].x,
        y: voxels[voxels.length - 40].y,
        z: voxels[voxels.length - 40].z,
      },
      goal: { x: voxels[471].x, y: voxels[471].y, z: voxels[471].z },
    },
  ];
  // 随机添加20条起终点
  for (let i = 0; i < 50; i++) {
    const randomStartIndex = Math.floor(Math.random() * voxels.length);
    const randomGoalIndex = Math.floor(Math.random() * voxels.length);

    objects.push({
      id: i + 10,
      startStep: 0,
      start: {
        x: voxels[randomStartIndex].x,
        y: voxels[randomStartIndex].y,
        z: voxels[randomStartIndex].z,
      },
      goal: {
        x: voxels[randomGoalIndex].x,
        y: voxels[randomGoalIndex].y,
        z: voxels[randomGoalIndex].z,
      },
    });
  }
  // 添加体素到场景
  voxels.forEach(({ x, y, z }) => {
    const normalizedZ = (z - minZ) / (maxZ - minZ);
    const color = new THREE.Color();
    color.setHSL(0.6 - normalizedZ * 0.6, 0.4, 0.5);

    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
    });

    const cube = new THREE.Mesh(geometry, material);
    voxelMap.set(`${x},${y},${z}`, cube);
    cube.position.set(x, y, z);
    scene.add(cube);
  });

  const ballGeometry = new THREE.SphereGeometry(5, 32, 32);

  // 创建物体并设置随机颜色
  const balls = objects.map((obj, index) => {
    // 随机生成小球颜色
    const ballColor = new THREE.Color().setRGB(
      Math.random(),
      Math.random(),
      Math.random()
    );
    const material = new THREE.MeshBasicMaterial({
      color: ballColor,
    });
    const pathColor = ballColor.clone();
    pathColor.l = 0.5;
    const ball = new THREE.Mesh(ballGeometry, material);
    ball.position.set(obj.start.x, obj.start.y, obj.start.z);
    scene.add(ball);

    // 找到目的地体素块并设置颜色为轨迹颜色1
    const goalKey = `${obj.goal.x},${obj.goal.y},${obj.goal.z}`;
    const goalVoxel = voxelMap.get(goalKey);
    if (goalVoxel) {
      goalVoxel.material.color.set(pathColor);
      goalVoxel.material.opacity = 1;
    }

    return { ball, ...obj, path: [], currentStep: 0, ballColor, pathColor };
  });

  // A*算法定义
  function heuristic(node, goal) {
    return (
      Math.abs(node.x - goal.x) +
      Math.abs(node.y - goal.y) +
      Math.abs(node.z - goal.z)
    );
  }

  function getNeighbors(current) {
    const deltas = [
      // 一轴方向
      { x: 10, y: 0, z: 0, cost: 1 },
      { x: -10, y: 0, z: 0, cost: 1 },
      { x: 0, y: 10, z: 0, cost: 1 },
      { x: 0, y: -10, z: 0, cost: 1 },
      { x: 0, y: 0, z: 10, cost: 1 },
      { x: 0, y: 0, z: -10, cost: 1 },

      // 二轴方向
      { x: 10, y: 10, z: 0, cost: 1.4 },
      { x: -10, y: 10, z: 0, cost: 1.4 },
      { x: 10, y: -10, z: 0, cost: 1.4 },
      { x: -10, y: -10, z: 0, cost: 1.4 },
      { x: 10, y: 0, z: 10, cost: 1.4 },
      { x: -10, y: 0, z: 10, cost: 1.4 },
      { x: 10, y: 0, z: -10, cost: 1.4 },
      { x: -10, y: 0, z: -10, cost: 1.4 },
      { x: 0, y: 10, z: 10, cost: 1.4 },
      { x: 0, y: -10, z: 10, cost: 1.4 },
      { x: 0, y: 10, z: -10, cost: 1.4 },
      { x: 0, y: -10, z: -10, cost: 1.4 },

      // 三轴方向
      { x: 10, y: 10, z: 10, cost: 1.7 },
      { x: -10, y: 10, z: 10, cost: 1.7 },
      { x: 10, y: -10, z: 10, cost: 1.7 },
      { x: -10, y: -10, z: 10, cost: 1.7 },
      { x: 10, y: 10, z: -10, cost: 1.7 },
      { x: -10, y: 10, z: -10, cost: 1.7 },
      { x: 10, y: -10, z: -10, cost: 1.7 },
      { x: -10, y: -10, z: -10, cost: 1.7 },
    ];

    return deltas.map((delta) => ({
      x: current.x + delta.x,
      y: current.y + delta.y,
      z: current.z + delta.z,
      cost: delta.cost,
    }));
  }

  function findPath(start, goal, otherPaths) {
    if (start.x === goal.x && start.y === goal.y && start.z === goal.z) {
      return [];
    }
    let step = 0;
    const openSet = new Set([`${start.x},${start.y},${start.z}`]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    gScore.set(`${start.x},${start.y},${start.z}`, 0);
    fScore.set(`${start.x},${start.y},${start.z}`, heuristic(start, goal));
    while (openSet.size > 0) {
      let currentKey = null;
      let lowestFScore = Infinity;

      openSet.forEach((key) => {
        const score = fScore.get(key) || Infinity;
        if (score < lowestFScore) {
          lowestFScore = score;
          currentKey = key;
        }
      });
      // console.log('start', start, 'goal', goal, 'currentKey', currentKey,'step',step);
      const [cx, cy, cz] = currentKey.split(",").map(Number);
      const current = { x: cx, y: cy, z: cz };

      if (
        current.x === goal.x &&
        current.y === goal.y &&
        current.z === goal.z
      ) {
        const path = [];
        let num = 0;
        while (
          currentKey &&
          currentKey !== `${start.x},${start.y},${start.z}` &&
          num < 100
        ) {
          num++;
          const [x, y, z] = currentKey.split(",").map(Number);
          path.push({ x, y, z });
          currentKey = cameFrom.get(currentKey);
        }
        // console.log("path", path);
        return path.reverse();
      }

      openSet.delete(currentKey);

      getNeighbors(current).forEach((neighbor) => {
        const neighborKey = `${neighbor.x},${neighbor.y},${neighbor.z}`;
        // 碰撞检测
        if (
          !voxelMap.has(neighborKey) ||
          otherPaths.some((p) => p.includes(neighborKey))
        )
          return;

        const tentativeGScore = (gScore.get(currentKey) || 0) + neighbor.cost;
        if (tentativeGScore < (gScore.get(neighborKey) || Infinity)) {
          cameFrom.set(neighborKey, currentKey);
          gScore.set(neighborKey, tentativeGScore);
          fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, goal));
          openSet.add(neighborKey);
        }
      });
      step++;
    }

    return [];
  }

  //初始化
  let allPaths = [];
  let maxPathStep = 0;
  let nowStep = 0; //当前步数
  while(allPaths.some((path) => path.length ==0)) {
    
  }
  //将起始点剔除出VoxelMap
  balls.forEach((obj) => {
    const startKey = `${obj.start.x},${obj.start.y},${obj.start.z}`;
    voxelMap.delete(startKey);
  });

  // 为每个物体计算路径
  balls.forEach((obj, index) => {
    obj.path = findPath(obj.start, obj.goal, allPaths);
    allPaths.push(obj.path.map((pos) => `${pos.x},${pos.y},${pos.z}`));
    maxPathStep = Math.max(maxPathStep, obj.path.length);
  });

  //将起始点添加回VoxelMap
  balls.forEach((obj) => {
    const material = new THREE.MeshBasicMaterial({
      color:obj.ballColor,
      transparent: true,
      opacity: 0.2,
    });
    const cube = new THREE.Mesh(geometry, material);
    const startKey = `${obj.start.x},${obj.start.y},${obj.start.z}`;
    voxelMap.set(startKey, cube);
  });
  // 动画逻辑
  function animate() {
    let animationDone = true;

    balls.forEach((obj) => {
      if (obj.currentStep < obj.path.length) {
        const { x, y, z } = obj.path[obj.currentStep];
        obj.ball.position.set(x, y, z);

        const key = `${x},${y},${z}`;
        const voxel = voxelMap.get(key);
        if (voxel) {
          // 设置体素颜色为小球对应的轨迹颜色
          voxel.material.color.set(obj.ballColor);
          voxel.material.opacity = 0.7;
        }

        obj.currentStep++;
        animationDone = false;
      }
    });

    if (!animationDone) {
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 600);
    }
  }

  animate();
  console.log("allPaths", allPaths);
}
