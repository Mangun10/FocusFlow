# FocusFlow

**FocusFlow** is a Chrome Extension designed to help you manage your daily time blocks efficiently. It provides a timeline-based visualization of your day and offers actionable insights for improved productivity, focus, and self-care. Whether you're a student, professional, or anyone looking to optimize your routine, FocusFlow gives you a clear, at-a-glance view and analytics of your day.

---

## ✨ Features

- **Customizable Timeline:** Create a personalized daily schedule with time blocks for any activity.
- **Multiple Input Formats:** Enter your schedule in plain text or JSON for flexibility.
- **Color-Coded Blocks:** Distinct color assignments for different categories (work, breaks, meals, sleep, etc.).
- **Current Task Tracking:** Instantly see your current and upcoming tasks based on the present time.
- **Notifications:** Get timely alerts for task start, end, and upcoming tasks.
- **Analytics Dashboard:** Visualize your productivity, completion rate, and focus score with period-based charts.
- **Downloadable Data:** Export your day's summary for records or review.
- **Dark Mode & Settings:** Toggle dark mode, switch between 12/24-hour time formats, and enable/disable notifications.
- **Wellness Tracking:** Includes time blocks for sleep, naps, and self-care.

---

## 🗓️ How It Works

1. **Enter Your Schedule:**  
   Add your daily routine as a series of time blocks in either a simple text format or as JSON.
2. **Visualize Your Day:**  
   Instantly see your day mapped out as a timeline, with each block color-coded for clarity.
3. **Track in Real-Time:**  
   The extension always shows your current task and notifies you of important transitions.
4. **Analyze Your Performance:**  
   Access your productivity stats and focus analytics, and download your schedule summary if desired.

---

## 📝 Schedule Input Formats

You can enter your schedule in two ways:

### 1. Text Format

Use a format like this:

```
08:00 AM – 09:00 AM: Morning Routine
09:00 AM – 11:00 AM: Deep Work
11:00 AM – 11:30 AM: Break
11:30 AM – 01:00 PM: Project Work
01:00 PM – 02:00 PM: Lunch
02:00 PM – 03:00 PM: Meetings
03:00 PM – 05:00 PM: Learning / Study
05:00 PM – 05:30 PM: Exercise
05:30 PM – 06:00 PM: Review & Plan
06:00 PM – 11:00 PM: Personal Time
11:00 PM: Sleep
```

- Each line defines a block: `Start Time – End Time: Task Name`
- You can include any activity: study, work, meals, breaks, creative time, relaxation, sleep, etc.
- Times can be in 12-hour (AM/PM) or 24-hour format, according to your settings.

### 2. JSON Format

Alternatively, use a JSON array:

```json
[
  { "startTime": "08:00", "endTime": "09:00", "task": "Morning Routine" },
  { "startTime": "09:00", "endTime": "11:00", "task": "Deep Work" },
  ...
  { "startTime": "23:00", "task": "Sleep" }
]
```

---

## 🟩 Example Use Cases

- **Students:** Schedule classes, study sessions, breaks, and activities.
- **Professionals:** Plan focused work blocks, meetings, meals, and downtime.
- **Wellness Tracking:** Track sleep, exercise, meditation, and relaxation.
- **Anyone:** Build and stick to a balanced daily routine.

---

## 🚀 Getting Started

1. **Clone or Download:**
   ```bash
   git clone https://github.com/Mangun10/FocusFlow.git
   ```
2. **Load as Chrome Extension:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `FocusFlow` directory.

3. **Start Scheduling!**

---

## ⚙️ Settings & Customization

- **Dark Mode:** Available for comfortable night use.
- **Time Format:** Switch between 12-hour and 24-hour displays.
- **Notifications:** Enable/disable task alerts.
- **Export:** Download your schedule and stats as a JSON file.
- **Clear Data:** Reset your schedule and analytics.

---

## 📊 Analytics & Insights

- **Completion Rate:** Track how many scheduled tasks you complete.
- **Productive Hours:** Visual breakdown of focus vs. break/other time.
- **Focus Score:** Get an overall productivity score.
- **Category Stats:** See time spent per activity type (work, study, self-care, etc.).

---

## 🛡️ Privacy & Storage

- All data is stored locally in your browser and never leaves your device.

---

## 🤝 Contributions

Contributions are welcome! Open issues or submit pull requests to help improve FocusFlow.

---

## 📝 License

No license specified yet.

---

## 🙏 Credits

Developed by [Mangun10](https://github.com/Mangun10)

---

**Start building your ideal day, one time block at a time!**
