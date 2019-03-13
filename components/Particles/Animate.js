/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */

const r = 700;
const rHalf = r / 2;

const animate = ({
  minDistance,
  limitConnections,
  maxConnections,
  particleCount,
  lineMeshGeometry,
  pointCloudGeometry,
  particlesData,
  particlePositions,
  linePositions,
  lineColors
}) => {
  let vertexpos = 0;
  let colorpos = 0;
  let numConnected = 0;
  for (let i = 0; i < particleCount; i += 1)
    particlesData[i].numConnections = 0;
  for (let i = 0; i < particleCount; i += 1) {
    // get the particle
    const particleData = particlesData[i];
    particlePositions[i * 3] += particleData.velocity.x;
    particlePositions[i * 3 + 1] += particleData.velocity.y;
    particlePositions[i * 3 + 2] += particleData.velocity.z;
    if (
      particlePositions[i * 3 + 1] < -rHalf ||
      particlePositions[i * 3 + 1] > rHalf
    )
      particleData.velocity.y = -particleData.velocity.y;
    if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
      particleData.velocity.x = -particleData.velocity.x;
    if (
      particlePositions[i * 3 + 2] < -rHalf ||
      particlePositions[i * 3 + 2] > rHalf
    )
      particleData.velocity.z = -particleData.velocity.z;
    if (limitConnections && particleData.numConnections >= maxConnections)
      continue;
    // Check collision
    for (let j = i + 1; j < particleCount; j += 1) {
      const particleDataB = particlesData[j];
      if (limitConnections && particleDataB.numConnections >= maxConnections)
        continue;
      const dx = particlePositions[i * 3] - particlePositions[j * 3];
      const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
      const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < minDistance) {
        particleData.numConnections += 1;
        particleDataB.numConnections += 1;
        let alpha = 1.0 - dist / minDistance;
        if (alpha < 0.17) alpha = 0.17;
        linePositions[vertexpos++] = particlePositions[i * 3];
        linePositions[vertexpos++] = particlePositions[i * 3 + 1];
        linePositions[vertexpos++] = particlePositions[i * 3 + 2];
        linePositions[vertexpos++] = particlePositions[j * 3];
        linePositions[vertexpos++] = particlePositions[j * 3 + 1];
        linePositions[vertexpos++] = particlePositions[j * 3 + 2];
        lineColors[colorpos++] = alpha;
        lineColors[colorpos++] = alpha;
        lineColors[colorpos++] = alpha;
        lineColors[colorpos++] = alpha;
        lineColors[colorpos++] = alpha;
        lineColors[colorpos++] = alpha;
        numConnected += 1;
      }
    }
  }

  lineMeshGeometry.setDrawRange(0, numConnected * 2);
  lineMeshGeometry.attributes.position.needsUpdate = true;
  lineMeshGeometry.attributes.color.needsUpdate = true;
  pointCloudGeometry.attributes.position.needsUpdate = true;
};

export default animate;
