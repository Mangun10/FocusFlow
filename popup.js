// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Tab Navigation
  const navItems = document.querySelectorAll('nav li');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Schedule Tab Elements
  const formatBtns = document.querySelectorAll('.format-btn');
  const formatPanels = document.querySelectorAll('.format-panel');
  const scheduleInput = document.getElementById('schedule-input');
  const jsonScheduleInput = document.getElementById('json-schedule-input');
  const parseButton = document.getElementById('parse-button');
  const exampleButton = document.getElementById('example-button');
  const statusMessage = document.getElementById('status-message');
  const parsedOutput = document.getElementById('parsed-output');
  const currentDateElement = document.getElementById('current-date');
  
  // Current Task Tab Elements
  const currentTimeElement = document.getElementById('current-time');
  const noCurrentTask = document.getElementById('no-current-task');
  const currentTaskDetails = document.getElementById('current-task-details');
  const currentTaskName = document.getElementById('current-task-name');
  const currentTaskTime = document.getElementById('current-task-time');
  const taskProgress = document.getElementById('task-progress');
  const timeRemaining = document.getElementById('time-remaining');
  const progressPercentage = document.getElementById('progress-percentage');
  const completeTaskBtn = document.getElementById('complete-task');
  const skipTaskBtn = document.getElementById('skip-task');
  const noNextTask = document.getElementById('no-next-task');
  const nextTaskDetails = document.getElementById('next-task-details');
  const nextTaskName = document.getElementById('next-task-name');
  const nextTaskTime = document.getElementById('next-task-time');
  
  // Analytics Tab Elements
  const periodBtns = document.querySelectorAll('.period-btn');
  const completionRate = document.getElementById('completion-rate');
  const productiveHours = document.getElementById('productive-hours');
  const focusScore = document.getElementById('focus-score');
  const categoryTbody = document.getElementById('category-tbody');
  
  // Settings Tab Elements
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const timeFormatToggle = document.getElementById('time-format-toggle');
  const notificationsToggle = document.getElementById('notifications-toggle');
  const exportDataBtn = document.getElementById('export-data');
  const clearDataBtn = document.getElementById('clear-data');
  
  // State Variables
  let schedule = [];
  let currentTask = null;
  let nextTask = null;
  let activeFormat = 'text';
  let activePeriod = 'day';
  let use24HourFormat = false;
  let chartInstance = null;
  
  // Initialize Application
  init();
  
  // Initialize App
  function init() {
    // Set current date and time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Load settings and schedule
    loadSettings();
    loadSchedule();
    
    // Set up event listeners
    setupTabNavigation();
    setupFormatSwitching();
    setupPeriodSwitching();
    setupButtonListeners();
    setupSettingsListeners();
    
    // Start task tracking
    updateCurrentTask();
    setInterval(updateCurrentTask, 30000); // Update every 30 seconds
    
    // Initialize analytics
    initializeAnalytics();
  }
  
  // Tab Navigation
  function setupTabNavigation() {
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        // Update active tab
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding content
        const tabId = item.getAttribute('data-tab');
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        
        // Special handling for tabs
        if (tabId === 'current') {
          updateCurrentTask();
        } else if (tabId === 'analytics') {
          updateAnalytics(activePeriod);
        }
      });
    });
  }
  
  // Format Switching (Text/JSON)
  function setupFormatSwitching() {
    formatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active format button
        formatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding format panel
        activeFormat = btn.getAttribute('data-format');
        formatPanels.forEach(panel => panel.classList.remove('active'));
        document.getElementById(`${activeFormat}-input`).classList.add('active');
      });
    });
  }
  
  // Analytics Period Switching
  function setupPeriodSwitching() {
    periodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active period button
        periodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update analytics for selected period
        activePeriod = btn.getAttribute('data-period');
        updateAnalytics(activePeriod);
      });
    });
  }
  
  // Button Event Listeners
  function setupButtonListeners() {
    // Parse Schedule Button
    parseButton.addEventListener('click', () => {
      parseSchedule();
    });
    
    // Load Example Button
    exampleButton.addEventListener('click', () => {
      loadExampleSchedule();
    });
    
    // Complete Task Button
    completeTaskBtn.addEventListener('click', () => {
      if (currentTask) {
        updateTaskStatus(currentTask.id, 'completed');
        showStatus('Task marked as completed!', 'success');
        updateCurrentTask();
      }
    });
    
    // Skip Task Button
    skipTaskBtn.addEventListener('click', () => {
      if (currentTask) {
        updateTaskStatus(currentTask.id, 'skipped');
        showStatus('Task skipped.', 'warning');
        updateCurrentTask();
      }
    });
  }
  
  // Settings Event Listeners
  function setupSettingsListeners() {
    // Dark Mode Toggle
    darkModeToggle.addEventListener('change', () => {
      if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      saveSetting('darkMode', darkModeToggle.checked);
    });
    
    // 24-Hour Format Toggle
    timeFormatToggle.addEventListener('change', () => {
      use24HourFormat = timeFormatToggle.checked;
      saveSetting('use24HourFormat', use24HourFormat);
      updateDateTime();
      updateCurrentTask();
    });
    
    // Notifications Toggle
    notificationsToggle.addEventListener('change', () => {
      saveSetting('notifications', notificationsToggle.checked);
    });
    
    // Export Data Button
    exportDataBtn.addEventListener('click', () => {
      exportData();
    });
    
    // Clear Data Button
    clearDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        clearAllData();
      }
    });
  }
  
  // Update Date and Time Display
  function updateDateTime() {
    const now = new Date();
    
    // Update date display
    currentDateElement.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Update time display with proper format
    currentTimeElement.textContent = formatTime(now);
  }
  
  // Format time based on user preference
  function formatTime(date) {
    if (use24HourFormat) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }
  
  // Parse Schedule (from Text or JSON)
  function parseSchedule() {
    clearStatus();
    
    try {
      let timeBlocks;
      
      if (activeFormat === 'text') {
        const textInput = scheduleInput.value.trim();
        if (!textInput) {
          showStatus('Please enter a schedule.', 'error');
          return;
        }
        timeBlocks = parseTextSchedule(textInput);
      } else {
        const jsonInput = jsonScheduleInput.value.trim();
        if (!jsonInput) {
          showStatus('Please enter a JSON schedule.', 'error');
          return;
        }
        timeBlocks = parseJSONSchedule(jsonInput);
      }
      
      if (timeBlocks.length === 0) {
        showStatus('No valid schedule blocks found. Please check the format.', 'warning');
        return;
      }
      
      // Sort blocks by start time
      timeBlocks.sort((a, b) => {
        return convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime);
      });
      
      // Save schedule and update UI
      saveSchedule(timeBlocks);
      displaySchedule(timeBlocks);
      showStatus(`Successfully parsed ${timeBlocks.length} time blocks!`, 'success');
      
      // Switch to Current tab after 1.5 seconds
      setTimeout(() => {
        navItems[1].click();
      }, 1500);
      
    } catch (error) {
      console.error('Error parsing schedule:', error);
      showStatus(`Error: ${error.message}`, 'error');
    }
  }
  
  // Parse Text Schedule
  function parseTextSchedule(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const timeBlocks = [];
    
    for (let line of lines) {
      // Improved regex for various time formats
      const timeBlockRegex = /(\d{1,2}[:\.]\d{2}\s*(?:AM|PM|am|pm)?)\s*[–\-\—]\s*(\d{1,2}[:\.]\d{2}\s*(?:AM|PM|am|pm)?)\s*:\s*(.*)/i;
      
      const match = timeBlockRegex.exec(line);
      
      if (match) {
        const [_, rawStartTime, rawEndTime, task] = match;
        
        // Standardize times and ensure AM/PM is included
        const startTime = standardizeTime(rawStartTime);
        const endTime = standardizeTime(rawEndTime);
        
        // Categorize task
        const category = categorizeTask(task);
        
        timeBlocks.push({
          id: generateId(),
          startTime,
          endTime,
          task,
          category,
          status: 'pending'
        });
      }
    }
    
    return timeBlocks;
  }
  
  // Parse JSON Schedule
  function parseJSONSchedule(jsonText) {
    try {
      let parsed = JSON.parse(jsonText);
      let blocks;
      
      if (Array.isArray(parsed)) {
        blocks = parsed;
      } else if (typeof parsed === 'object') {
        blocks = [parsed];
      } else {
        throw new Error('Invalid JSON structure. Expected array or object.');
      }
      
      // Validate and standardize blocks
      const timeBlocks = blocks.map(block => {
        if (!block.startTime || !block.endTime || !block.task) {
          throw new Error('Each block must have startTime, endTime, and task properties.');
        }
        
        return {
          id: block.id || generateId(),
          startTime: standardizeTime(block.startTime),
          endTime: standardizeTime(block.endTime),
          task: block.task,
          category: block.category || categorizeTask(block.task),
          status: block.status || 'pending'
        };
      });
      
      return timeBlocks;
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw error;
    }
  }
  
  // Standardize Time Format
  function standardizeTime(timeStr) {
    // Remove whitespace and convert to uppercase
    timeStr = timeStr.trim().toUpperCase();
    
    // Check if AM/PM is present
    const hasPeriod = timeStr.includes('AM') || timeStr.includes('PM');
    
    // Extract hours, minutes, and period
    let hours, minutes, period;
    
    if (hasPeriod) {
      period = timeStr.includes('AM') ? 'AM' : 'PM';
      const timePart = timeStr.replace(/AM|PM/g, '').trim();
      [hours, minutes] = timePart.split(/[:\.]/);
    } else {
      [hours, minutes] = timeStr.split(/[:\.]/);
      
      // Default period based on 24-hour interpretation
      hours = parseInt(hours);
      period = (hours >= 12) ? 'PM' : 'AM';
      
      // Convert to 12-hour format if needed
      if (hours > 12) {
        hours = hours - 12;
      } else if (hours === 0) {
        hours = 12;
      }
    }
    
    // Ensure hours and minutes are valid
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid time format: ${timeStr}`);
    }
    
    // Format hours and ensure minutes has two digits
    hours = hours.toString();
    minutes = minutes.toString().padStart(2, '0');
    
    return `${hours}:${minutes} ${period}`;
  }
  
  // Categorize Task based on keywords
  function categorizeTask(task) {
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('work') || taskLower.includes('office') || taskLower.includes('meeting')) {
      return 'Work';
    } else if (taskLower.includes('study') || taskLower.includes('practice') || taskLower.includes('research') || taskLower.includes('dsa')) {
      return 'Study';
    } else if (taskLower.includes('exercise') || taskLower.includes('gym') || taskLower.includes('workout')) {
      return 'Exercise';
    } else if (taskLower.includes('meal') || taskLower.includes('breakfast') || taskLower.includes('lunch') || taskLower.includes('dinner')) {
      return 'Meal';
    } else if (taskLower.includes('sleep') || taskLower.includes('rest') || taskLower.includes('nap') || taskLower.includes('wake')) {
      return 'Rest';
    } else if (taskLower.includes('hobby') || taskLower.includes('guitar') || taskLower.includes('read') || taskLower.includes('watch')) {
      return 'Leisure';
    } else {
      return 'Other';
    }
  }
  
  // Display Schedule in UI
  function displaySchedule(timeBlocks) {
    parsedOutput.innerHTML = '';
    
    if (timeBlocks.length === 0) {
      parsedOutput.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No schedule blocks found</p></div>';
      return;
    }
    
    timeBlocks.forEach(block => {
      const blockElement = document.createElement('div');
      blockElement.className = 'time-block';
      
      // Add status class
      if (block.status === 'completed') {
        blockElement.classList.add('completed');
      } else if (block.status === 'skipped') {
        blockElement.classList.add('skipped');
      }
      
      const indicator = document.createElement('div');
      indicator.className = 'time-block-indicator';
      indicator.style.backgroundColor = getCategoryColor(block.category);
      
      const content = document.createElement('div');
      content.className = 'time-block-content';
      
      const timeElement = document.createElement('div');
      timeElement.className = 'time-block-time';
      timeElement.textContent = `${block.startTime} - ${block.endTime}`;
      
      const taskElement = document.createElement('div');
      taskElement.className = 'time-block-task';
      taskElement.textContent = block.task;
      
      const categoryElement = document.createElement('div');
      categoryElement.className = 'time-block-category';
      categoryElement.textContent = block.category;
      
      content.appendChild(timeElement);
      content.appendChild(taskElement);
      content.appendChild(categoryElement);
      
      blockElement.appendChild(indicator);
      blockElement.appendChild(content);
      parsedOutput.appendChild(blockElement);
    });
  }
  
  // Update Current Task Display
  function updateCurrentTask() {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Find current and next tasks
    currentTask = null;
    nextTask = null;
    
    for (let i = 0; i < schedule.length; i++) {
      const block = schedule[i];
      const startMinutes = convertTimeToMinutes(block.startTime);
      const endMinutes = convertTimeToMinutes(block.endTime);
      
      if (currentTimeInMinutes >= startMinutes && currentTimeInMinutes < endMinutes && block.status === 'pending') {
        currentTask = block;
        
        // Find next pending task
        for (let j = i + 1; j < schedule.length; j++) {
          if (schedule[j].status === 'pending') {
            nextTask = schedule[j];
            break;
          }
        }
        
        break;
      } else if (startMinutes > currentTimeInMinutes && block.status === 'pending' && !nextTask) {
        nextTask = block;
      }
    }
    
    // Update current task display
    if (currentTask) {
      noCurrentTask.style.display = 'none';
      currentTaskDetails.style.display = 'block';
      
      currentTaskName.textContent = currentTask.task;
      currentTaskTime.textContent = `${currentTask.startTime} to ${currentTask.endTime}`;
      
      // Calculate progress
      const startMinutes = convertTimeToMinutes(currentTask.startTime);
      const endMinutes = convertTimeToMinutes(currentTask.endTime);
      const totalMinutes = endMinutes - startMinutes;
      const elapsedMinutes = currentTimeInMinutes - startMinutes;
      const percent = Math.min(Math.floor((elapsedMinutes / totalMinutes) * 100), 100);
      
      // Update progress bar and text
      taskProgress.style.width = `${percent}%`;
      progressPercentage.textContent = `${percent}%`;
      
      // Update time remaining
      const minutesRemaining = endMinutes - currentTimeInMinutes;
      if (minutesRemaining >= 60) {
        const hours = Math.floor(minutesRemaining / 60);
        const mins = minutesRemaining % 60;
        timeRemaining.textContent = `${hours}h ${mins}m remaining`;
      } else {
        timeRemaining.textContent = `${minutesRemaining} minutes remaining`;
      }
    } else {
      noCurrentTask.style.display = 'block';
      currentTaskDetails.style.display = 'none';
    }
    
    // Update next task display
    if (nextTask) {
      noNextTask.style.display = 'none';
      nextTaskDetails.style.display = 'block';
      
      nextTaskName.textContent = nextTask.task;
      nextTaskTime.textContent = `${nextTask.startTime} to ${nextTask.endTime}`;
    } else {
      noNextTask.style.display = 'block';
      nextTaskDetails.style.display = 'none';
    }
  }
  
  // Initialize Analytics Charts
  function initializeAnalytics() {
    updateAnalytics('day');
  }
  
  // Update Analytics for Selected Period
  function updateAnalytics(period) {
    // Calculate task statistics from schedule
    const stats = calculateStats(period);
    
    // Update summary stats
    completionRate.textContent = `${stats.completionRate}%`;
    productiveHours.textContent = `${stats.productiveHours}h`;
    focusScore.textContent = stats.focusScore;
    
    // Update chart
    updateChart(stats.categories, stats.timeSpent);
    
    // Update category table
    updateCategoryTable(stats.categoryData);
  }
  
  // Calculate Statistics
  function calculateStats(period) {
    // For demo purposes, we'll use sample data
    // In a real app, you would calculate this from the schedule and task history
    
    const sampleStats = {
      day: {
        completionRate: 85,
        productiveHours: 6.5,
        focusScore: 75,
        categories: ['Work', 'Study', 'Exercise', 'Meal', 'Rest', 'Leisure'],
        timeSpent: [4.5, 2, 1, 1.5, 9, 6],
        categoryData: [
          { category: 'Work', timeSpent: 4.5, completion: 90 },
          { category: 'Study', timeSpent: 2, completion: 100 },
          { category: 'Exercise', timeSpent: 1, completion: 100 },
          { category: 'Meal', timeSpent: 1.5, completion: 100 },
          { category: 'Rest', timeSpent: 9, completion: 100 },
          { category: 'Leisure', timeSpent: 6, completion: 50 }
        ]
      },
      week: {
        completionRate: 78,
        productiveHours: 32.5,
        focusScore: 68,
        categories: ['Work', 'Study', 'Exercise', 'Meal', 'Rest', 'Leisure'],
        timeSpent: [22, 10.5, 5, 10.5, 56, 8],
        categoryData: [
          { category: 'Work', timeSpent: 22, completion: 80 },
          { category: 'Study', timeSpent: 10.5, completion: 85 },
          { category: 'Exercise', timeSpent: 5, completion: 90 },
          { category: 'Meal', timeSpent: 10.5, completion: 100 },
          { category: 'Rest', timeSpent: 56, completion: 100 },
          { category: 'Leisure', timeSpent: 8, completion: 60 }
        ]
      },
      month: {
        completionRate: 72,
        productiveHours: 128,
        focusScore: 65,
        categories: ['Work', 'Study', 'Exercise', 'Meal', 'Rest', 'Leisure'],
        timeSpent: [90, 38, 20, 42, 224, 32],
        categoryData: [
          { category: 'Work', timeSpent: 90, completion: 75 },
          { category: 'Study', timeSpent: 38, completion: 80 },
          { category: 'Exercise', timeSpent: 20, completion: 70 },
          { category: 'Meal', timeSpent: 42, completion: 100 },
          { category: 'Rest', timeSpent: 224, completion: 100 },
          { category: 'Leisure', timeSpent: 32, completion: 45 }
        ]
      }
    };
    
    return sampleStats[period];
  }
  
  // Update Chart
  function updateChart(categories, timeSpent) {
    const ctx = document.getElementById('time-distribution-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    // Create new chart
    chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: timeSpent,
          backgroundColor: categories.map(category => getCategoryColor(category)),
          borderWidth: 1,
          borderColor: getComputedStyle(document.body).getPropertyValue('--bg-color')
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: getComputedStyle(document.body).getPropertyValue('--text-color'),
              font: {
                family: "'Roboto', sans-serif"
              },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}h`;
              }
            }
          }
        }
      }
    });
  }
  
  // Update Category Table
  function updateCategoryTable(categoryData) {
    categoryTbody.innerHTML = '';
    
    categoryData.forEach(data => {
      const row = document.createElement('tr');
      
      // Category with color dot
      const categoryCell = document.createElement('td');
      const colorDot = document.createElement('span');
      colorDot.className = 'category-color';
      colorDot.style.backgroundColor = getCategoryColor(data.category);
      categoryCell.appendChild(colorDot);
      categoryCell.appendChild(document.createTextNode(data.category));
      
      // Time spent and completion cells
      const timeCell = document.createElement('td');
      timeCell.textContent = `${data.timeSpent}h`;
      
      const completionCell = document.createElement('td');
      completionCell.textContent = `${data.completion}%`;
      
      row.appendChild(categoryCell);
      row.appendChild(timeCell);
      row.appendChild(completionCell);
      
      categoryTbody.appendChild(row);
    });
  }
  
  // Load Example Schedule
  function loadExampleSchedule() {
    if (activeFormat === 'text') {
      scheduleInput.value = 
`6:00 - 6:15 AM: Wake Up
6:45 - 7:30 AM: DSA Practice
7:30 - 8:00 AM: Breakfast
8:00 - 8:30 AM: DSA Practice
8:45 AM - 6:00 PM: Office Work
6:00 - 6:30 PM: Return Home + Refresh
6:30 - 7:30 PM: Exercise
7:30 - 8:00 PM: Dinner
8:00 - 9:00 PM: Placement Book / AWS
9:00 - 10:00 PM: Aptitude Practice
10:00 - 10:30 PM: Guitar Practice
10:30 - 11:00 PM: Journaling + Wind Down`;
    } else {
      jsonScheduleInput.value = JSON.stringify([
        {
          "startTime": "6:00 AM",
          "endTime": "6:15 AM",
          "task": "Wake Up",
          "category": "Rest"
        },
        {
          "startTime": "6:45 AM",
          "endTime": "7:30 AM",
          "task": "DSA Practice",
          "category": "Study"
        },
        {
          "startTime": "7:30 AM",
          "endTime": "8:00 AM",
          "task": "Breakfast",
          "category": "Meal"
        },
        {
          "startTime": "8:00 AM",
          "endTime": "8:30 AM",
          "task": "DSA Practice",
          "category": "Study"
        },
        {
          "startTime": "8:45 AM",
          "endTime": "6:00 PM",
          "task": "Office Work",
          "category": "Work"
        }
      ], null, 2);
    }
    
    showStatus('Example schedule loaded! Click "Parse Schedule" to use it.', 'success');
  }
  
  // Update Task Status
  function updateTaskStatus(taskId, status) {
    const index = schedule.findIndex(task => task.id === taskId);
    if (index !== -1) {
      schedule[index].status = status;
      saveSchedule(schedule);
    }
  }
  
  // Export Data
  function exportData() {
    const data = {
      schedule: schedule,
      settings: {
        darkMode: darkModeToggle.checked,
        use24HourFormat: timeFormatToggle.checked,
        notifications: notificationsToggle.checked
      }
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "focusflow-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
  
  // Clear All Data
  function clearAllData() {
    chrome.storage.local.clear(() => {
      schedule = [];
      displaySchedule([]);
      updateCurrentTask();
      showStatus('All data has been cleared.', 'success');
    });
  }
  
  // Storage Functions
  function saveSchedule(timeBlocks) {
    schedule = timeBlocks;
    chrome.storage.local.set({ 'focusflow_schedule': timeBlocks }, function() {
      console.log('Schedule saved with', timeBlocks.length, 'blocks');
    });
  }
  
  function loadSchedule() {
    chrome.storage.local.get('focusflow_schedule', function(result) {
      if (result.focusflow_schedule && result.focusflow_schedule.length > 0) {
        schedule = result.focusflow_schedule;
        displaySchedule(schedule);
        console.log('Loaded schedule with', schedule.length, 'blocks');
      }
    });
  }
  
  function saveSetting(key, value) {
    chrome.storage.local.get('focusflow_settings', function(result) {
      const settings = result.focusflow_settings || {};
      settings[key] = value;
      chrome.storage.local.set({ 'focusflow_settings': settings }, function() {
        console.log('Setting saved:', key, value);
      });
    });
  }
  
  function loadSettings() {
    chrome.storage.local.get('focusflow_settings', function(result) {
      if (result.focusflow_settings) {
        const settings = result.focusflow_settings;
        
        // Apply dark mode
        if (settings.darkMode) {
          document.body.classList.add('dark-mode');
          darkModeToggle.checked = true;
        }
        
        // Apply time format
        if (settings.use24HourFormat) {
          use24HourFormat = true;
          timeFormatToggle.checked = true;
        }
        
        // Apply notifications setting
        if (settings.hasOwnProperty('notifications')) {
          notificationsToggle.checked = settings.notifications;
        }
        
        console.log('Settings loaded');
      }
    });
  }
  
  // Helper Functions
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  function convertTimeToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  }
  
  function getCategoryColor(category) {
    const colors = {
      'Work': '#4f46e5',      // Primary color
      'Study': '#f97316',     // Orange
      'Exercise': '#22c55e',  // Green
      'Meal': '#06b6d4',      // Cyan
      'Rest': '#8b5cf6',      // Purple
      'Leisure': '#eab308',   // Yellow
      'Other': '#64748b'      // Slate
    };
    
    return colors[category] || colors['Other'];
  }
  
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Clear status after 5 seconds
    setTimeout(clearStatus, 5000);
  }
  
  function clearStatus() {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
  }
});