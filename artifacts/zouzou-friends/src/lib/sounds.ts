type SoundType = OscillatorType;

type SoundOptions = {
  startFrequency: number;
  peakFrequency?: number;
  endFrequency: number;
  duration: number;
  volume: number;
  type: SoundType;
};

type WindowWithAudioContext = Window & {
  webkitAudioContext?: typeof AudioContext;
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioContext) return audioContext;
  if (typeof window === 'undefined') return null;

  const AudioContextConstructor =
    window.AudioContext ||
    (window as WindowWithAudioContext).webkitAudioContext;
  if (!AudioContextConstructor) return null;

  audioContext = new AudioContextConstructor();
  return audioContext;
}

function playEnvelope({
  startFrequency,
  peakFrequency,
  endFrequency,
  duration,
  volume,
  type,
}: SoundOptions): void {
  const context = getAudioContext();
  if (!context) return;

  void context.resume();

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const peakAt = now + Math.min(0.08, duration * 0.35);
  const endAt = now + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(startFrequency, now);
  if (peakFrequency !== undefined) {
    oscillator.frequency.linearRampToValueAtTime(peakFrequency, peakAt);
  }
  oscillator.frequency.linearRampToValueAtTime(endFrequency, endAt);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(endAt + 0.02);
}

export function playNoCatSound(): void {
  playEnvelope({
    startFrequency: 760,
    endFrequency: 510,
    duration: 0.09,
    volume: 0.055,
    type: 'triangle',
  });
}

export function playMeowSound(): void {
  playEnvelope({
    startFrequency: 520,
    peakFrequency: 760,
    endFrequency: 340,
    duration: 0.28,
    volume: 0.1,
    type: 'sine',
  });
}

export function playMistakeSound(): void {
  playEnvelope({
    startFrequency: 210,
    peakFrequency: 145,
    endFrequency: 90,
    duration: 0.2,
    volume: 0.075,
    type: 'sawtooth',
  });
}