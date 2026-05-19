function clearPlanetHighlights(planets) {
  for (const planet of planets) {
    planet.mesh.scale.set(1, 1, 1);
    if (planet.mesh.material?.emissive) planet.mesh.material.emissive.setHex(0x000000);
    if (planet.level2GuideRing) {
      planet.level2GuideRing.material.color.setHex(0x8bb8ff);
      planet.level2GuideRing.material.opacity = 0.3;
      planet.level2GuideRing.scale.set(1, 1, 1);
    }
    if (planet.level2GuideLabel) {
      planet.level2GuideLabel.material.opacity = 0.92;
      const baseScale = planet.level2GuideLabel.userData?.baseScale;
      if (baseScale) planet.level2GuideLabel.scale.copy(baseScale);
    }
  }
}

function highlightPlanet(planet, isCorrectTarget) {
  if (!planet) return;
  planet.mesh.scale.setScalar(isCorrectTarget ? 1.16 : 1.08);
  if (planet.mesh.material?.emissive) {
    planet.mesh.material.emissive.setHex(isCorrectTarget ? 0x2f6bff : 0x6b7280);
  }
  if (planet.level2GuideRing) {
    planet.level2GuideRing.material.color.setHex(isCorrectTarget ? 0x7dd3fc : 0x94a3b8);
    planet.level2GuideRing.material.opacity = isCorrectTarget ? 0.7 : 0.45;
    planet.level2GuideRing.scale.setScalar(isCorrectTarget ? 1.14 : 1.06);
  }
  if (planet.level2GuideLabel) {
    planet.level2GuideLabel.material.opacity = 1;
    const baseScale = planet.level2GuideLabel.userData?.baseScale;
    if (baseScale) planet.level2GuideLabel.scale.set(baseScale.x * 1.06, baseScale.y * 1.06, 1);
  }
}

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
  showLevelComplete,
  track,
  returnMoonToSpawn
}) {
  const t = getT();

  if (currentGesture === 'Pinch') {
    if (!state.grabbedMoon) {
      let nearest = null;
      let minDist = 54;
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
      const grabRadius = Math.max(22, planet.def.radius + 16);
      if (dist < grabRadius && dist < closestDist) {
        closestDist = dist;
        closestPlanet = planet;
      }
    }

    clearPlanetHighlights(planets);

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
        gsap.fromTo(closestPlanet.mesh.scale, { x: 1.18, y: 1.18, z: 1.18 }, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'back.out(2)' });

        if (moons.every(moon => moon.placed)) {
          track('Level 2 Completed');
          setTimeout(() => showLevelComplete(2), 600);
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

    let nearestPlanet = null;
    let nearestDist = Infinity;
    for (const planet of planets) {
      if (!planet.placed) continue;
      const dist = state.grabbedMoon.mesh.position.distanceTo(planet.mesh.position);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestPlanet = planet;
      }
    }

    clearPlanetHighlights(planets);
    if (nearestPlanet && nearestDist < Math.max(34, nearestPlanet.def.radius + 22)) {
      const isCorrectTarget = state.grabbedMoon.def.parent === nearestPlanet.def.name;
      highlightPlanet(nearestPlanet, isCorrectTarget);
      updateStats(
        isCorrectTarget
          ? t.statusMoonCorrect.replace('{moon}', state.grabbedMoon.def.name).replace('{planet}', t.planetNames[nearestPlanet.def.name])
          : t.statusMoonWrong.replace('{moon}', state.grabbedMoon.def.name).replace('{planet}', t.planetNames[nearestPlanet.def.name]),
        isCorrectTarget ? 'success-text' : ''
      );
    }
  } else {
    clearPlanetHighlights(planets);
  }
}
