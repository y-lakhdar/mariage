import { wedding } from '../content/wedding';

export const calendarTitle = 'Mariage de Marie-Audrée & Yassine';
export const calendarDescription = 'Une fin de semaine pour célébrer notre amour entourés de nos amis. Arrivée le 8 octobre, célébration le 9, départ le 10. Hébergement sur place. Horaires, tarifs et repas à confirmer.';
const compact = (date: string) => date.replaceAll('-', '');

export function googleCalendarUrl() {
  const params = new URLSearchParams({ action: 'TEMPLATE', text: calendarTitle, dates: `${compact(wedding.dates.arrival)}/${compact(wedding.dates.calendarEnd)}`, details: calendarDescription, location: wedding.address });
  return `https://calendar.google.com/calendar/render?${params}`;
}

const escape = (value: string) => value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
// RFC 5545 : replie chaque ligne à 75 octets sans couper un caractère UTF-8.
function fold(line: string) {
  const lines = [''];
  for (const character of line) {
    if (new TextEncoder().encode(lines[lines.length - 1] + character).length > 75) lines.push(' ');
    lines[lines.length - 1] += character;
  }
  return lines.join('\r\n');
}

export function calendarFile() {
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Marie-Audree et Yassine//Invitation//FR', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', 'UID:yassine-marie-audree-20271008@mariage', `DTSTAMP:${compact(wedding.updated)}T120000Z`,
    `DTSTART;VALUE=DATE:${compact(wedding.dates.arrival)}`, `DTEND;VALUE=DATE:${compact(wedding.dates.calendarEnd)}`,
    `SUMMARY:${escape(calendarTitle)}`, `DESCRIPTION:${escape(calendarDescription)}`, `LOCATION:${escape(wedding.address)}`,
    'TRANSP:TRANSPARENT', 'END:VEVENT', 'END:VCALENDAR', '',
  ].map(fold).join('\r\n');
}
