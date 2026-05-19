export function handleLevel3Interaction({
  currentGesture,
  handWorldPos,
  spaceObjects,
  zones,
  state,
  getT,
  updateStats,
  playSuccessSFX,
  playErrorSFX,
  showLevelComplete,
  track,
  returnSpaceObjectToSpawn
}) {
  const t = getT();

  if (currentGesture === 'Pinch') {
    if (!state.grabbedSpaceObject) {
      let nearest = null;
      let minDist = 44;

      for (const object of spaceObjects) {
        if (object.placed) continue;
        const dist = object.mesh.position.distanceTo(handWorldPos);
        if (dist < minDist) {
          minDist = dist;
          nearest = object;
        }
      }

      if (nearest) state.grabbedSpaceObject = nearest;
    }
  } else if (currentGesture === 'Open' && state.grabbedSpaceObject) {
    const distToCenter = state.grabbedSpaceObject.mesh.position.length();
    let closestZone = null;
    let smallestGap = Infinity;

    for (const zone of zones) {
      const gap = Math.abs(distToCenter - zone.userData.centerDist);
      if (gap < zone.userData.snapThreshold && gap < smallestGap) {
        smallestGap = gap;
        closestZone = zone;
      }
    }

    if (closestZone) {
      state.totalDrops++;
      const objectName = state.grabbedSpaceObject.def.name;
      const zoneLabel = t.level3Zones[closestZone.userData.key];

      if (closestZone.userData.key === state.grabbedSpaceObject.def.zone) {
        playSuccessSFX();
        state.grabbedSpaceObject.placed = true;
        state.grabbedSpaceObject.zone = closestZone.userData.key;
        state.grabbedSpaceObject.angle = Math.atan2(
          state.grabbedSpaceObject.mesh.position.y,
          state.grabbedSpaceObject.mesh.position.x
        );
        state.grabbedSpaceObject.orbitRadius = closestZone.userData.centerDist + (Math.random() - 0.5) * (closestZone.userData.outer - closestZone.userData.inner) * 0.35;

        gsap.fromTo(closestZone.material, { opacity: 0.45 }, { opacity: 0.22, duration: 0.6, ease: 'power2.out' });
        updateStats(t.statusLevel3Correct.replace('{object}', objectName).replace('{zone}', zoneLabel), 'success-text');

        state.grabbedSpaceObject = null;

        if (spaceObjects.every(object => object.placed)) {
          track('Level 3 Completed');
          setTimeout(() => showLevelComplete(3), 500);
        }
        return;
      }

      state.mistakeCount++;
      playErrorSFX();
      updateStats(t.statusLevel3Wrong.replace('{object}', objectName).replace('{zone}', zoneLabel), 'error-text');
      const wrongObject = state.grabbedSpaceObject;
      const originalColor = closestZone.material.color.getHex();
      closestZone.material.color.setHex(0xff6b6b);
      gsap.fromTo(closestZone.material, { opacity: 0.75 }, {
        opacity: 0.22,
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        onComplete: () => closestZone.material.color.setHex(originalColor)
      });
      gsap.to(wrongObject.mesh.position, {
        x: '+=3',
        duration: 0.05,
        yoyo: true,
        repeat: 5,
        onComplete: () => returnSpaceObjectToSpawn(wrongObject)
      });
    } else {
      returnSpaceObjectToSpawn(state.grabbedSpaceObject);
      updateStats(t.statusLevel3Drag, '');
    }

    state.grabbedSpaceObject = null;
  }

  if (state.grabbedSpaceObject) {
    gsap.killTweensOf(state.grabbedSpaceObject.mesh.position);
    if (state.grabbedSpaceObject.artSprite) gsap.killTweensOf(state.grabbedSpaceObject.artSprite.position);
    gsap.killTweensOf(state.grabbedSpaceObject.label.position);
    state.grabbedSpaceObject.mesh.position.lerp(handWorldPos, 0.4);
    state.grabbedSpaceObject.mesh.position.z = 14;
    if (state.grabbedSpaceObject.artSprite) {
      state.grabbedSpaceObject.artSprite.position.lerp(new THREE.Vector3(handWorldPos.x, handWorldPos.y + 12.5, 13), 0.4);
    }
    state.grabbedSpaceObject.label.position.lerp(new THREE.Vector3(handWorldPos.x, handWorldPos.y + 4, 16), 0.4);
  }
}
