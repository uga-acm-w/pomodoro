let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let timer;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message in background:', request);
  
  if (request.action === 'start') {
    startTimer();
  } else if (request.action === 'pause') {
    pauseTimer();
  } else if (request.action === 'reset') {
    resetTimer();
  } else if (request.action === 'getTime') {
    sendResponse({ timeLeft, isRunning });
  }
  
  return true; // Required for async sendResponse
});

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    chrome.runtime.sendMessage({ timeLeft, isRunning }); // Update popup with running state

    timer = setInterval(() => {
      timeLeft--;
      console.log('Time left:', timeLeft);
      
      if (timeLeft === 0) {
        clearInterval(timer);
        isRunning = false;
        showNotification();
        resetTimer();
      }
      
      // Send time update to the popup
      chrome.runtime.sendMessage({ timeLeft, isRunning });
    }, 1000);
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timer);
    
    // Send updated status to the popup
    chrome.runtime.sendMessage({ timeLeft, isRunning });
  }
}

function resetTimer() {
  isRunning = false;
  clearInterval(timer);
  timeLeft = 25 * 60;
  
  // Send reset update to the popup
  chrome.runtime.sendMessage({ timeLeft, isRunning });
}

function showNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Pomodoro Timer',
    message: 'Time is up! Take a break.'
  });
}
