// Timer variables
let timerInterval;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let currentMode = 'pomodoro';

// DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');
const blockNameInput = document.getElementById('block-name');
const blockDurationInput = document.getElementById('block-duration');
const addBlockBtn = document.getElementById('add-block-btn');
const blocksList = document.getElementById('blocks');
const emptyBlocksMessage = document.getElementById('empty-blocks-message');

// Timer functions
function updateTimerDisplay() {
  minutesDisplay.textContent = minutes.toString().padStart(2, '0');
  secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  
  timerInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        // Timer completed
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Play notification sound or show alert
        alert('Temps écoulé!');
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  
  // Reset to current mode's default time
  setTimerMode(currentMode);
  
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function setTimerMode(mode) {
  // Remove active class from all mode buttons
  pomodoroBtn.classList.remove('active');
  shortBreakBtn.classList.remove('active');
  longBreakBtn.classList.remove('active');
  
  // Set time based on mode
  switch (mode) {
    case 'pomodoro':
      minutes = 25;
      pomodoroBtn.classList.add('active');
      break;
    case 'shortBreak':
      minutes = 5;
      shortBreakBtn.classList.add('active');
      break;
    case 'longBreak':
      minutes = 15;
      longBreakBtn.classList.add('active');
      break;
  }
  
  seconds = 0;
  currentMode = mode;
  updateTimerDisplay();
}

// Block functions
function addBlock() {
  const name = blockNameInput.value.trim();
  const duration = parseInt(blockDurationInput.value);
  
  if (!name || isNaN(duration) || duration < 5) {
    alert('Veuillez entrer un nom de tâche et une durée valide (min. 5 minutes)');
    return;
  }
  
  const blockId = Date.now();
  const block = { id: blockId, name, duration };
  
  // Create block element
  const li = document.createElement('li');
  li.dataset.id = blockId;
  li.innerHTML = `
    <span>${name} (${duration} min)</span>
    <div class="block-actions">
      <button class="start-block">Démarrer</button>
      <button class="delete-block">Supprimer</button>
    </div>
  `;
  
  // Add event listeners
  const startBlockBtn = li.querySelector('.start-block');
  const deleteBlockBtn = li.querySelector('.delete-block');
  
  startBlockBtn.addEventListener('click', () => {
    // Set timer to block duration
    minutes = duration;
    seconds = 0;
    updateTimerDisplay();
    
    // Start timer
    if (isRunning) {
      clearInterval(timerInterval);
    }
    startTimer();
  });
  
  deleteBlockBtn.addEventListener('click', () => {
    li.remove();
    updateEmptyBlocksMessage();
  });
  
  // Add to list
  blocksList.appendChild(li);
  updateEmptyBlocksMessage();
  
  // Clear inputs
  blockNameInput.value = '';
  blockDurationInput.value = '25';
  blockNameInput.focus();
}

function updateEmptyBlocksMessage() {
  if (blocksList.children.length > 0) {
    emptyBlocksMessage.style.display = 'none';
  } else {
    emptyBlocksMessage.style.display = 'block';
  }
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

pomodoroBtn.addEventListener('click', () => setTimerMode('pomodoro'));
shortBreakBtn.addEventListener('click', () => setTimerMode('shortBreak'));
longBreakBtn.addEventListener('click', () => setTimerMode('longBreak'));

addBlockBtn.addEventListener('click', addBlock);
blockNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addBlock();
});

// Initialize
updateTimerDisplay();
updateEmptyBlocksMessage();