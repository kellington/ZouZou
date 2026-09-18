import type { Critter } from './critters';

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

function createNoiseBuffer(context: AudioContext, duration: number): AudioBuffer {
  const frameCount = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playNoiseBurst(
  context: AudioContext,
  { duration, volume, lowpassFrequency }: { duration: number; volume: number; lowpassFrequency: number },
): void {
  const source = context.createBufferSource();
  source.buffer = createNoiseBuffer(context, duration);

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = lowpassFrequency;

  const gain = context.createGain();
  const now = context.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(now);
  source.stop(now + duration + 0.02);
}

// A single low "woof": a brief filtered-noise attack (the "bark" transient)
// under a short falling square-wave tone, so it reads as noisy, not tonal.
function playWoof(): void {
  const context = getAudioContext();
  if (!context) return;
  void context.resume();

  playNoiseBurst(context, { duration: 0.05, volume: 0.09, lowpassFrequency: 900 });
  playEnvelope({
    startFrequency: 260,
    peakFrequency: 230,
    endFrequency: 150,
    duration: 0.13,
    volume: 0.1,
    type: 'square',
  });
}

// Two-part "woof-woof", low register, noisy attack on each hit.
export function playBarkSound(): void {
  playWoof();
  window.setTimeout(playWoof, 150);
}

// A longer, low growl with slight vibrato (frequency wobble), lowpass-filtered
// so the sawtooth reads as rumbly rather than buzzy/harsh.
export function playRoarSound(): void {
  const context = getAudioContext();
  if (!context) return;
  void context.resume();

  const now = context.currentTime;
  const duration = 0.42;

  const oscillator = context.createOscillator();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(110, now);
  oscillator.frequency.linearRampToValueAtTime(145, now + 0.1);
  oscillator.frequency.linearRampToValueAtTime(80, now + duration);

  const vibrato = context.createOscillator();
  vibrato.frequency.value = 7;
  const vibratoDepth = context.createGain();
  vibratoDepth.gain.value = 6;
  vibrato.connect(vibratoDepth);
  vibratoDepth.connect(oscillator.frequency);

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 380;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  vibrato.start(now);
  oscillator.start(now);
  vibrato.stop(now + duration + 0.02);
  oscillator.stop(now + duration + 0.02);
}

// Fast, high, rising "ooh-ooh-ah-ah" chatter — four quick ascending notes.
export function playMonkeySound(): void {
  const notes = [520, 580, 680, 780];
  const playNote = (frequency: number) =>
    playEnvelope({
      startFrequency: frequency,
      peakFrequency: frequency + 40,
      endFrequency: frequency - 20,
      duration: 0.07,
      volume: 0.08,
      type: 'triangle',
    });

  // Note 1 plays synchronously in this call (not via setTimeout(…, 0)), so it
  // fires within the same user-gesture tick — iOS Safari can otherwise treat
  // a timer-deferred AudioContext action as no longer gesture-initiated.
  playNote(notes[0]);
  notes.slice(1).forEach((frequency, i) => {
    window.setTimeout(() => playNote(frequency), (i + 1) * 65);
  });
}

export function playCritterSound(critter: Critter): void {
  switch (critter) {
    case 'dog':
      playBarkSound();
      return;
    case 'dino':
      playRoarSound();
      return;
    case 'monkey':
      playMonkeySound();
      return;
    case 'cat':
    default:
      playMeowSound();
  }
}