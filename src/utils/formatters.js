/**
 * Helper formatters for monetary values, Firestore timestamps, and dates.
 */

export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(timestamp) {
  if (!timestamp) return '—';

  let date;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp.seconds != null) {
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    return '—';
  }

  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateShort(timestamp) {
  if (!timestamp) return '—';

  let date;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp.seconds != null) {
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
