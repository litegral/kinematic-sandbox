const LEVEL5_HOLD_MS = 900;

// Must match gestureMap base colors in game-world.js createLevel5Question
const CARD_BASE_COLORS = {
  Peace:    0x182337,
  ThumbsUp: 0x1d213c,
  Metal:    0x221b39,
  Vulcan:   0x15263a
};

/**
 * Updates the fill-bar mesh for every answer card each animation frame.
 *
 * The fill bar grows LEFT → RIGHT by:
 *   - scale.x  = progress  (0 → 1)
 *   - position.x = cardBaseX - 88 + progress * 88
 *     (keeps the left edge pinned to the card's left border)
 *
 * @param {Array}  answers      – world.level5Answers
 * @param {string} activeGesture – gesture currently being held ('None' if none)
 * @param {number} holdProgress – 0 → 1 (clamped)
 * @param {boolean} resolved    – true once an answer has fired (skip resetting)
 */
function applyLevel5HoverFeedback(answers, activeGesture, holdProgress, resolved) {
  if (resolved) return; // GSAP owns the fill bar after an answer fires

  for (const answer of answers) {
    const mat  = answer.panel.material;
    const fill = answer.fillBar;

    if (answer.gesture === activeGesture && holdProgress > 0) {
      // --- Highlighted card ---
      // Panel: subtle blue tint
      const panelBase   = new THREE.Color(CARD_BASE_COLORS[answer.gesture] ?? 0x182337);
      const panelTarget = new THREE.Color(0x1e3a5f);
      panelBase.lerp(panelTarget, holdProgress * 0.8);
      mat.color.set(panelBase);
      mat.opacity = 0.94;
      answer.panel.scale.set(1, 1, 1);

      // Fill bar: grow left → right
      if (fill) {
        const p = Math.max(0.001, holdProgress);
        fill.scale.x = p;
        // Left edge stays at cardBaseX - 88; center moves right with progress
        fill.position.x = answer.x - 88 + p * 88;
        // Color: cyan at start → bright blue at end
        const fillColor = new THREE.Color(0x38bdf8).lerp(new THREE.Color(0x6366f1), holdProgress);
        fill.material.color.set(fillColor);
        fill.material.opacity = 0.28 + holdProgress * 0.32;
      }
    } else {
      // --- Inactive cards: dim slightly when something else is being held ---
      mat.color.setHex(CARD_BASE_COLORS[answer.gesture] ?? 0x182337);
      mat.opacity = (activeGesture !== 'None') ? 0.52 : 0.94;
      answer.panel.scale.set(1, 1, 1);

      // Reset fill bar
      if (fill) {
        fill.scale.x = 0.001;
        fill.position.x = answer.x - 88;
        fill.material.opacity = 0;
      }
    }
  }
}

/**
 * Flash the fill bar green and animate the card for a correct answer.
 */
function playCorrectFeedback(answer) {
  const fill = answer.fillBar;
  if (!fill) return;

  // Snap to full width green
  fill.scale.x = 1;
  fill.position.x = answer.x;
  fill.material.color.setHex(0x22c55e);
  fill.material.opacity = 0.55;

  // Bright pulse then fade out
  gsap.fromTo(fill.material, { opacity: 0.85 }, {
    opacity: 0,
    duration: 0.55,
    ease: 'power2.in',
    delay: 0.25,
    onComplete: () => { fill.scale.x = 0.001; fill.position.x = answer.x - 88; }
  });

  // Panel green flash
  answer.panel.material.color.setHex(0x22c55e);
  gsap.fromTo(answer.panel.material, { opacity: 1 }, {
    opacity: 0.3,
    duration: 0.18,
    yoyo: true,
    repeat: 3,
    onComplete: () => answer.panel.material.color.setHex(CARD_BASE_COLORS[answer.gesture] ?? 0x182337)
  });
  gsap.fromTo(answer.panel.scale, { x: 1, y: 1 }, { x: 1.05, y: 1.08, duration: 0.18, yoyo: true, repeat: 3 });
  gsap.fromTo(answer.label.scale,
    { x: answer.label.scale.x, y: answer.label.scale.y },
    { x: answer.label.scale.x * 1.04, y: answer.label.scale.y * 1.04, duration: 0.18, yoyo: true, repeat: 3 }
  );
}

/**
 * Flash the fill bar red and shake the card for a wrong answer.
 */
function playWrongFeedback(answer) {
  const fill = answer.fillBar;

  // Snap fill bar to full-width red then shake-fade
  if (fill) {
    fill.scale.x = 1;
    fill.position.x = answer.x;
    fill.material.color.setHex(0xef4444);
    fill.material.opacity = 0.55;

    gsap.fromTo(fill.material, { opacity: 0.75 }, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => { fill.scale.x = 0.001; fill.position.x = answer.x - 88; }
    });
  }

  // Panel red flash
  const baseColor = CARD_BASE_COLORS[answer.gesture] ?? 0x182337;
  answer.panel.material.color.setHex(0xef4444);
  gsap.fromTo(answer.panel.material, { opacity: 0.82 }, {
    opacity: 0.25,
    duration: 0.14,
    yoyo: true,
    repeat: 3,
    onComplete: () => answer.panel.material.color.setHex(baseColor)
  });
  gsap.fromTo(answer.panel.scale, { x: 1, y: 1 }, { x: 0.97, y: 0.94, duration: 0.14, yoyo: true, repeat: 3 });
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

  // Compute hold progress every frame so the fill bar animates live
  const holdingGesture = state.level5GestureHold;
  const holdElapsed    = holdingGesture !== 'None' ? now - state.level5GestureStartedAt : 0;
  const holdProgress   = Math.min(holdElapsed / LEVEL5_HOLD_MS, 1);
  const isLocked       = !scenario || state.level5Resolved
                       || now < state.level5ReadyAt
                       || now < state.level5CooldownUntil;

  applyLevel5HoverFeedback(
    answers,
    isLocked ? 'None' : (holdingGesture !== 'None' ? holdingGesture : 'None'),
    isLocked ? 0 : holdProgress,
    state.level5Resolved
  );

  if (isLocked) {
    if (state.level5GestureHold !== 'None') {
      state.level5GestureHold = 'None';
      state.level5GestureStartedAt = 0;
    }
    return;
  }

  const answerCard = answers.find(a => a.gesture === currentGesture);
  if (!answerCard) {
    state.level5GestureHold      = 'None';
    state.level5GestureStartedAt = 0;
    state.level5LastGesture      = 'None';
    return;
  }

  // Begin hold timer on gesture change
  if (state.level5GestureHold !== currentGesture) {
    state.level5GestureHold      = currentGesture;
    state.level5GestureStartedAt = now;
    return;
  }

  // Still building up hold
  if (now - state.level5GestureStartedAt < LEVEL5_HOLD_MS) return;

  // Anti-repeat guard
  if (state.level5LastGesture === currentGesture) return;

  // Consume gesture
  state.level5LastGesture = currentGesture;

  if (currentGesture === scenario.answerGesture) {
    state.level5Resolved = true;
    playSuccessSFX();
    playCorrectFeedback(answerCard);
    track('Level 5 Completed', { planet: scenario.planet, gesture: currentGesture });
    advanceLevel5Question?.();
    return;
  }

  // Wrong answer
  state.mistakeCount++;
  playErrorSFX();
  playWrongFeedback(answerCard);
  state.level5CooldownUntil = Date.now() + 600;
}
