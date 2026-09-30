const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatGraduationDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${WEEKDAYS[date.getUTCDay()]} ${MONTHS[date.getUTCMonth()]} ${day} ${isoDate.slice(0, 4)} 00:00:00 GMT+0530 (India Standard Time)`;
}
