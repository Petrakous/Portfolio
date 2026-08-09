export const viewerConfig = {
  intro: {
    durationMs: 5200,
    orbitTurns: 2.2,
    farPadding: 7,
  },
  orbit: {
    initialElevation: 0.04,
    minElevation: 0.03,
    maxElevation: 1.12,
    minDistance: 4.7,
    maxDistance: 9,
    horizontalSpeed: 0.008,
    verticalSpeed: 0.006,
    zoomSpeed: 0.006,
    damping: 0.12,
  },
  labels: {
    knowledge: { bone: "Skeleton_neck_joint_2", offset: [72, -26], worldOffset: [0, 0.1, 0] },
    research: { bone: "Skeleton_arm_joint_L__2_", offset: [-84, 0], worldOffset: [0, 0, 0] },
    work: { bone: "Skeleton_arm_joint_R__3_", offset: [84, 0], worldOffset: [0, 0, 0] },
    about: { bone: "Skeleton_torso_joint_2", offset: [76, -4], worldOffset: [0, 0.02, 0] },
  },
  labelCollisionPadding: 10,
  panelGap: 18,
  headTracking: {
    yaw: 0.58,
    pitch: 0.18,
  },
  target: [0, 0.02, 0],
};
