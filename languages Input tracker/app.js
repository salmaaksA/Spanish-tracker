const dayBar = document.getElementById('day-bar');
const dayLeftText = document.getElementById('day-left');
const grandFill = document.getElementById('grand-fill');
const grandStats = document.getElementById('grand-stats');
const streakText = document.getElementById('streak-count');

const dayGoal = 80;
const grandGoalMinutes = 3000; // 50 hours * 60 mins
const radius = 75;
const circumference = 2 * Math.PI * radius;

dayBar.style.strokeDasharray = `${circumference} ${circumference}`;

// Load Data
let storage = JSON.parse(localStorage.getItem('spanishData')) || {
    todayMins: 0,
    totalMins: 0,
    streak: 0,
    lastDate: new Date().toLocaleDateString()
};

function checkNewDay() {
    const today = new Date().toLocaleDateString();
    if (storage.lastDate !== today) {
        storage.todayMins = 0;
        storage.lastDate = today;
        save();
    }
}

function updateUI() {
    // Update Day Circle
    const dayLeft = Math.max(0, dayGoal - storage.todayMins);
    dayLeftText.innerText = dayLeft;
    const dayOffset = circumference - (Math.min(storage.todayMins / dayGoal, 1) * circumference);
    dayBar.style.strokeDashoffset = dayOffset;

    // Update Grand Bar
    const grandHours = (storage.totalMins / 60).toFixed(1);
    const progressPercent = Math.min((storage.totalMins / grandGoalMinutes) * 100, 100);
    grandFill.style.width = progressPercent + "%";
    grandStats.innerText = `${grandHours} / 50 hrs completed`;
    
    streakText.innerText = storage.streak;
}

function addTime() {
    const input = document.getElementById('minutes-input');
    const val = parseInt(input.value);

    if (val > 0) {
        // If this session completes the 80min daily goal for the first time today
        if (storage.todayMins < dayGoal && (storage.todayMins + val) >= dayGoal) {
            storage.streak += 1;
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFB7C5', '#D4A5FF'] });
        }

        storage.todayMins += val;
        storage.totalMins += val;
        
        save();
        updateUI();
        input.value = '';
    }
}

function save() {
    localStorage.setItem('spanishData', JSON.stringify(storage));
}

function resetApp() {
    if(confirm("Are you sure you want to clear your 50h journey?")) {
        localStorage.clear();
        location.reload();
    }
}

// Start
checkNewDay();
updateUI();