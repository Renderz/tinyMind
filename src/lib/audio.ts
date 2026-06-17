type SoundType = "correct" | "wrong" | "flip" | "win";

let audioContext: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabledGlobal(enabled: boolean): void {
  soundEnabled = enabled;
}

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, delay: number = 0, type: OscillatorType = "sine"): void {
  if (!soundEnabled) return;
  const ctx = getContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const startTime = ctx.currentTime + delay;
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playSound(type: SoundType): void {
  switch (type) {
    case "correct":
      playTone(523.25, 0.15, 0);
      playTone(659.25, 0.15, 0.08);
      break;
    case "wrong":
      playTone(200, 0.2, 0, "triangle");
      break;
    case "flip":
      playTone(440, 0.08, 0, "square");
      break;
    case "win":
      playTone(523.25, 0.15, 0);
      playTone(659.25, 0.15, 0.1);
      playTone(783.99, 0.15, 0.2);
      playTone(1046.5, 0.3, 0.3);
      break;
  }
}
