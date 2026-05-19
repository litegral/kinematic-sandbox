export function handleLevel1Interaction({
  currentGesture,
  handWorldPos,
  planets,
  orbits,
  state,
  getT,
  updateStats,
  playSuccessSFX,
  playErrorSFX,
  showPlanetFact,
  showLevelComplete,
  track,
  returnPlanetToSpawn
}) {
  const t = getT();

  if (currentGesture === 'Pinch') {
    if (!state.grabbedPlanet) {
      let nearest = null;
      let minDist = 50;
      for (const planet of planets) {
        if (planet.placed) continue;
        const dist = planet.mesh.position.distanceTo(handWorldPos);
        if (dist < minDist) {
          minDist = dist;
          nearest = planet;
        }
      }
      if (nearest) state.grabbedPlanet = nearest;
    }
  } else if (currentGesture === 'Open' && state.grabbedPlanet) {
    const distToCenter = state.grabbedPlanet.mesh.position.length();
    let closestOrbit = null;
    let minOrbitDist = 8;

    for (const orbit of orbits) {
      const distanceToOrbit = Math.abs(distToCenter - orbit.userData.dist);
      if (distanceToOrbit < minOrbitDist) {
        minOrbitDist = distanceToOrbit;
        closestOrbit = orbit;
      }
    }

    if (closestOrbit) {
      state.totalDrops++;
      const targetName = t.planetNames[closestOrbit.userData.targetPlanet];
      const planetName = t.planetNames[state.grabbedPlanet.def.name];

      if (closestOrbit.userData.targetPlanet === state.grabbedPlanet.def.name) {
        playSuccessSFX();
        state.grabbedPlanet.placed = true;
        state.grabbedPlanet.angle = Math.atan2(state.grabbedPlanet.mesh.position.y, state.grabbedPlanet.mesh.position.x);
        gsap.to(state.grabbedPlanet.mesh.position, { z: 0, duration: 0.5, ease: 'power2.out' });
        gsap.fromTo(closestOrbit.material, { opacity: 1 }, { opacity: 0.3, duration: 1.2, ease: 'power2.out' });
        closestOrbit.material.color.setHex(0xffffff);
        updateStats(t.statusCorrect.replace('{planet}', planetName), 'success-text');

        const placedPlanet = state.grabbedPlanet;
        state.grabbedPlanet = null;
        showPlanetFact(placedPlanet.def.name, () => {
          if (planets.every(planet => planet.placed)) {
            track('Level 1 Completed');
            setTimeout(() => showLevelComplete(1), 350);
          } else {
            updateStats(t.statusDrag, '');
          }
        });
        return;
      }

      state.mistakeCount++;
      playErrorSFX();
      updateStats(t.statusWrong.replace('{target}', targetName).replace('{planet}', planetName), 'error-text');
      const wrongPlanet = state.grabbedPlanet;
      const originalColor = closestOrbit.material.color.getHex();
      closestOrbit.material.color.setHex(0xff4444);
      gsap.fromTo(closestOrbit.material, { opacity: 0.8 }, {
        opacity: 0.3,
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        onComplete: () => closestOrbit.material.color.setHex(originalColor)
      });
      gsap.to(wrongPlanet.mesh.position, {
        x: '+=3',
        duration: 0.05,
        yoyo: true,
        repeat: 5,
        onComplete: () => returnPlanetToSpawn(wrongPlanet)
      });
    } else {
      returnPlanetToSpawn(state.grabbedPlanet);
      updateStats(t.statusDrag, '');
    }

    state.grabbedPlanet = null;
  }

  if (state.grabbedPlanet) {
    gsap.killTweensOf(state.grabbedPlanet.mesh.position);
    state.grabbedPlanet.mesh.position.lerp(handWorldPos, 0.4);
  }
}
