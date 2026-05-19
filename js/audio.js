import { dom } from './dom.js';
import { iconMuted, iconPlaying } from './data.js';

let audioCtx = null;
let masterGainNode = null;
let bgmPlaying = false;
let bgmManuallyMuted = false;
let bgmStarted = false;

function track(event, payload = {}) {
  if (window.umami) window.umami.track(event, payload);
}

function updateBgmIcon() {
  if (!dom.bgmToggle) return;
  dom.bgmToggle.innerHTML = bgmPlaying ? iconPlaying : iconMuted;
}

export function initAudioUI() {
  bgmPlaying = false;
  updateBgmIcon();
}

export function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function createTone({ type = 'sine', frequency = 440, duration = 0.2, gain = 0.12, startTime, endFrequency = null }) {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  if (endFrequency) osc.frequency.exponentialRampToValueAtTime(endFrequency, startTime + duration);

  amp.gain.setValueAtTime(0.0001, startTime);
  amp.gain.exponentialRampToValueAtTime(gain, startTime + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.03);
}

export function playErrorSFX() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  createTone({ type: 'sawtooth', frequency: 320, endFrequency: 150, duration: 0.16, gain: 0.08, startTime: now });
  createTone({ type: 'triangle', frequency: 220, endFrequency: 120, duration: 0.21, gain: 0.06, startTime: now + 0.02 });
}

export function playSuccessSFX() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  createTone({ type: 'sine', frequency: 440, duration: 0.12, gain: 0.05, startTime: now });
  createTone({ type: 'sine', frequency: 660, duration: 0.14, gain: 0.05, startTime: now + 0.07 });
}

export function playGachaRevealSFX() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  createTone({ type: 'sine', frequency: 392, duration: 0.12, gain: 0.05, startTime: now });
  createTone({ type: 'sine', frequency: 587.33, duration: 0.14, gain: 0.06, startTime: now + 0.08 });
  createTone({ type: 'triangle', frequency: 783.99, duration: 0.2, gain: 0.07, startTime: now + 0.18 });
  createTone({ type: 'sine', frequency: 1174.66, duration: 0.32, gain: 0.045, startTime: now + 0.3 });
}

export function toggleBGM() {
  track('Toggle BGM');

  if (!bgmStarted) {
    startSpaceBGM();
    return;
  }

  const ctx = ensureAudioContext();
  if (!ctx || !masterGainNode) return;

  if (bgmPlaying) {
    masterGainNode.gain.cancelScheduledValues(ctx.currentTime);
    masterGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    bgmPlaying = false;
    bgmManuallyMuted = true;
  } else {
    masterGainNode.gain.cancelScheduledValues(ctx.currentTime);
    masterGainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.4);
    bgmPlaying = true;
    bgmManuallyMuted = false;
  }

  updateBgmIcon();
}

export function startSpaceBGM() {
  if (bgmStarted) return;

  const ctx = ensureAudioContext();
  if (!ctx) return;

  bgmStarted = true;
  masterGainNode = ctx.createGain();
  masterGainNode.gain.setValueAtTime(0, ctx.currentTime);
  masterGainNode.connect(ctx.destination);

  const delay = ctx.createDelay(3.0);
  delay.delayTime.value = 1.5;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.7;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(masterGainNode);

  [261.63, 392.0, 587.33, 659.25, 783.99].forEach((freq, index) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 10;

    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.05;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.03 + index * 0.015;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(oscGain.gain);

    osc.connect(oscGain);
    oscGain.connect(masterGainNode);
    oscGain.connect(delay);

    lfo.start();
    osc.start();
  });

  if (!bgmManuallyMuted) {
    masterGainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 3.5);
    bgmPlaying = true;
  }

  updateBgmIcon();
}
