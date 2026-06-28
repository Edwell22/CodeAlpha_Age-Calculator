// Logic Engine - TimeCraft

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const themeToggle = document.getElementById('theme-toggle');
  const ageForm = document.getElementById('age-form');
  const inputDay = document.getElementById('input-day');
  const inputMonth = document.getElementById('input-month');
  const inputYear = document.getElementById('input-year');
  
  const errorDay = document.getElementById('error-day');
  const errorMonth = document.getElementById('error-month');
  const errorYear = document.getElementById('error-year');
  
  const groupDay = document.getElementById('group-day');
  const groupMonth = document.getElementById('group-month');
  const groupYear = document.getElementById('group-year');
  
  const resultYears = document.getElementById('result-years');
  const resultMonths = document.getElementById('result-months');
  const resultDays = document.getElementById('result-days');
  
  const statsPanel = document.getElementById('stats-panel');
  const statWeekday = document.getElementById('stat-weekday');
  const statNextBirthday = document.getElementById('stat-next-birthday');
  const statWeeks = document.getElementById('stat-weeks');
  const statDays = document.getElementById('stat-days');
  const statHours = document.getElementById('stat-hours');
  const statHeartbeats = document.getElementById('stat-heartbeats');
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  const stepV1 = document.getElementById('step-v1');
  const stepV2 = document.getElementById('step-v2');
  const stepV3 = document.getElementById('step-v3');
  
  const calcCurrYear = document.getElementById('calc-curr-year');
  const calcCurrMonth = document.getElementById('calc-curr-month');
  const calcCurrDay = document.getElementById('calc-curr-day');
  
  const calcBirthYear = document.getElementById('calc-birth-year');
  const calcBirthMonth = document.getElementById('calc-birth-month');
  const calcBirthDay = document.getElementById('calc-birth-day');
  
  const mathStepsLog = document.getElementById('math-steps-log');

  // --- Theme Toggle ---
  const savedTheme = localStorage.getItem('theme') || 'dark-theme';
  document.body.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.className = 'light-theme';
      localStorage.setItem('theme', 'light-theme');
    } else {
      document.body.className = 'dark-theme';
      localStorage.setItem('theme', 'dark-theme');
    }
  });

  // --- Tab Navigation ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // --- Helpers ---
  function getDaysInMonth(year, month) {
    // month is 1-indexed
    return new Date(year, month, 0).getDate();
  }

  function resetValidationDisplay() {
    [groupDay, groupMonth, groupYear].forEach(g => g.classList.remove('error-state'));
    [errorDay, errorMonth, errorYear].forEach(e => e.textContent = '');
    
    // Reset flow step badges
    [stepV1, stepV2, stepV3].forEach(step => {
      const badge = step.querySelector('.step-status');
      badge.textContent = 'Pending';
      badge.className = 'step-status status-pending';
      step.classList.remove('active-step');
    });
  }

  function updateStepStatus(stepElement, status, message = '') {
    const badge = stepElement.querySelector('.step-status');
    stepElement.classList.add('active-step');
    
    if (status === 'running') {
      badge.textContent = 'Running...';
      badge.className = 'step-status status-running';
    } else if (status === 'pass') {
      badge.textContent = 'Pass';
      badge.className = 'step-status status-pass';
    } else if (status === 'fail') {
      badge.textContent = 'Fail';
      badge.className = 'step-status status-fail';
    }
  }

  function animateNumber(element, target, duration = 1000) {
    if (target === 0) {
      element.textContent = '0';
      return;
    }
    
    let start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * target);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }
    
    requestAnimationFrame(update);
  }

  // --- Core Validation Flow ---
  async function runValidationFlow(dayVal, monthVal, yearVal) {
    resetValidationDisplay();
    const today = new Date();
    
    // Step 1: Non-Emptiness Check
    updateStepStatus(stepV1, 'running');
    await new Promise(resolve => setTimeout(resolve, 300)); // Visual delay
    
    let hasEmpty = false;
    if (!dayVal) {
      groupDay.classList.add('error-state');
      errorDay.textContent = 'This field is required';
      hasEmpty = true;
    }
    if (!monthVal) {
      groupMonth.classList.add('error-state');
      errorMonth.textContent = 'This field is required';
      hasEmpty = true;
    }
    if (!yearVal) {
      groupYear.classList.add('error-state');
      errorYear.textContent = 'This field is required';
      hasEmpty = true;
    }
    
    if (hasEmpty) {
      updateStepStatus(stepV1, 'fail');
      triggerShake();
      return false;
    }
    updateStepStatus(stepV1, 'pass');

    // Step 2: Range Checks
    updateStepStatus(stepV2, 'running');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const day = parseInt(dayVal, 10);
    const month = parseInt(monthVal, 10);
    const year = parseInt(yearVal, 10);
    
    let rangeError = false;
    if (day < 1 || day > 31) {
      groupDay.classList.add('error-state');
      errorDay.textContent = 'Must be a valid day';
      rangeError = true;
    }
    if (month < 1 || month > 12) {
      groupMonth.classList.add('error-state');
      errorMonth.textContent = 'Must be a valid month';
      rangeError = true;
    }
    if (year > today.getFullYear()) {
      groupYear.classList.add('error-state');
      errorYear.textContent = 'Must be in the past';
      rangeError = true;
    } else if (year < 1800) {
      groupYear.classList.add('error-state');
      errorYear.textContent = 'Must be after 1799';
      rangeError = true;
    }
    
    if (rangeError) {
      updateStepStatus(stepV2, 'fail');
      triggerShake();
      return false;
    }
    updateStepStatus(stepV2, 'pass');

    // Step 3: Calendar Integrity Check
    updateStepStatus(stepV3, 'running');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if the combination exists (e.g. Feb 30, April 31)
    const daysInTargetMonth = getDaysInMonth(year, month);
    if (day > daysInTargetMonth) {
      groupDay.classList.add('error-state');
      errorDay.textContent = `Must be a valid date (Feb/months with 30 days)`;
      updateStepStatus(stepV3, 'fail');
      triggerShake();
      return false;
    }
    
    // Check if the date is in the future overall
    const birthDate = new Date(year, month - 1, day);
    if (birthDate > today) {
      groupYear.classList.add('error-state');
      errorYear.textContent = 'Must be in the past';
      updateStepStatus(stepV3, 'fail');
      triggerShake();
      return false;
    }
    
    updateStepStatus(stepV3, 'pass');
    return true;
  }

  function triggerShake() {
    const card = document.querySelector('.calculator-card');
    card.classList.add('shake-animation');
    setTimeout(() => {
      card.classList.remove('shake-animation');
    }, 400);
  }

  // --- Calculation Math & Logging ---
  function calculateAgeMath(birthDay, birthMonth, birthYear) {
    const today = new Date();
    const currDay = today.getDate();
    const currMonth = today.getMonth() + 1; // 1-indexed
    const currYear = today.getFullYear();
    
    // Setup initial calculation values for simulation card
    calcCurrYear.textContent = currYear;
    calcCurrMonth.textContent = String(currMonth).padStart(2, '0');
    calcCurrDay.textContent = String(currDay).padStart(2, '0');
    
    calcBirthYear.textContent = birthYear;
    calcBirthMonth.textContent = String(birthMonth).padStart(2, '0');
    calcBirthDay.textContent = String(birthDay).padStart(2, '0');
    
    let dDiff = currDay - birthDay;
    let mDiff = currMonth - birthMonth;
    let yDiff = currYear - birthYear;
    
    let logs = [];
    
    logs.push({
      title: 'Initial Subtraction Setup',
      math: `Days: ${currDay} - ${birthDay} = ${dDiff} | Months: ${currMonth} - ${birthMonth} = ${mDiff} | Years: ${currYear} - ${birthYear} = ${yDiff}`,
      explain: 'We subtract the birth date values from today\'s date values coordinate-by-coordinate.'
    });
    
    // If days subtraction is negative, borrow days from the previous month
    let adjustedMonth = currMonth;
    let adjustedYear = currYear;
    
    if (dDiff < 0) {
      // Find the previous month index relative to current
      // If current month is Jan (1), previous is Dec (12) of previous year
      let prevMonth = adjustedMonth - 1;
      let prevMonthYear = adjustedYear;
      if (prevMonth === 0) {
        prevMonth = 12;
        prevMonthYear -= 1;
      }
      
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
      const originalDDiff = dDiff;
      dDiff += daysInPrevMonth;
      mDiff -= 1; // Decrement months since we borrowed
      
      logs.push({
        title: 'Day Borrowing Triggered',
        math: `Days: ${originalDDiff} + ${daysInPrevMonth} (Days in ${getMonthName(prevMonth)} ${prevMonthYear}) = ${dDiff}\nMonths: ${currMonth - birthMonth} - 1 = ${mDiff}`,
        explain: `Because today's day (${currDay}) is smaller than birth day (${birthDay}), we borrow the total days of the previous month (${daysInPrevMonth} days) and decrement the months difference by 1.`
      });
    } else {
      logs.push({
        title: 'Day Calculation Success',
        math: `Days difference = ${dDiff} days`,
        explain: `Today's day (${currDay}) is greater than or equal to birth day (${birthDay}). No borrowing needed.`
      });
    }
    
    // If months subtraction is negative, borrow months from the year
    if (mDiff < 0) {
      const originalMDiff = mDiff;
      mDiff += 12;
      yDiff -= 1; // Decrement year since we borrowed
      
      logs.push({
        title: 'Month Borrowing Triggered',
        math: `Months: ${originalMDiff} + 12 = ${mDiff}\nYears: ${currYear - birthYear} - 1 = ${yDiff}`,
        explain: `Because months difference is negative (${originalMDiff}), we borrow 12 months from the current year and decrement the years difference by 1.`
      });
    } else {
      logs.push({
        title: 'Month & Year Calculation Success',
        math: `Months difference = ${mDiff} months | Years difference = ${yDiff} years`,
        explain: `Months difference is non-negative. No year borrowing required.`
      });
    }
    
    logs.push({
      title: 'Final Age Summary',
      math: `Age: ${yDiff} Years, ${mDiff} Months, ${dDiff} Days`,
      explain: `The calculation concludes. You have lived for exactly ${yDiff} years, ${mDiff} months, and ${dDiff} days.`
    });
    
    renderMathLogs(logs);
    return { years: yDiff, months: mDiff, days: dDiff };
  }

  function getMonthName(monthIndex) {
    const names = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return names[monthIndex - 1] || '';
  }

  function renderMathLogs(logs) {
    mathStepsLog.innerHTML = '';
    logs.forEach((log, index) => {
      const item = document.createElement('div');
      item.className = 'step-log-item';
      
      item.innerHTML = `
        <div class="step-log-header">Step ${index + 1}: ${log.title}</div>
        <pre class="step-log-math">${log.math}</pre>
        <div class="step-log-explain">${log.explain}</div>
      `;
      
      mathStepsLog.appendChild(item);
    });
  }

  // --- Life Milestones and Stats ---
  function computeMilestones(day, month, year) {
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    // Weekday name
    const weekdayOptions = { weekday: 'long' };
    const birthWeekday = birthDate.toLocaleDateString('en-US', weekdayOptions);
    statWeekday.textContent = birthWeekday;
    
    // Days until next birthday
    const currentYear = today.getFullYear();
    let nextBday = new Date(currentYear, month - 1, day);
    
    // If birthday has already occurred this year, set next birthday to next year
    if (nextBday < today) {
      nextBday.setFullYear(currentYear + 1);
    }
    
    const msDiff = nextBday - today;
    const daysUntilNext = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
    
    if (daysUntilNext === 365 || daysUntilNext === 366 || (month - 1 === today.getMonth() && day === today.getDate())) {
      statNextBirthday.textContent = 'Today! 🎉';
    } else {
      statNextBirthday.textContent = `${daysUntilNext} day${daysUntilNext > 1 ? 's' : ''}`;
    }
    
    // Total numbers lived
    const totalMs = today - birthDate;
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    
    // Average resting heart rate is ~80bpm.
    // Total minutes * 80
    const totalMinutes = Math.floor(totalMs / (1000 * 60));
    const totalHeartbeats = totalMinutes * 75; // Using 75 bpm standard
    
    statDays.textContent = totalDays.toLocaleString();
    statWeeks.textContent = totalWeeks.toLocaleString();
    statHours.textContent = totalHours.toLocaleString();
    statHeartbeats.textContent = totalHeartbeats.toLocaleString();
    
    // Show stats card
    statsPanel.classList.remove('hidden');
  }

  // --- Form Submit Trigger ---
  ageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dayVal = inputDay.value.trim();
    const monthVal = inputMonth.value.trim();
    const yearVal = inputYear.value.trim();
    
    const isValid = await runValidationFlow(dayVal, monthVal, yearVal);
    
    if (isValid) {
      const d = parseInt(dayVal, 10);
      const m = parseInt(monthVal, 10);
      const y = parseInt(yearVal, 10);
      
      // Calculate
      const age = calculateAgeMath(d, m, y);
      
      // Animate Primary Results
      animateNumber(resultYears, age.years, 800);
      animateNumber(resultMonths, age.months, 800);
      animateNumber(resultDays, age.days, 800);
      
      // Calculate Secondary stats
      computeMilestones(d, m, y);
    } else {
      // Clear results in case of failure
      resultYears.textContent = '- -';
      resultMonths.textContent = '- -';
      resultDays.textContent = '- -';
      statsPanel.classList.add('hidden');
    }
  });
});
