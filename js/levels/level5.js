const LEVEL5_HOLD_MS = 900;

// Base colors per answer card slot (must match createLevel5Question gestureMap colors)
const CARD_BASE_COLORS = {
  Peace:    0x182337,
  ThumbsUp: 0x1d213c,
  Metal:    0x221b39,
  Vulcan:   0x15263a
};

// Accent highlight color while holding
const CARD_HOVER_COLOR  = 0x2a4a7f;  // mid-blue highlight
const CARD_ACTIVE_COLOR = 0x3b6fd4;  // brighter blue at 100% hold

function applyLevel5HoverFeedback(answers, activeGesture, holdProgress) {
  for (const answer of answers) {
    const mat = answer.panel.material;
    if (answer.gesture === activeGesture && holdProgress > 0) {
      // Interpolate base → active color based on hold progress
      const base   = new THREE.Color(CARD_HOVER_COLOR);
      const target = new THREE.Color(CARD_ACTIVE_COLOR);
      base.lerp(target, holdProgress);
      mat.color.set(base);
      mat.opacity = 0.85 + holdProgress * 0.12;
      // Subtle scale-up
      const s = 1 + holdProgress * 0.04;
      answer.panel.scale.set(s, s, 1);
    } else {
      // Restore base color and dim non-active cards slightly
      mat.color.setHex(CARD_BASE_COLORS[answer.gesture] ?? 0x182337);
      mat.opacity = activeGesture !== 'None' ? 0.55 : 0.94;
      answer.panel.scale.set(1, 1, 1);
    }
  }
}

export function handleLevel5Interaction({
  currentGesture,
  answers,
  state,
  playSuccessSFX,
  playErrorSFX,
  advanceLevel5Question,
  track
}) {
  const scenario = state.activeLevel5Scenario;
  const now = Date.now();

  // --- Always compute hold progress for live visual feedback ---
  const holdingGesture = state.level5GestureHold;
  const holdElapsed = holdingGesture !== 'None' ? now - state.level5GestureStartedAt : 0;
  const holdProgress = Math.min(holdElapsed / LEVEL5_HOLD_MS, 1);
  const isLocked = !scenario || state.level5Resolved || now < state.level5ReadyAt || now < state.level5CooldownUntil;
  applyLevel5HoverFeedback(
    answers,
    isLocked ? 'None' : (holdingGesture !== 'None' ? holdingGesture : 'None'),
    isLocked ? 0 : holdProgress
  );

  if (isLocked) {
    // Reset hold state while locked/resolved so a fresh gesture is required after unlock.
    if (state.level5GestureHold !== 'None') {
      state.level5GestureHold = 'None';
      state.level5GestureStartedAt = 0;
    }
    return;
  }

  const answerCard = answers.find(answer => answer.gesture === currentGesture);
  if (!answerCard) {
    // No card matched — reset hold and allow the same gesture again later.
    state.level5GestureHold = 'None';
    state.level5GestureStartedAt = 0;
    state.level5LastGesture = 'None';
    return;
  }

  // Gesture changed or hold not started yet — begin hold timer.
  if (state.level5GestureHold !== currentGesture) {
    state.level5GestureHold = currentGesture;
    state.level5GestureStartedAt = now;
    return;
  }

  // Still holding — wait for the hold threshold.
  if (now - state.level5GestureStartedAt < LEVEL5_HOLD_MS) {
    return;
  }

  // Hold threshold reached. Guard against re-firing the same gesture without releasing.
  if (state.level5LastGesture === currentGesture) return;

  // Consume this gesture — mark as used so it cannot fire again until released.
  state.level5LastGesture = currentGesture;

  if (currentGesture === scenario.answerGesture) {
    state.level5Resolved = true;
    playSuccessSFX();
    gsap.fromTo(answerCard.panel.material, { opacity: 0.65 }, { opacity: 1, duration: 0.18, yoyo: true, repeat: 3 });
    gsap.fromTo(answerCard.panel.scale, { x: 1, y: 1 }, { x: 1.05, y: 1.08, duration: 0.18, yoyo: true, repeat: 3 });
    gsap.fromTo(answerCard.label.scale, { x: answerCard.label.scale.x, y: answerCard.label.scale.y }, { x: answerCard.label.scale.x * 1.04, y: answerCard.label.scale.y * 1.04, duration: 0.18, yoyo: true, repeat: 3 });
    track('Level 5 Completed', { planet: scenario.planet, gesture: currentGesture });
    advanceLevel5Question?.();
    return;
  }

  state.mistakeCount++;
  playErrorSFX();

  const originalColor = CARD_BASE_COLORS[currentGesture] ?? 0x182337;
  answerCard.panel.material.color.setHex(0xff6b6b);
  gsap.fromTo(answerCard.panel.material, { opacity: 0.82 }, {
    opacity: 0.34,
    duration: 0.15,
    yoyo: true,
    repeat: 3,
    onComplete: () => answerCard.panel.material.color.setHex(originalColor)
  });
  gsap.fromTo(answerCard.panel.scale, { x: 1, y: 1 }, { x: 0.98, y: 0.95, duration: 0.15, yoyo: true, repeat: 3 });
  state.level5CooldownUntil = Date.now() + 450;
}
