export function handleLevel2Interaction({
  currentGesture,
  handWorldPos,
  moons,
  planets,
  scene,
  camera,
  state,
  getT,
  updateStats,
  playSuccessSFX,
  playErrorSFX,
  triggerWinState,
  track,
  returnMoonToSpawn
}) {
  const t = getT();

  if (currentGesture === 'Pinch') {
    if (!state.grabbedMoon) {
      let nearest = null;
      let minDist = 42;
      for (const moon of moons) {
        if (moon.placed) continue;
        const dist = moon.mesh.position.distanceTo(handWorldPos);
        if (dist < minDist) {
          minDist = dist;
          nearest = moon;
        }
      }
      if (nearest) state.grabbedMoon = nearest;
    }
  } else if (currentGesture === 'Open' && state.grabbedMoon) {
    let closestPlanet = null;
    let closestDist = Infinity;

    for (const planet of planets) {
      if (!planet.placed) continue;
      const dist = state.grabbedMoon.mesh.position.distanceTo(planet.mesh.position);
      const grabRadius = Math.max(12, planet.def.radius + 9);
      if (dist < grabRadius && dist < closestDist) {
        closestDist = dist;
        closestPlanet = planet;
      }
    }

    if (closestPlanet) {
      state.totalDrops++;
      const moonName = state.grabbedMoon.def.name;
      const planetName = t.planetNames[closestPlanet.def.name];

      if (state.grabbedMoon.def.parent === closestPlanet.def.name) {
        playSuccessSFX();
        state.grabbedMoon.placed = true;
        state.grabbedMoon.parentPlanet = closestPlanet;
        state.grabbedMoon.orbitRadius = closestPlanet.def.radius + 5 + Math.random() * 3;
        state.grabbedMoon.angle = Math.atan2(
          state.grabbedMoon.mesh.position.y - closestPlanet.mesh.position.y,
          state.grabbedMoon.mesh.position.x - closestPlanet.mesh.position.x
        );

        updateStats(t.statusMoonCorrect.replace('{moon}', moonName).replace('{planet}', planetName), 'success-text');
        gsap.fromTo(state.grabbedMoon.mesh.scale, { x: 1.6, y: 1.6, z: 1.6 }, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'back.out(2)' });

        if (moons.every(moon => moon.placed)) {
          track('Level 2 Completed');
          setTimeout(() => triggerWinState(scene, camera), 600);
        }
      } else {
        state.mistakeCount++;
        playErrorSFX();
        updateStats(t.statusMoonWrong.replace('{moon}', moonName).replace('{planet}', planetName), 'error-text');
        const wrongMoon = state.grabbedMoon;
        gsap.to(wrongMoon.mesh.position, {
          x: '+=3',
          duration: 0.05,
          yoyo: true,
          repeat: 5,
          onComplete: () => returnMoonToSpawn(wrongMoon)
        });
      }
    } else {
      updateStats(t.statusMoonDrag, '');
      returnMoonToSpawn(state.grabbedMoon);
    }

    state.grabbedMoon = null;
  }

  if (state.grabbedMoon) {
    gsap.killTweensOf(state.grabbedMoon.mesh.position);
    gsap.killTweensOf(state.grabbedMoon.label.position);
    state.grabbedMoon.mesh.position.lerp(handWorldPos, 0.4);
    state.grabbedMoon.mesh.position.z = 14;
    state.grabbedMoon.label.position.lerp(new THREE.Vector3(handWorldPos.x, handWorldPos.y + 6, 16), 0.4);
  }
}
