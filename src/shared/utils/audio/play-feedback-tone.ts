const TONE_FREQUENCY_HZ = 660;
const TONE_DURATION_S = 0.09;
const MAX_GAIN = 0.25;
const SILENT_GAIN = 0.0001;
const MAX_VOLUME_PERCENT = 100;

let audioContext: AudioContext | null = null;

export function playFeedbackTone(volumePercent: number): void {
  if (volumePercent <= 0) return;

  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const startAt = audioContext.currentTime;

  oscillator.frequency.value = TONE_FREQUENCY_HZ;
  gain.gain.setValueAtTime(MAX_GAIN * (volumePercent / MAX_VOLUME_PERCENT), startAt);
  gain.gain.exponentialRampToValueAtTime(SILENT_GAIN, startAt + TONE_DURATION_S);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + TONE_DURATION_S);
}
