import { CAM_PADDING } from './data.js';

export function createHandTracking(videoElement, onResults) {
  let handsInstance = null;
  let offscreenCanvas = null;
  let offscreenCtx = null;
  let lastVideoTime = -1;
  let running = false;

  async function initWebcam() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
    });

    videoElement.srcObject = stream;
    await new Promise(resolve => {
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        resolve();
      };
    });
  }

  function normalizeResults(results) {
    const vw = videoElement.videoWidth;
    const vh = videoElement.videoHeight;

    if (!results.multiHandLandmarks?.length) {
      onResults(null);
      return;
    }

    if (vw > 0 && vh > 0 && offscreenCanvas) {
      const wPad = vw + CAM_PADDING * 2;
      const hPad = vh + CAM_PADDING * 2;
      onResults(results.multiHandLandmarks[0].map(lm => ({
        x: (lm.x * wPad - CAM_PADDING) / vw,
        y: (lm.y * hPad - CAM_PADDING) / vh,
        z: lm.z
      })));
      return;
    }

    onResults(results.multiHandLandmarks[0]);
  }

  async function processVideoFrame() {
    if (!running) return;

    if (videoElement.readyState >= 2 && videoElement.currentTime !== lastVideoTime) {
      lastVideoTime = videoElement.currentTime;
      const vw = videoElement.videoWidth;
      const vh = videoElement.videoHeight;

      if (vw > 0 && vh > 0) {
        if (!offscreenCanvas) {
          offscreenCanvas = document.createElement('canvas');
          offscreenCtx = offscreenCanvas.getContext('2d');
        }

        offscreenCanvas.width = vw + CAM_PADDING * 2;
        offscreenCanvas.height = vh + CAM_PADDING * 2;
        offscreenCtx.fillStyle = 'black';
        offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        offscreenCtx.drawImage(videoElement, CAM_PADDING, CAM_PADDING, vw, vh);
        if (handsInstance) await handsInstance.send({ image: offscreenCanvas });
      } else if (handsInstance) {
        await handsInstance.send({ image: videoElement });
      }
    }

    requestAnimationFrame(processVideoFrame);
  }

  function initHandTracking() {
    if (handsInstance) return;

    handsInstance = new Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    handsInstance.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    handsInstance.onResults(normalizeResults);

    running = true;
    processVideoFrame();
  }

  return {
    initWebcam,
    initHandTracking
  };
}

export function detectGesture(landmarks) {
  if (!landmarks) return 'None';

  const getDistance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const pinchDist = getDistance(thumbTip, indexTip);
  const indexFolded = getDistance(landmarks[8], wrist) < getDistance(landmarks[5], wrist);
  const middleFolded = getDistance(landmarks[12], wrist) < getDistance(landmarks[9], wrist);
  const thumbOut = getDistance(thumbTip, landmarks[5]) > 0.1;

  const isExtended = (tipIndex, mcpIndex) => getDistance(landmarks[tipIndex], wrist) > getDistance(landmarks[mcpIndex], wrist) * 1.12;
  const indexExtended = isExtended(8, 5);
  const middleExtended = isExtended(12, 9);
  const ringExtended = isExtended(16, 13);
  const pinkyExtended = isExtended(20, 17);

  const middleRingGap = Math.abs(landmarks[12].x - landmarks[16].x);
  const indexMiddleGap = Math.abs(landmarks[8].x - landmarks[12].x);
  const ringPinkyGap = Math.abs(landmarks[16].x - landmarks[20].x);

  if (indexFolded && middleFolded && thumbOut) return 'ThumbsUp';
  if (pinchDist < 0.08) return 'Pinch';
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) return 'Peace';
  if (indexExtended && !middleExtended && !ringExtended && pinkyExtended) return 'Metal';
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && middleRingGap > indexMiddleGap * 1.35 && middleRingGap > ringPinkyGap * 1.35) return 'Vulcan';
  if (pinchDist > 0.12) return 'Open';
  return 'Hold';
}
