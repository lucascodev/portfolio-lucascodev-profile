import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

export function SceneEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.8} />
      <Vignette offset={0.3} darkness={0.65} />
    </EffectComposer>
  );
}
