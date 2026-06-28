// Test Suite for Age Calculator Math

// Simulates getDaysInMonth
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// Simulates the JS calculation logic
function calculateAgeMath(birthDay, birthMonth, birthYear, todayDateObj) {
  const currDay = todayDateObj.getDate();
  const currMonth = todayDateObj.getMonth() + 1; // 1-indexed
  const currYear = todayDateObj.getFullYear();
  
  let dDiff = currDay - birthDay;
  let mDiff = currMonth - birthMonth;
  let yDiff = currYear - birthYear;
  
  let adjustedMonth = currMonth;
  let adjustedYear = currYear;
  
  if (dDiff < 0) {
    let prevMonth = adjustedMonth - 1;
    let prevMonthYear = adjustedYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevMonthYear -= 1;
    }
    
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    dDiff += daysInPrevMonth;
    mDiff -= 1;
  }
  
  if (mDiff < 0) {
    mDiff += 12;
    yDiff -= 1;
  }
  
  return { years: yDiff, months: mDiff, days: dDiff };
}

// Scenarios to test
const testCases = [
  {
    name: "Scenario 1: No borrowing required (Birthday has passed)",
    birth: { d: 15, m: 5, y: 1990 },
    today: new Date(2026, 5, 28), // June 28, 2026 (Month index 5 is June)
    expected: { years: 36, months: 1, days: 13 }
  },
  {
    name: "Scenario 2: Day borrowing required",
    birth: { d: 30, m: 5, y: 1990 },
    today: new Date(2026, 5, 28), // June 28, 2026
    // June 28 - May 30: Borrow from May (31 days). 28 + 31 = 59. 59 - 30 = 29 days. 
    // Month decrement: Month is 6 - 1 = 5. Month diff: 5 - 5 = 0.
    expected: { years: 36, months: 0, days: 29 }
  },
  {
    name: "Scenario 3: Month borrowing required",
    birth: { d: 10, m: 10, y: 1990 },
    today: new Date(2026, 5, 28), // June 28, 2026
    // June 28 - Oct 10: Days: 28 - 10 = 18 days.
    // Months: 6 - 10 = -4. Borrow 12: -4 + 12 = 8 months. Years: 2026 - 1990 - 1 = 35.
    expected: { years: 35, months: 8, days: 18 }
  },
  {
    name: "Scenario 4: Both Day and Month borrowing required",
    birth: { d: 31, m: 8, y: 1995 },
    today: new Date(2026, 5, 28), // June 28, 2026
    // Today: 2026-06-28. Birth: 1995-08-31
    // Days: 28 - 31 < 0. Borrow from May (31 days). 28 + 31 = 59. 59 - 31 = 28 days.
    // Months: (6 - 1) - 8 = -3. Borrow from 2026. -3 + 12 = 9 months.
    // Years: 2026 - 1 - 1995 = 30 years.
    expected: { years: 30, months: 9, days: 28 }
  },
  {
    name: "Scenario 5: Leap year boundary test",
    birth: { d: 29, m: 2, y: 2020 },
    today: new Date(2021, 1, 28), // Feb 28, 2021 (Month index 1 is Feb)
    // Today: 2021-02-28. Birth: 2020-02-29
    // Days: 28 - 29 < 0. Borrow from Jan (31 days). 28 + 31 = 59. 59 - 29 = 30 days.
    // Months: (2 - 1) - 2 = -1. Borrow from 2021. -1 + 12 = 11 months.
    // Years: 2021 - 1 - 2020 = 0 years.
    expected: { years: 0, months: 11, days: 30 }
  },
  {
    name: "Scenario 6: Birthday is today",
    birth: { d: 28, m: 6, y: 1990 },
    today: new Date(2026, 5, 28), // June 28, 2026
    expected: { years: 36, months: 0, days: 0 }
  }
];

let failed = false;

console.log("Running age calculator math test cases...\n");

testCases.forEach((tc, index) => {
  const result = calculateAgeMath(tc.birth.d, tc.birth.m, tc.birth.y, tc.today);
  const match = result.years === tc.expected.years &&
                result.months === tc.expected.months &&
                result.days === tc.expected.days;
  
  if (match) {
    console.log(`✅ [Pass] ${tc.name}`);
  } else {
    console.error(`❌ [Fail] ${tc.name}`);
    console.error(`   Expected: ${JSON.stringify(tc.expected)}`);
    console.error(`   Received: ${JSON.stringify(result)}`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log("\nAll tests passed successfully!");
}
