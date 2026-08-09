export const viewerConfig = {
  intro: {
    durationMs: 5200,
    orbitTurns: 2.2,
    farPadding: 8,
  },
  orbit: {
    initialElevation: 0.04,
    minElevation: -0.08,
    maxElevation: 1.12,
    minDistance: 4.7,
    maxDistance: 16,
    restPadding: 0.7,
    horizontalSpeed: 0.008,
    verticalSpeed: 0.006,
    zoomSpeed: 0.006,
    damping: 0.12,
  },
  labels: {
    knowledge: { bone: "Skeleton_neck_joint_2", offset: [158, 12], worldOffset: [0, 0.1, 0] },
    research: { bone: "Skeleton_arm_joint_L__2_", offset: [124, 0], worldOffset: [0, 0, 0] },
    work: { bone: "Skeleton_arm_joint_R__3_", offset: [-124, 0], worldOffset: [0, 0, 0] },
    about: { bone: "Skeleton_torso_joint_2", offset: [132, -4], worldOffset: [0, 0.02, 0] },
  },
  labelCollisionPadding: 10,
  panelGap: 26,
  headTracking: {
    yaw: 0.78,
    pitch: 0.3,
  },
  target: [0, 0.02, 0],
};
