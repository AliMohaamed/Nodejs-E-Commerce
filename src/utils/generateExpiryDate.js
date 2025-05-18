import {
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addWeeks,
  addMonths,
  addYears,
} from "date-fns";

/**
 * Generate a precise expiry date using date-fns.
 * @param {number} amount - The amount of time to add (must be > 0).
 * @param {'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'} unit - The unit of time.
 * @returns {Date} The calculated expiry date.
 * @throws Will throw an error if unit is invalid or amount is not positive.
 */
export function generateExpiryDate(amount, unit) {
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  const now = new Date();

  switch (unit) {
    case "seconds":
      return addSeconds(now, amount);
    case "minutes":
      return addMinutes(now, amount);
    case "hours":
      return addHours(now, amount);
    case "days":
      return addDays(now, amount);
    case "weeks":
      return addWeeks(now, amount);
    case "months":
      return addMonths(now, amount);
    case "years":
      return addYears(now, amount);
    default:
      throw new Error(`Invalid time unit provided: ${unit}`);
  }
}

// Examples to use
/*
generateExpiryDate(5, "minutes");   // after 5 minutes
generateExpiryDate(1, "hours");     // after 1 hour
generateExpiryDate(2, "days");      // after 2 days
generateExpiryDate(3, "weeks");     // after 3 weeks
generateExpiryDate(1, "months");    // (e.g., from May 13 to June 13)
generateExpiryDate(1, "years");     // (from 2025 to 2026)
*/

// Manual
/*
export function generateExpiryDate(amount, unit) {
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  const unitsInMilliseconds = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000, // Approximate
    years: 365 * 24 * 60 * 60 * 1000, // Approximate
  };

  const multiplier = unitsInMilliseconds[unit];

  if (!multiplier) {
    throw new Error(`Invalid unit provided: ${unit}`);
  }

  return new Date(Date.now() + amount * multiplier);
}

 */
