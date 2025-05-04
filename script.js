// Constants
const WEEKDAY_GOAL = 60 * 60; // 60 minutes in seconds
const WEEKEND_GOAL = 120 * 60; // 120 minutes in seconds

// DOM Elements
const currentTimer = document.getElementById('current-timer');
const learningLogged = document.getElementById('learning-logged');
const learningRemaining = document.getElementById('learning-remaining');
const executingLogged = document.getElementById('executing-logged');
const executingRemaining = document.getElementById('executing-remaining');
const learningStart = document.getElementById('learning-start');
const learningStop = document.getElementById('learning-stop');
const executingStart = document.getElementById('executing-start');
const executingStop = document.getElementById('executing-stop');
const modeToggle = document.getElementById('mode-toggle');

// State
let currentActivity = null;
let startTime = null;
let timerInterval = null;
let learningTime = 0;
let executingTime = 0;
let isWeekendMode = false;

// Initialize
function initialize() {
    // Load saved data
    const savedData = localStorage.getItem('timerData');
    if (savedData) {
        const data = JSON.parse(savedData);
        const lastDate = new Date(data.lastDate);
        const today = new Date();
        
        // Reset if it's a new day
        if (lastDate.getDate() !== today.getDate() || 
            lastDate.getMonth() !== today.getMonth() || 
            lastDate.getFullYear() !== today.getFullYear()) {
            learningTime = 0;
            executingTime = 0;
        } else {
            learningTime = data.learningTime;
            executingTime = data.executingTime;
        }
    }
    
    // Set initial mode based on current day
    isWeekendMode = [0, 6].includes(new Date().getDay());
    modeToggle.checked = isWeekendMode;
    
    updateDisplays();
}

// Timer functions
function startTimer(activity) {
    if (currentActivity) return;
    
    currentActivity = activity;
    startTime = Date.now();
    
    if (activity === 'learning') {
        learningStart.disabled = true;
        learningStop.disabled = false;
    } else {
        executingStart.disabled = true;
        executingStop.disabled = false;
    }
    
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    if (!currentActivity) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    
    if (currentActivity === 'learning') {
        learningTime += elapsed;
        learningStart.disabled = false;
        learningStop.disabled = true;
    } else {
        executingTime += elapsed;
        executingStart.disabled = false;
        executingStop.disabled = true;
    }
    
    currentActivity = null;
    startTime = null;
    clearInterval(timerInterval);
    timerInterval = null;
    
    updateDisplays();
    saveData();
}

function updateTimer() {
    if (!startTime) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    currentTimer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Display functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`;
}

function updateDisplays() {
    const goal = isWeekendMode ? WEEKEND_GOAL : WEEKDAY_GOAL;
    
    learningLogged.textContent = formatTime(learningTime);
    executingLogged.textContent = formatTime(executingTime);
    
    const learningRemainingTime = Math.max(0, goal - learningTime);
    const executingRemainingTime = Math.max(0, goal - executingTime);
    
    learningRemaining.textContent = formatTime(learningRemainingTime);
    executingRemaining.textContent = formatTime(executingRemainingTime);
}

// Data persistence
function saveData() {
    const data = {
        lastDate: new Date().toISOString(),
        learningTime,
        executingTime
    };
    localStorage.setItem('timerData', JSON.stringify(data));
}

// Event listeners
learningStart.addEventListener('click', () => startTimer('learning'));
learningStop.addEventListener('click', stopTimer);
executingStart.addEventListener('click', () => startTimer('executing'));
executingStop.addEventListener('click', stopTimer);

modeToggle.addEventListener('change', () => {
    isWeekendMode = modeToggle.checked;
    updateDisplays();
});

// Initialize the app
initialize(); 