export function handleLevel4Interaction({
  currentGesture,
  handWorldPos,
  items,
  buckets,
  state,
  getT,
  updateStats,
  playSuccessSFX,
  playErrorSFX,
  showLevelComplete,
  track,
  returnClassificationItemToSpawn
}) {
  const t = getT();

  if (currentGesture === 'Pinch') {
    if (!state.grabbedClassificationItem) {
      let nearest = null;
      let minDist = 44;

      for (const item of items) {
        if (item.placed) continue;
        const dist = item.mesh.position.distanceTo(handWorldPos);
        if (dist < minDist) {
          minDist = dist;
          nearest = item;
        }
      }

      if (nearest) state.grabbedClassificationItem = nearest;
    }
  } else if (currentGesture === 'Open' && state.grabbedClassificationItem) {
    let targetBucket = null;

    for (const bucket of buckets) {
      const dx = Math.abs(state.grabbedClassificationItem.mesh.position.x - bucket.userData.x);
      const dy = Math.abs(state.grabbedClassificationItem.mesh.position.y - bucket.userData.y);
      if (dx <= bucket.userData.width / 2 && dy <= bucket.userData.height / 2) {
        targetBucket = bucket;
        break;
      }
    }

    if (targetBucket) {
      state.totalDrops++;
      const itemName = t.spaceObjectNames[state.grabbedClassificationItem.def.name] || state.grabbedClassificationItem.def.name;
      const categoryLabel = t.level4Categories[targetBucket.userData.key];

      if (targetBucket.userData.key === state.grabbedClassificationItem.def.category) {
        playSuccessSFX();
        state.grabbedClassificationItem.placed = true;
        state.grabbedClassificationItem.bucket = targetBucket.userData.key;
        state.grabbedClassificationItem.slotIndex = targetBucket.userData.fillCount++;

        const cols = 2;
        const slotGapX = 22;
        const slotGapY = 14;
        const col = state.grabbedClassificationItem.slotIndex % cols;
        const row = Math.floor(state.grabbedClassificationItem.slotIndex / cols);
        const targetX = targetBucket.userData.x - slotGapX / 2 + col * slotGapX;
        const targetY = targetBucket.userData.y + 4 - row * slotGapY;

        gsap.to(state.grabbedClassificationItem.mesh.position, {
          x: targetX,
          y: targetY,
          z: 8,
          duration: 0.35,
          ease: 'power2.out'
        });
        if (state.grabbedClassificationItem.artSprite) {
          gsap.to(state.grabbedClassificationItem.artSprite.position, {
            x: targetX,
            y: targetY + 9,
            z: 7,
            duration: 0.35,
            ease: 'power2.out'
          });
        }
        gsap.to(state.grabbedClassificationItem.label.position, {
          x: targetX,
          y: targetY - (state.grabbedClassificationItem.def.size + 4),
          z: 10,
          duration: 0.35,
          ease: 'power2.out'
        });

        updateStats(t.statusLevel4Correct.replace('{object}', itemName).replace('{category}', categoryLabel), 'success-text');
        gsap.fromTo(targetBucket.material, { opacity: 0.48 }, { opacity: 0.28, duration: 0.5, ease: 'power2.out' });

        state.grabbedClassificationItem = null;

        if (items.every(item => item.placed)) {
          track('Level 4 Completed');
          setTimeout(() => showLevelComplete(4), 500);
        }
        return;
      }

      state.mistakeCount++;
      playErrorSFX();
      updateStats(t.statusLevel4Wrong.replace('{object}', itemName).replace('{category}', categoryLabel), 'error-text');
      const wrongItem = state.grabbedClassificationItem;
      const originalColor = targetBucket.material.color.getHex();
      targetBucket.material.color.setHex(0xff6b6b);
      gsap.fromTo(targetBucket.material, { opacity: 0.8 }, {
        opacity: 0.28,
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        onComplete: () => targetBucket.material.color.setHex(originalColor)
      });
      gsap.to(wrongItem.mesh.position, {
        x: '+=3',
        duration: 0.05,
        yoyo: true,
        repeat: 5,
        onComplete: () => returnClassificationItemToSpawn(wrongItem)
      });
    } else {
      returnClassificationItemToSpawn(state.grabbedClassificationItem);
      updateStats(t.statusLevel4Drag, '');
    }

    state.grabbedClassificationItem = null;
  }

  if (state.grabbedClassificationItem) {
    gsap.killTweensOf(state.grabbedClassificationItem.mesh.position);
    if (state.grabbedClassificationItem.artSprite) gsap.killTweensOf(state.grabbedClassificationItem.artSprite.position);
    gsap.killTweensOf(state.grabbedClassificationItem.label.position);
    state.grabbedClassificationItem.mesh.position.lerp(handWorldPos, 0.4);
    state.grabbedClassificationItem.mesh.position.z = 14;
    if (state.grabbedClassificationItem.artSprite) {
      state.grabbedClassificationItem.artSprite.position.lerp(new THREE.Vector3(handWorldPos.x, handWorldPos.y + 10, 13), 0.4);
    }
    state.grabbedClassificationItem.label.position.lerp(new THREE.Vector3(handWorldPos.x, handWorldPos.y - (state.grabbedClassificationItem.def.size + 4), 16), 0.4);
  }
}
