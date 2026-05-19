import { getLevel5ScenarioOptions } from '../data.js';

export function handleLevel5Interaction({
  currentGesture,
  answers,
  state,
  getT,
  updateStats,
  playSuccessSFX,
  playErrorSFX,
  triggerWinState,
  setLevel5HUDAnswerState,
  scene,
  camera,
  track
}) {
  const t = getT();
  const scenario = state.activeLevel5Scenario;
  if (!scenario || state.level5Resolved || Date.now() < state.level5ReadyAt) {
    state.level5LastGesture = currentGesture;
    return;
  }

  const answerCard = answers.find(answer => answer.gesture === currentGesture);
  if (!answerCard || state.level5LastGesture === currentGesture) {
    state.level5LastGesture = currentGesture;
    return;
  }

  state.level5LastGesture = currentGesture;
  const selectedAnswer = getLevel5ScenarioOptions(scenario, state.currentLang)[currentGesture];
  setLevel5HUDAnswerState(currentGesture, 'active');

  if (currentGesture === scenario.answerGesture) {
    state.level5Resolved = true;
    playSuccessSFX();
    updateStats(t.statusLevel5Correct.replace('{answer}', selectedAnswer), 'success-text');
    setLevel5HUDAnswerState(currentGesture, 'correct');
    gsap.fromTo(answerCard.panel.material, { opacity: 0.65 }, { opacity: 1, duration: 0.18, yoyo: true, repeat: 3 });
    gsap.fromTo(answerCard.panel.scale, { x: 1, y: 1 }, { x: 1.05, y: 1.08, duration: 0.18, yoyo: true, repeat: 3 });
    gsap.fromTo(answerCard.label.scale, { x: answerCard.label.scale.x, y: answerCard.label.scale.y }, { x: answerCard.label.scale.x * 1.04, y: answerCard.label.scale.y * 1.04, duration: 0.18, yoyo: true, repeat: 3 });
    track('Level 5 Completed', { planet: scenario.planet, gesture: currentGesture });
    setTimeout(() => triggerWinState(scene, camera), 700);
    return;
  }

  state.mistakeCount++;
  playErrorSFX();
  updateStats(
    t.statusLevel5Wrong
      .replace('{answer}', selectedAnswer)
      .replace('{planet}', t.planetNames[scenario.planet] || scenario.planet),
    'error-text'
  );
  setLevel5HUDAnswerState(currentGesture, 'wrong');

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
}
