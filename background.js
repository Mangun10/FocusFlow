// Background script for FocusFlow
console.log('FocusFlow background script loaded');

// State variables
let schedule = [];
let notificationsEnabled = true;

// Set up when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('FocusFlow extension installed/updated');
  loadData();
  
  // Set up alarm for checking current task
  chrome.alarms.create('checkCurrentTask', {
    periodInMinutes: 1
  });
});

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkCurrentTask') {
    checkCurrentTask();
  }
});

// Load data from storage
function loadData() {
  chrome.storage.local.get(['focusflow_schedule', 'focusflow_settings'], (result) => {
    if (result.focusflow_schedule) {
      schedule = result.focusflow_schedule;
      console.log('Loaded schedule with', schedule.length, 'blocks');
    }
    
    if (result.focusflow_settings) {
      notificationsEnabled = !!result.focusflow_settings.notifications;
      console.log('Notifications enabled:', notificationsEnabled);
    }
  });
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.focusflow_schedule) {
      schedule = changes.focusflow_schedule.newValue || [];
      console.log('Schedule updated, now has', schedule.length, 'blocks');
    }
    
    if (changes.focusflow_settings && changes.focusflow_settings.newValue) {
      notificationsEnabled = !!changes.focusflow_settings.newValue.notifications;
      console.log('Notification settings updated:', notificationsEnabled);
    }
  }
});

// Check current task and send notifications if needed
function checkCurrentTask() {
  if (!notificationsEnabled || schedule.length === 0) {
    return;
  }
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Find current and upcoming tasks
  let currentTask = null;
  let upcomingTask = null;
  
  for (let i = 0; i < schedule.length; i++) {
    const task = schedule[i];
    if (task.status !== 'pending') continue;
    
    const startMinutes = convertTimeToMinutes(task.startTime);
    const endMinutes = convertTimeToMinutes(task.endTime);
    
    // Check if this is the current task
    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      currentTask = task;
      
      // If this just started (within the last minute), send notification
      if (currentMinutes - startMinutes <= 1) {
        sendTaskStartNotification(task);
      }
      
      // Check for task end approaching (within 5 minutes)
      if (endMinutes - currentMinutes <= 5 && endMinutes - currentMinutes > 4) {
        sendTaskEndingSoonNotification(task);
      }
    }
    
    // Check if this is the next upcoming task (starting in the next 5 minutes)
    if (startMinutes > currentMinutes && startMinutes - currentMinutes <= 5 && !upcomingTask) {
      upcomingTask = task;
      
      // If the task is starting very soon (within 5 minutes), send notification
      if (startMinutes - currentMinutes <= 5 && startMinutes - currentMinutes > 4) {
        sendUpcomingTaskNotification(task);
      }
    }
  }
  
  // Update badge with current task info
  updateBadge(currentTask);
}

// Send notification for task start
function sendTaskStartNotification(task) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Task Started',
    message: task.task,
    contextMessage: `From ${task.startTime} to ${task.endTime}`,
    priority: 1
  });
}

// Send notification for task ending soon
function sendTaskEndingSoonNotification(task) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Task Ending Soon',
    message: `${task.task} will end in 5 minutes`,
    contextMessage: `Current task ends at ${task.endTime}`,
    priority: 1
  });
}

// Send notification for upcoming task
function sendUpcomingTaskNotification(task) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Upcoming Task',
    message: `${task.task} will start in 5 minutes`,
    contextMessage: `From ${task.startTime} to ${task.endTime}`,
    priority: 1
  });
}

// Update extension badge with current task info
function updateBadge(task) {
  if (task) {
    // Display initials of current task
    const initials = getInitials(task.task);
    chrome.action.setBadgeText({ text: initials });
    
    // Set badge color based on task category
    chrome.action.setBadgeBackgroundColor({ 
      color: getCategoryColor(task.category) 
    });
  } else {
    // Clear badge when no active task
    chrome.action.setBadgeText({ text: '' });
  }
}

// Helper: Get initials from task name
function getInitials(text) {
  if (!text) return '';
  
  const words = text.split(' ');
  if (words.length === 1) {
    // For single word, take first two characters
    return text.substring(0, 2).toUpperCase();
  } 
  
  // For multiple words, take first character of first two words
  return (words[0].charAt(0) + (words[1] ? words[1].charAt(0) : '')).toUpperCase();
}

// Helper: Convert time string to minutes
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

// Helper: Get color for category
function getCategoryColor(category) {
  const colors = {
    'Work': [79, 70, 229, 255],       // #4f46e5 in RGBA
    'Study': [249, 115, 22, 255],     // #f97316 in RGBA
    'Exercise': [34, 197, 94, 255],   // #22c55e in RGBA
    'Meal': [6, 182, 212, 255],       // #06b6d4 in RGBA
    'Rest': [139, 92, 246, 255],      // #8b5cf6 in RGBA
    'Leisure': [234, 179, 8, 255],    // #eab308 in RGBA
    'Other': [100, 116, 139, 255]     // #64748b in RGBA
  };
  
  return colors[category] || colors['Other'];
}