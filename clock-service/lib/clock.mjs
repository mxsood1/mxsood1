const zone = 'America/Toronto';
const fmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit',
  hourCycle: 'h23', timeZoneName: 'short'
});
export function torontoParts(date) {
  return Object.fromEntries(fmt.formatToParts(date).map(p => [p.type, p.value]));
}
const xml = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const rowHeight=28;
const roll = (id,x,width,values,period,delay,loop=true) => {
  const steps=values.length-1;
  return `<clipPath id="${id}-clip"><rect x="${x}" y="20" width="${width}" height="28"/></clipPath>
<style>@keyframes ${id}-roll{from{transform:translateY(0)}to{transform:translateY(-${steps*rowHeight}px)}}</style>
<g clip-path="url(#${id}-clip)"><g class="clock-roll" data-id="${id}" data-values="${values.join('|')}" data-delay="${delay}" transform="translate(0 -${Math.floor(delay/(period/steps))*rowHeight})" style="animation:${id}-roll ${period}s steps(${steps},end) -${delay}s ${loop?'infinite':'1'};animation-fill-mode:forwards">${values.map((v,i)=>`<text x="${x}" y="${40+i*rowHeight}">${xml(v)}</text>`).join('')}</g></g>`;
};
export function renderClock(now=new Date()) {
  const p=torontoParts(now);
  const second=Number(p.second)+now.getMilliseconds()/1000;
  const withinHour=Number(p.minute)*60+second;
  const baseHour=Math.floor(now.getTime()/3600000)*3600000;
  // Generate 31 days of hour labels from actual instants so the clock crosses
  // Toronto daylight-saving changes correctly without any script in the SVG.
  const hourLabels=Array.from({length:745},(_,i)=>torontoParts(new Date(baseHour+i*3600000)).hour);
  const zoneLabels=Array.from({length:745},(_,i)=>torontoParts(new Date(baseHour+i*3600000)).timeZoneName);
  const numbers=Array.from({length:61},(_,i)=>String(i%60).padStart(2,'0'));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="66" viewBox="0 0 1200 66" role="img" aria-labelledby="title desc" data-generated-at="${now.toISOString()}">
<title id="title">Toronto local time</title><desc id="desc">${p.hour}:${p.minute}:${p.second} ${p.timeZoneName} when fetched. The displayed clock advances locally. Reload to synchronize; intermediary image caching may delay the initial time.</desc>
<style>@keyframes pulse{50%{opacity:.3}}.signal{animation:pulse 2s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.signal{animation:none}}@media(max-width:600px){.clock-left{transform:translate(-66px,-53px) scale(2.6)}.id{display:none}}</style>
<g class="clock-left">
<circle class="signal" cx="48" cy="35" r="2.5" fill="#9dbdcb"/>
<g font-family="monospace" font-size="14" letter-spacing="1.4" fill="#8fa4bd">
<text x="64" y="40">TORONTO</text><text x="149" y="40" fill="#51627b">/</text>
${roll('hours',172,23,hourLabels,744*3600,withinHour,false)}
<text x="195" y="40">:</text>
${roll('minutes',207,23,numbers,3600,withinHour)}
<text x="230" y="40">:</text>
${roll('seconds',242,23,numbers,60,second)}
${roll('zone',282,50,zoneLabels,744*3600,withinHour,false)}
</g></g><text class="id" x="1156" y="40" text-anchor="end" font-family="monospace" font-size="12" letter-spacing="2.5" fill="#718198">MXSOOD1 / 001</text>
</svg>`;
}
export const clockHeaders = {
  'Content-Type':'image/svg+xml; charset=utf-8',
  'Cache-Control':'no-store, no-cache, max-age=0, must-revalidate',
  'CDN-Cache-Control':'no-store',
  'Vercel-CDN-Cache-Control':'no-store',
  'X-Content-Type-Options':'nosniff'
};
