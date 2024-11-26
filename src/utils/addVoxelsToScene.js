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
      startStep: 1,
      start: { x: voxels[1].x, y: voxels[1].y, z: voxels[1].z },
      goal: {
        x: voxels[voxels.length - 2].x,
        y: voxels[voxels.length - 2].y,
        z: voxels[voxels.length - 2].z,
      },
    },
    {
      id: 3,
      startStep: 2,
      start: { x: voxels[2].x, y: voxels[2].y, z: voxels[2].z },
      goal: {
        x: voxels[voxels.length - 3].x,
        y: voxels[voxels.length - 3].y,
        z: voxels[voxels.length - 3].z,
      },
    },
    {
      id: 4,
      startStep: 3,
      start: { x: voxels[5].x, y: voxels[5].y, z: voxels[5].z },
      goal: {
        x: voxels[voxels.length - 62].x,
        y: voxels[voxels.length - 62].y,
        z: voxels[voxels.length - 62].z,
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
    const id = obj.id;
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

    return { id, ball, ...obj, path: [], currentStep: 0, ballColor, pathColor };
  });
  console.log("voxels", voxels.length);
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

  function findPathWithStartTime(
    start,
    goal,
    otherPaths,
    currentStep,
    startStep
  ) {
    if (start.x === goal.x && start.y === goal.y && start.z === goal.z) {
      return [];
    }
    let step = currentStep;
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
        return path.reverse();
      }

      openSet.delete(currentKey);

      getNeighbors(current).forEach((neighbor) => {
        const neighborKey = `${neighbor.x},${neighbor.y},${neighbor.z}`;
        // 碰撞检测，同时考虑当前步骤是否已经超过物体的开始运动时间
        // console.log("otherPaths", otherPaths);
      
        if (
          !voxelMap.has(neighborKey) ||
          otherPaths.some((p) => p.path.some((pos) => pos.x === neighbor.x && pos.y === neighbor.y && pos.z === neighbor.z && p.startStep <= step))
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

  function planPathsWithStartTime(objects) {
    const maxSteps = 50; // 可根据实际情况调整最大步骤数
    const paths = [];

    for (let step = 0; step < maxSteps; step++) {
    //   console.log("allPaths", paths);

      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        //如果该步时物体还没有离开起点，将起点体素剔除出VoxelMap
        if (!obj.path || obj.path.length == 0) {
          const startKey = `${obj.start.x},${obj.start.y},${obj.start.z}`;
          voxelMap.delete(startKey);
        }
        //如果当前步数大于物体的开始运动时间，并且该id的物体路径为空，则计算路径
        if (
          step >= obj.startStep &&
          paths.every((p) => p.objectId !== obj.id)
        ) {
          const start = obj.start;
          const goal = obj.goal;
          //otherPaths为除了当前物体外的其他物体的路径,如果物体已经到达终点，则不加入otherPaths
          const otherPaths = paths.filter((p, index) => index !== i&&step<p.startStep+p.path.length);
          const path = findPathWithStartTime(
            start,
            goal,
            otherPaths,
            step,
            obj.startStep
          );
          if (path.length > 0) {
            paths.push({
              path: path,
              objectId: obj.id,
              startStep: step,
            });
            obj.path = path;
            obj.currentStep = step;
          }
        }
        //如果该步时物体已经到达终点，更新VoxelMap，将终点体素剔除出VoxelMap,并将起点体素添加回VoxelMap
        if (
          obj.path &&
          obj.startStep + obj.path.length == step &&
          obj.path.length != 0
        ) {
          const goalKey = `${obj.goal.x},${obj.goal.y},${obj.goal.z}`;
          voxelMap.delete(goalKey);
          const startKey = `${obj.start.x},${obj.start.y},${obj.start.z}`;
          voxelMap.set(startKey, obj.ball);
        }
      }
    }

    return paths;
  }

  // 创建物体并设置随机颜色等操作完成后
  const paths = planPathsWithStartTime(objects);

  //检查是否有碰撞,返回碰撞的体素坐标、物体id、碰撞发生的步数
  function checkCollision(paths) {
    const collision = [];
    const maxSteps = 50;
    console.log("paths", paths);
    for (let i = 0; i < maxSteps; i++) {
      //将paths中的所有path数组中某一步的体素坐标提取出来，如果
      const stepVoxels = paths.map((path) => {
        const realStep = i - path.startStep;
        if (
          realStep >= 0 &&
          realStep < path.path.length &&
          path.path[realStep]
        ) {
          //   console.log("path.path[realStep]", path.path[realStep]);
          return [path.objectId, path.path[realStep]];
        }
        if (!path.path[realStep]) {
          return [path.objectId, path.path[path.path.length - 1]];
        }
      });
      //剔除stepVoxels中的undefined,如果是undefined则删除该元素
      const stepVoxelswithoutUndefined = stepVoxels.filter((v) => v);
    //   console.log("stepVoxelswithoutUndefined", stepVoxelswithoutUndefined);
      //计算stepVoxels中出现两次或多次的体素坐标即为碰撞发生的体素坐标
      const collisionVoxels = stepVoxelswithoutUndefined.filter((v, index) => {
        return (
          stepVoxelswithoutUndefined.findIndex((s) => s[1] === v[1]) !== index
        );
      });
        console.log("collisionVoxels", collisionVoxels);
      //如果有碰撞，将碰撞的体素坐标、物体id、碰撞发生的步数存入collision数组
      if (collisionVoxels.length > 0) {
        collisionVoxels.forEach((v) => {
          collision.push({ voxel: v[1], objectId: v[0], step: i });
        });
      }
    }
    return collision;
  }
  console.log("checkCollision ", checkCollision(paths));
  // //初始化
  // let allPaths = [];
  // let maxPathStep = 0;
  // let nowStep = 0; //当前步数
  // //将起始点剔除出VoxelMap
  // balls.forEach((obj) => {
  //   const startKey = `${obj.start.x},${obj.start.y},${obj.start.z}`;
  //   voxelMap.delete(startKey);
  // });
  // while (allPaths.some((path) => path.length == 0)) {
  //   // 为每个物体计算路径
  //   balls.forEach((obj, index) => {
  //     obj.path = findPath(obj.start, obj.goal, allPaths);
  //     allPaths.push(obj.path.map((pos) => `${pos.x},${pos.y},${pos.z}`));
  //     maxPathStep = Math.max(maxPathStep, obj.path.length);
  //   });

  //   //将起始点添加回VoxelMap
  //   balls.forEach((obj) => {
  //     const material = new THREE.MeshBasicMaterial({
  //       color: obj.ballColor,
  //       transparent: true,
  //       opacity: 0.2,
  //     });
  //     const cube = new THREE.Mesh(geometry, material);
  //     const startKey = `${obj.start.x},${obj.start.y},${obj.start.z}`;
  //     voxelMap.set(startKey, cube);
  //   });
  // }

  // 动画逻辑
  function animate(paths) {
    let animationDone = true;
    paths.forEach((pathObj) => {
      const objIndex = balls.findIndex((obj) => obj.id === pathObj.objectId);
      const obj = balls[objIndex];

      if (obj.currentStep < pathObj.path.length) {
        const { x, y, z } = pathObj.path[obj.currentStep];
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
        requestAnimationFrame(() => animate(paths));
      }, 600);
    }
  }

  animate(paths);
}
