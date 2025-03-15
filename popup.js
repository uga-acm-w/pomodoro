const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');

let isRunning = false; // Track timer state locally

function updateTimer(timeLeft) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Request the current timer state from the background script
chrome.runtime.sendMessage({ action: 'getTime' }, (response) => {
  console.log('Received time from background:', response);
  updateTimer(response.timeLeft);
  isRunning = response.isRunning; // Sync running state
  startButton.textContent = isRunning ? 'Pause' : 'Start';
});

startButton.addEventListener('click', () => {
  console.log('Start/Pause button clicked');
  if (isRunning) {
    chrome.runtime.sendMessage({ action: 'pause' });
    startButton.textContent = 'Start';
  } else {
    chrome.runtime.sendMessage({ action: 'start' });
    startButton.textContent = 'Pause';
  }
  isRunning = !isRunning; // Toggle state
});

resetButton.addEventListener('click', () => {
  console.log('Reset button clicked');
  chrome.runtime.sendMessage({ action: 'reset' });
  isRunning = false;
  startButton.textContent = 'Start';
  updateTimer(25 * 60);
});

// Listen for timer updates from the background script
chrome.runtime.onMessage.addListener((request) => {
  if (request.timeLeft !== undefined) {
    console.log('Received time update from background:', request.timeLeft);
    updateTimer(request.timeLeft);
  }
});
