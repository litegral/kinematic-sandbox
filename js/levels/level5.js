const LEVEL5_HOLD_MS = 900;

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
  if (!scenario || state.level5Resolved || now < state.level5ReadyAt || now < state.level5CooldownUntil) {
    state.level5LastGesture = currentGesture;
    return;
  }

  const answerCard = answers.find(answer => answer.gesture === currentGesture);
  if (!answerCard) {
    state.level5GestureHold = 'None';
    state.level5GestureStartedAt = 0;
    state.level5LastGesture = currentGesture;
    return;
  }

  if (state.level5GestureHold !== currentGesture) {
    state.level5GestureHold = currentGesture;
    state.level5GestureStartedAt = now;
    state.level5LastGesture = currentGesture;
    return;
  }

  if (now - state.level5GestureStartedAt < LEVEL5_HOLD_MS) {
    state.level5LastGesture = currentGesture;
    return;
  }

  if (state.level5LastGesture === currentGesture) return;

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

  const originalColor = answerCard.panel.material.color.getHex();
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
