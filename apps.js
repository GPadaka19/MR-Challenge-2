const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('output');
const canvasCtx = canvasElement.getContext('2d');
const fireEmojis = [
  document.getElementById('fire-emoji-0'),
  document.getElementById('fire-emoji-1'),
  document.getElementById('fire-emoji-2'),
  document.getElementById('fire-emoji-3'),
  document.getElementById('fire-emoji-4')
];

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

function fingersUp(landmarks) {
  // Thumb: 4 (tip), 3 (before tip)
  // Index: 8 (tip), 6 (pip)
  // Middle: 12 (tip), 10 (pip)
  // Ring: 16 (tip), 14 (pip)
  // Pinky: 20 (tip), 18 (pip)
  if (!landmarks) return [false, false, false, false, false];
  const tips = [4, 8, 12, 16, 20];
  const pips = [3, 6, 10, 14, 18];
  // Thumb: cek x, lain cek y
  const thumbUp = landmarks[4].x > landmarks[3].x;
  const fingersUp = [1,2,3,4].map(i => landmarks[tips[i]].y < landmarks[pips[i]].y);
  return [thumbUp, ...fingersUp];
}

function showFiresByFingers(landmarks, upArray) {
  const tips = [4, 8, 12, 16, 20];
  for (let i = 0; i < 5; i++) {
    if (upArray[i]) {
      const tip = landmarks[tips[i]];
      const el = fireEmojis[i];
      // Ambil ukuran elemen
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      el.style.display = 'block';
      el.style.left = `${tip.x * canvasElement.width - w/2}px`;
      el.style.top = `${tip.y * canvasElement.height - h/2}px`;
    } else {
      fireEmojis[i].style.display = 'none';
    }
  }
}

function hideFires() {
  for (let i = 0; i < 5; i++) {
    fireEmojis[i].style.display = 'none';
  }
}

hands.onResults(results => {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const upArray = fingersUp(landmarks);
    showFiresByFingers(landmarks, upArray);
  } else {
    hideFires();
  }

  canvasCtx.restore();
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480
});
camera.start();