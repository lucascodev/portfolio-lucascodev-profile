const SHADOW_MAP_SIZE = 2048;
const SHADOW_CAMERA_EXTENT = 2;

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#8b93c9" />
      <hemisphereLight args={['#a7b4ff', '#1a1625', 0.45]} />
      <directionalLight
        position={[-1.6, 3.2, 2.2]}
        intensity={1.1}
        color="#fff1e0"
        castShadow
        shadow-mapSize={[SHADOW_MAP_SIZE, SHADOW_MAP_SIZE]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-SHADOW_CAMERA_EXTENT}
        shadow-camera-right={SHADOW_CAMERA_EXTENT}
        shadow-camera-top={SHADOW_CAMERA_EXTENT}
        shadow-camera-bottom={-SHADOW_CAMERA_EXTENT}
      />
      <pointLight position={[1.8, 1.6, 0.6]} intensity={1.2} color="#c084fc" distance={4} decay={2} />
    </>
  );
}
