import type { APIRoute } from 'astro';
import { calendarFile } from '../lib/calendar';

export const GET: APIRoute = () => new Response(calendarFile(), {
  headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="mariage-marie-audree-yassine.ics"' },
});
