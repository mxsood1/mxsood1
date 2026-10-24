import { renderClock, clockHeaders } from '../lib/clock.mjs';
export function GET() {
  return new Response(renderClock(), {headers:clockHeaders});
}
