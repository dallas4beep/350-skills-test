const C = { bg:'#0D1014', card:'#212328', photo:'#1B292D', text:'#FFFFFF', sub:'#BABFC0', accent:'#448CB6', tag:'#CADDF7' };
const M = { enter: Easing.easeOutExpo, draw: Easing.easeInOutQuart, pop: Easing.easeOutBack };
const tw = (T, s, e, a, b, ease = M.enter) => animate({ from: a, to: b, start: s, end: e, ease })(T);
const io = (T, a, b, c, d) => Math.min(tw(T, a, b, 0, 1), tw(T, c, d, 1, 0));
const F = 'Inter, system-ui, sans-serif', MONO = '"IBM Plex Mono", ui-monospace, monospace';
const TOPICS = ['The headline number', 'The Strait of Hormuz', 'Who pays', "Who's collecting", 'Your monthly bill', 'Solar', 'Is it just the war?', 'What you can do'];
const BEATS = [0.35, 0.8, 1.3, 1.8, 2.4, 3.0, 4.2, 5.2, 5.9, 6.5, 9.3, 12.3, 15.4, 16.6, 19, 21, 23, 25.2, 27, 28.8, 30.6, 32.4, 34.2, 36, 37.8, 39.6, 41.6, 45.5, 50.8, 52.0];
const bump = T => BEATS.reduce((s, b) => s + (T >= b && T < b + 0.5 ? 0.035 * (1 - M.enter((T - b) / 0.5)) : 0), 0);
const PHOTO = window.DALLAS_DENNIS_PHOTO;
const FRAMING = [[0, 1, 780, 470], [5.2, 1.08, 640, 450], [5.9, 1.12, 960, 420], [6.5, 1.15, 980, 420], [9, 1, 700, 460], [15, 1, 780, 470], [16.6, 1.08, 660, 460], [19, 1.1, 640, 450], [21, 1.14, 960, 420], [23, 1, 780, 470]];
const frameAt = T => FRAMING.reduce((f, s) => (T >= s[0] ? s : f), FRAMING[0]);
const CAPS = [
  { at: 4.3, end: 6.0, text: "Hi, I'm Dallas. This is Dennis Rodman." },
  { at: 6.0, end: 7.4, text: "We'll be your guides for four weeks." },
  { at: 7.4, end: 8.9, text: "She doesn't drive. She has opinions about gas anyway." },
  { at: 9.4, end: 12.2, text: 'Then the headlines started.' },
  { at: 12.3, end: 14.9, text: '[Pop culture line, if licensed]' },
];

function Ph({ label, sub, style, light }) {
  return (
    <div style={Object.assign({ position: 'absolute', background: C.photo, outline: '3px dashed rgba(202,221,247,.35)', outlineOffset: -28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: 40, boxSizing: 'border-box' }, style)}>
      <div style={{ font: `500 30px ${MONO}`, color: light ? C.bg : C.tag, textTransform: 'uppercase' }}>{label}</div>
      {sub && <div style={{ font: `400 24px ${MONO}`, color: light ? '#454C51' : C.sub, maxWidth: 760, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}
function Logo({ size = 72 }) {
  return (
    <img src={window.LOGO_350} alt="350" style={{ display: 'block', height: size, width: Math.round(size * 474 / 261), borderRadius: size * 0.14, flex: 'none' }} />
  );
}
function Pop({ T, at, children, style, rot = 0, from = 0.6 }) {
  const p = tw(T, at, at + 0.45, 0, 1, M.pop);
  return <span style={Object.assign({ display: 'inline-block', opacity: clamp(p * 2, 0, 1), transform: `translateY(${30 * (1 - p)}px) scale(${from + (1 - from) * p}) rotate(${rot * p}deg)` }, style)}>{children}</span>;
}
function Sticker({ T, at, text, rot = -4, style, dark }) {
  const p = tw(T, at, at + 0.5, 0, 1, M.pop);
  return <div style={Object.assign({ position: 'absolute', background: dark ? C.bg : C.tag, color: dark ? C.text : C.bg, font: `800 40px ${F}`, padding: '18px 30px', borderRadius: 18, boxShadow: '0 16px 40px rgba(0,0,0,.45)', opacity: clamp(p * 2, 0, 1), transform: `scale(${0.5 + 0.5 * p}) rotate(${rot}deg)`, whiteSpace: 'nowrap' }, style)}>{text}</div>;
}

function Ticker({ T, top, rot, dir = 1, bg = C.bg, fg = C.text, text, speed = 260 }) {
  const unit = text + '   ✦   ';
  const off = ((T * speed * dir) % 1400 + 1400) % 1400;
  return (
    <div style={{ position: 'absolute', left: -300, width: 1680, top, height: 96, background: bg, transform: `rotate(${rot}deg)`, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <div style={{ whiteSpace: 'nowrap', font: `800 56px ${F}`, color: fg, letterSpacing: -0.5, transform: `translateX(${-off}px)` }}>{unit.repeat(6)}</div>
    </div>
  );
}
function Wipe({ T, at, light }) {
  const cols = light ? [C.accent, C.tag, '#fff'] : [C.accent, C.tag, C.bg];
  if (T < at - 0.05 || T > at + 0.8) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {cols.map((c, i) => {
        const x = tw(T, at + i * 0.06, at + 0.55 + i * 0.06, -2400, 2400, M.draw);
        return <div key={i} style={{ position: 'absolute', left: 0, top: -600, width: 1400, height: 3200, background: c, transform: `translateX(${x}px) rotate(18deg)` }} />;
      })}
    </div>
  );
}
const SLAMS = [1.8, 16.6, 25.4, 25.9, 52.0];
const shake = T => SLAMS.reduce((s, b) => { const d = T - b; return d >= 0 && d < 0.35 ? s + Math.sin(d * 90) * 14 * (1 - d / 0.35) : s; }, 0);
const roll = (T, n) => { let r = ''; const k = Math.floor(T * 24); for (let i = 0; i < n; i++) r += ((k * 7 + i * 13 + (k >> i)) % 10); return r; };

function CoverSlide() {
  return (
    <div style={{ width: 1080, height: 1350, background: C.bg, position: 'relative', overflow: 'hidden', fontFamily: F }}>
      <Ph label="5-sec cut from Intro Reel" sub="Hook beat 0:00–0:05" style={{ left: 0, top: 0, width: 1080, height: 540 }} />
      <div style={{ position: 'absolute', right: 80, top: 470, background: C.accent, color: '#fff', font: `800 64px ${F}`, padding: '14px 34px', borderRadius: 22, transform: 'rotate(-4deg)' }}>+$1.26/gal</div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 640, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ font: `800 112px/0.98 ${F}`, color: C.text, letterSpacing: -3 }}>What your fill-up costs:</div>
        <div style={{ font: `800 80px/1 ${F}`, color: C.accent, letterSpacing: -1.5 }}>8 posts, 4 weeks.</div>
      </div>
      <div style={{ position: 'absolute', left: 80, right: 80, bottom: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={88} />
        <div style={{ font: `700 38px ${F}`, color: C.text, display: 'flex', alignItems: 'center', gap: 16 }}>Swipe<div style={{ width: 76, height: 76, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42 }}>→</div></div>
      </div>
    </div>
  );
}

function KCap({ T }) {
  const it = CAPS.find(c => T >= c.at && T < c.end);
  if (!it) return null;
  const words = it.text.split(' ');
  const step = Math.min(0.3, ((it.end - it.at) * 0.55) / words.length);
  const shown = words.filter((_, i) => T >= it.at + i * step).length;
  const o = clamp((it.end - T) / 0.15, 0, 1);
  return (
    <div style={{ position: 'absolute', left: 90, right: 150, bottom: 430, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 12px', opacity: o }}>
      {words.map((w, i) => {
        const p = tw(T, it.at + i * step, it.at + i * step + 0.3, 0, 1, M.pop);
        const on = i === shown - 1;
        return <span key={i} style={{ font: `800 58px/1.1 ${F}`, color: on ? '#fff' : C.bg, background: on ? C.accent : '#fff', boxShadow: '0 6px 18px rgba(0,0,0,.18)', padding: '6px 16px', borderRadius: 14, opacity: i < shown ? 1 : 0, transform: `scale(${0.7 + 0.3 * p})` }}>{w}</span>;
      })}
    </div>
  );
}

function Hook({ T }) {
  const y = T < 10 ? tw(T, 3.7, 4.2, 0, -1920, M.draw) : T >= 54.3 ? tw(T, 54.3, 54.95, 1920, 0, M.draw) : 3000;
  const live = T < 10;
  const ph = !live ? 0 : T < 0.75 ? 0 : T < 1.25 ? 1 : T < 1.8 ? 2 : 0;
  const bg = [C.accent, C.tag, C.bg][ph], fg = ph === 1 ? C.bg : '#fff';
  const punch = live && T >= 1.8 ? tw(T, 1.8, 2.25, 1.35, 1, M.enter) : 1;
  const sh = live ? shake(T) : 0;
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateY(${y}px)`, background: bg, overflow: 'hidden' }}>
      <Ticker T={T} top={150} rot={-7} bg={C.bg} fg="#fff" text="GAS ↑ $1.26/GAL   ✦   WHAT YOUR FILL-UP COSTS" />
      <Ticker T={T} top={1560} rot={5} dir={-1} bg={ph === 1 ? C.accent : C.tag} fg={ph === 1 ? '#fff' : C.bg} text="8 POSTS   ✦   4 WEEKS   ✦   THE GREAT POWER SHIFT" />
      {live && <div style={{ position: 'absolute', left: 80, right: 80, top: 330, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 22px', font: `800 92px/1.05 ${F}`, color: fg, letterSpacing: -2.5, textAlign: 'center' }}>
        <Pop T={T} at={0.3} from={1.6}>Your cost</Pop><Pop T={T} at={0.75} from={1.6}>at the gas pump</Pop><Pop T={T} at={1.25} from={1.6}>is up</Pop>
      </div>}
      <div style={{ position: 'absolute', left: -40, right: -40, top: 600, height: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `translateX(${sh}px) scale(${punch}) rotate(-4deg)` }}>
        <div style={{ font: `800 44px ${F}`, color: ph === 1 ? '#fff' : C.bg, background: ph === 1 ? C.bg : '#fff', padding: '8px 28px', borderRadius: 999 }}>▲ UP</div>
        <div style={{ font: `800 268px/0.9 ${F}`, color: fg, letterSpacing: -12 }}>$1.26</div>
      </div>
      {live && <div style={{ position: 'absolute', left: 80, right: 80, top: 1110, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <Pop T={T} at={2.35} from={1.5} style={{ font: `800 124px/1 ${F}`, color: '#fff', letterSpacing: -4 }}>Here's why,</Pop>
        <Pop T={T} at={2.75} style={{ font: `700 64px/1.1 ${F}`, color: C.bg, background: '#fff', padding: '10px 28px', borderRadius: 16 }}>and what you can do.</Pop>
      </div>}
      {live && <Sticker T={T} at={3.05} text="Stay for Part 8 ↓" rot={7} dark style={{ right: 140, top: 1420, fontSize: 44 }} />}
    </div>
  );
}

function Photo({ W, H }) {
  return <img src={PHOTO} alt="Dallas holding Dennis Rodman, an Italian greyhound" style={{ position: 'absolute', left: 0, top: 0, display: 'block', width: W, height: H, objectFit: 'contain' }} />;
}

function FeedPost({ src, alt, credit, style }) {
  return (
    <div style={Object.assign({ position: 'absolute', width: 380, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: '0 0 0 6px #fff, 0 26px 60px rgba(13,16,20,.3)' }, style)}>
      <img src={src} alt={alt} style={{ display: 'block', width: 380, height: 'auto' }} />
    </div>
  );
}

function Speaker({ T }) {
  const yin = tw(T, 3.7, 4.2, 1920, 0, M.draw);
  const xout = tw(T, 24.6, 25.2, 0, -1080, M.draw);
  const cam = tw(T, 4.1, 4.6, 0, 1, M.pop);
  const CW = 340, CH = CW * 1063 / 1206;
  const hostLbl = io(T, 4.5, 4.9, 8.6, 9);
  const p1 = io(T, 4.6, 5.1, 8.7, 9.1), pa = tw(T, 5.4, 5.9, 0, 1, M.pop), pb = tw(T, 6.6, 7.1, 0, 1, M.pop);
  const hl = tw(T, 9.25, 9.8, 0, 1, M.pop), mark = tw(T, 10.2, 11, 0, 1, M.draw), pc = tw(T, 12.2, 12.75, 0, 1, M.pop), hout = tw(T, 14.8, 15.3, 0, 1, M.draw);
  const w = [15.4, 15.8, 16.3, 16.9];
  const mo = tw(T, 18.6, 19, 1, 0, M.draw);
  const xflip = T >= 16.6 && T < 19;
  const nj = io(T, 19.1, 19.6, 24.5, 24.9), fa = tw(T, 19.6, 20.2, 0, 1, M.pop), fb = tw(T, 20.4, 21.0, 0, 1, M.pop);
  const chip = { font: `800 96px/1 ${F}`, color: C.bg, background: '#fff', padding: '14px 30px', borderRadius: 24, letterSpacing: -3, boxShadow: '0 12px 30px rgba(0,0,0,.2)' };
  const price = { font: `800 120px/1 ${F}`, padding: '10px 32px', borderRadius: 26, letterSpacing: -4, boxShadow: '0 12px 30px rgba(0,0,0,.18)' };
  return (
    <Shot from={3.6} to={25.3}>
      <div style={{ position: 'absolute', inset: 0, background: C.tag, transform: `translate(${xout}px, ${yin}px)` }}>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 720, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22, opacity: p1 }}>
          <div style={{ font: `800 64px/1.05 ${F}`, color: C.bg, letterSpacing: -2 }}>A full tank last year:</div>
          <Pop T={T} at={5.4} rot={-2} style={Object.assign({}, price, { background: '#fff', color: C.bg })}>[$__]</Pop>
          <div style={{ font: `800 64px/1.05 ${F}`, color: C.bg, letterSpacing: -2, opacity: clamp(pb * 2, 0, 1), marginTop: 10 }}>This week:</div>
          <Pop T={T} at={6.6} rot={3} from={0.3} style={Object.assign({}, price, { background: C.accent, color: '#fff', transform: `translateX(${shake(T)}px)` })}>[$__]</Pop>
        </div>

        <div style={{ position: 'absolute', left: 80, right: 80, top: 720, opacity: (1 - hout) * clamp(hl * 2, 0, 1), transform: `translate(${-1100 * hout}px, ${80 * (1 - hl)}px) rotate(${-2.5 * hl}deg) scale(${0.85 + 0.15 * hl})` }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 40, boxShadow: '0 30px 80px rgba(0,0,0,.18)', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ font: `500 24px ${MONO}`, color: '#4A5156' }}>NEWS HEADLINE SCREENSHOT</div>
            <div style={{ position: 'relative', font: `800 60px/1.12 ${F}`, color: '#0D1014' }}>
              <div style={{ position: 'absolute', left: -8, top: 8, height: 64, width: `${mark * 100}%`, background: C.tag, borderRadius: 8 }} />
              <span style={{ position: 'relative' }}>Gas is up $1.26 a gallon from a year ago</span>
            </div>
            <div style={{ font: `600 32px ${F}`, color: '#2B3236' }}>Source: AAA, Oct. 15, 2026</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 400, right: 80, top: 1090, height: 220, opacity: clamp(pc * 2, 0, 1) * (1 - hout), transform: `translate(${300 * (1 - pc) - 1100 * hout}px, 0) rotate(${3 * pc}deg)`, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
          <Ph light label="Reserved: pop culture" sub="Licensed only." style={{ inset: 0, background: '#fff', outline: '3px dashed #448CB6', padding: 20 }} />
        </div>

        <div style={{ position: 'absolute', left: 80, right: 140, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, opacity: T < 15 ? 0 : mo }}>
          <Pop T={T} at={w[0]} style={chip}>Mine went up by</Pop>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Pop T={T} at={w[2]} rot={-4} from={0.3} style={{ font: `800 150px/1 ${F}`, color: xflip ? C.accent : '#fff', background: xflip ? '#fff' : C.accent, padding: '10px 36px', borderRadius: 28, transform: `translateX(${shake(T)}px)`, fontVariantNumeric: 'tabular-nums', boxShadow: '0 12px 30px rgba(0,0,0,.2)' }}>{T < 16.6 ? '$' + roll(T, 2) + '.' + roll(T + 3, 2) : '$1.26'}</Pop>
            <Pop T={T} at={w[3]} style={chip}>a gallon.</Pop>
          </div>
        </div>

        <div style={{ position: 'absolute', right: 80, top: 290, width: CW, height: CH, borderRadius: 28, overflow: 'hidden', boxShadow: '0 0 0 6px #fff, 0 18px 40px rgba(13,16,20,.25)', opacity: clamp(cam * 2, 0, 1), transform: `scale(${0.6 + 0.4 * cam})`, transformOrigin: 'top right' }}>
          <Photo W={CW} H={CH} />
        </div>
        <div style={{ position: 'absolute', right: 80, top: 290 + CH + 18, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, opacity: clamp(cam * 2, 0, 1) }}>
          <div style={{ font: `700 24px ${F}`, color: C.bg, opacity: hostLbl }}>Your hosts</div>
          <div style={{ background: '#fff', color: C.bg, font: `700 28px ${F}`, padding: '8px 18px', borderRadius: 12 }}>Dallas + Dennis Rodman</div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: T >= 16.6 && T < 16.9 ? 0.7 * (1 - (T - 16.6) / 0.3) : 0, pointerEvents: 'none' }} />
      </div>
    </Shot>
  );
}

function PostScene({ T, a, b, src, alt, bg, kicker, kickBg, kickFg, words, hl, hlBg, hlFg, wordC, focus, sticker, stickAt, enter }) {
  const ein = tw(T, a - 0.45, a + 0.05, 0, 1, M.draw);
  const eout = tw(T, b - 0.45, b + 0.15, 0, 1, M.draw);
  const tx = (enter === 'right' ? 1080 * (1 - ein) : 0) - 1080 * eout;
  const ty = enter === 'bottom' ? 1920 * (1 - ein) : 0;
  const card = tw(T, a - 0.2, a + 0.5, 0, 1, M.pop);
  let z = 1, ox = 50, oy = 50;
  focus.forEach((f, k) => {
    const p = tw(T, f.at, f.at + 0.6, 0, 1, M.draw);
    if (p > 0) { z = z + (f.z - z) * p; ox = ox + (f.x - ox) * p; oy = oy + (f.y - oy) * p; }
  });
  const back = tw(T, b - 1.1, b - 0.55, 0, 1, M.draw);
  z = z + (1 - z) * back;
  const drift = 1;
  const PW = 900, PH = Math.round(PW * 1180 / 944);
  return (
    <Shot from={a - 0.5} to={b + 0.2}>
      <div style={{ position: 'absolute', inset: 0, background: bg, transform: `translate(${tx}px, ${ty}px)`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 80, top: 280, background: kickBg, color: kickFg, font: `700 30px ${F}`, padding: '8px 20px', borderRadius: 999, opacity: tw(T, a, a + 0.3, 0, 1) }}>{kicker}</div>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 360, display: 'flex', flexWrap: 'wrap', gap: '4px 20px', alignItems: 'center', font: `800 84px/1.05 ${F}`, color: wordC, letterSpacing: -3 }}>
          {words.map((w, k) => <Pop key={k} T={T} at={a + 0.15 + k * 0.28} from={1.5} style={w === hl ? { background: hlBg, color: hlFg, padding: '0 18px', borderRadius: 18 } : null}>{w}</Pop>)}
        </div>
        <div style={{ position: 'absolute', left: (1080 - PW) / 2, top: 600, width: PW, height: PH, borderRadius: 32, overflow: 'hidden', background: '#fff', boxShadow: '0 0 0 10px #fff, 0 40px 90px rgba(13,16,20,.35)', opacity: clamp(card * 2, 0, 1), transform: `translateY(${260 * (1 - card)}px) rotate(${(enter === 'right' ? 7 : -7) * (1 - card) + (enter === 'right' ? 1 : -1)}deg) scale(${0.88 + 0.12 * card})` }}>
          <div style={{ width: PW, height: PH, transformOrigin: `${ox}% ${oy}%`, transform: `scale(${z * drift})` }}>
            <img src={src} alt={alt} style={{ display: 'block', width: PW, height: PH }} />
          </div>
        </div>
        <Sticker T={T} at={stickAt} text={sticker} rot={enter === 'right' ? -6 : 6} dark style={{ right: 110, top: 600, fontSize: 40, display: T >= stickAt && T < b - 0.9 ? 'block' : 'none' }} />
      </div>
    </Shot>
  );
}

function Series({ T }) {
  const xin = tw(T, 24.6, 25.2, 1080, 0, M.draw), yout = tw(T, 44.8, 45.4, 0, -1920, M.draw);
  const intro = tw(T, 26.7, 27.2, 0, 1, M.draw);
  const t0 = 27, d = 1.8;
  const idx = clamp(Math.floor((T - t0) / d), 0, 7);
  const k = T < t0 ? 0 : tw(T, t0 + idx * d, t0 + idx * d + 0.45, idx - 1, idx, M.pop);
  const pos = T < t0 + 0.4 ? tw(T, t0, t0 + 0.4, -1, 0, M.draw) : idx === 0 ? 0 : k;
  const grid = tw(T, 41.4, 41.9, 0, 1, M.draw);
  const active = T >= t0 && T < 41.4 ? idx : -1;
  return (
    <Shot from={24.5} to={45.5}>
      <div style={{ position: 'absolute', inset: 0, background: C.bg, transform: `translate(${xin}px, ${yout}px)`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: C.accent, opacity: 1 - intro }}>
          <Ticker T={T} top={260} rot={-6} text="PART 1   ✦   PART 2   ✦   PART 3   ✦   PART 4" />
          <Ticker T={T} top={1450} rot={4} dir={-1} bg={C.tag} fg={C.bg} text="PART 5   ✦   PART 6   ✦   PART 7   ✦   PART 8" />
          <div style={{ position: 'absolute', left: 40, right: 40, top: 620, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 0, transform: `translateX(${shake(T)}px) scale(${1 + 0.6 * intro})` }}>
            <Pop T={T} at={25.4} from={1.8} style={{ font: `800 230px/0.95 ${F}`, color: '#fff', letterSpacing: -10 }}>8 posts.</Pop>
            <Pop T={T} at={25.9} from={1.8} rot={-4} style={{ font: `800 230px/0.95 ${F}`, color: C.bg, letterSpacing: -10 }}>4 weeks.</Pop>
            <Pop T={T} at={26.3} style={{ font: `700 48px/1.2 ${F}`, color: '#fff', marginTop: 30 }}>One question at a time about what you pay.</Pop>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 300, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: intro }}>
          <div style={{ font: `800 52px ${F}`, color: C.text }}>The schedule</div>
          <div style={{ display: 'flex', gap: 10 }}>{TOPICS.map((_, i) => <div key={i} style={{ width: i === active ? 44 : 16, height: 16, borderRadius: 8, background: i <= Math.max(active, grid > 0 ? 7 : -1) ? C.accent : '#3A3E44' }} />)}</div>
        </div>
        <div style={{ position: 'absolute', left: 80, top: 420, height: 960, display: 'flex', gap: 40, transform: `translateX(${-pos * 960}px)`, opacity: intro * (1 - grid) }}>
          {TOPICS.map((t, i) => {
            const arr = tw(T, t0 + i * d, t0 + i * d + 0.5, 0, 1, M.pop);
            return (
              <div key={i} style={{ width: 920, height: 960, flex: 'none', boxSizing: 'border-box', background: [C.card, C.accent, C.tag, C.photo][i % 4], borderRadius: 44, padding: 64, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transform: `rotate(${(i % 2 ? 5 : -5) * (1 - arr)}deg) scale(${0.9 + 0.1 * arr})`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -60, bottom: -180, font: `800 820px/1 ${F}`, color: i % 4 === 1 ? C.bg : i % 4 === 2 ? C.accent : C.accent, opacity: i % 4 === 1 ? 0.35 : 1, letterSpacing: -40, transform: `translateY(${260 * (1 - arr)}px) rotate(${-8 * (1 - arr)}deg)` }}>{i + 1}</div>
                <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
                  <span style={{ background: i % 4 === 2 ? C.bg : '#fff', color: i % 4 === 2 ? '#fff' : C.bg, font: `700 34px ${F}`, padding: '8px 22px', borderRadius: 999 }}>Week {Math.floor(i / 2) + 1}</span>
                  <span style={{ color: i % 4 === 2 ? C.bg : '#fff', font: `700 34px ${F}`, padding: '8px 0' }}>Part {i + 1} of 8</span>
                </div>
                <div style={{ font: `800 116px/0.98 ${F}`, color: i % 4 === 2 ? C.bg : '#fff', letterSpacing: -4, position: 'relative', textWrap: 'balance', maxWidth: 700, transform: `translateX(${-80 * (1 - arr)}px)`, opacity: clamp(arr * 1.5, 0, 1) }}>{t}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 420, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {TOPICS.map((t, i) => {
            const p = tw(T, 41.5 + i * 0.07, 41.95 + i * 0.07, 0, 1, M.pop);
            return (
              <div key={i} style={{ height: 196, boxSizing: 'border-box', background: i === 7 ? C.accent : C.card, borderRadius: 24, padding: '22px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: clamp(p * 2, 0, 1), transform: `scale(${0.6 + 0.4 * p})` }}>
                <span style={{ font: `800 48px ${F}`, color: i === 7 ? '#fff' : C.accent }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ font: `800 40px/1.1 ${F}`, color: C.text }}>{t}</span>
              </div>
            );
          })}
        </div>
        <Sticker T={T} at={42.4} text="Save this ↓" rot={-6} style={{ right: 140, top: 1330, fontSize: 52 }} />
      </div>
    </Shot>
  );
}

function PostAndEnd({ T }) {
  const rise = tw(T, 44.9, 45.6, 0, 1, M.draw);
  const shrink = tw(T, 50, 50.7, 0, 1, M.pop);
  const out = tw(T, 54.2, 54.8, 0, -1920, M.draw);
  const drag = Math.min(tw(T, 47.4, 48.1, 0, 1, M.draw), tw(T, 48.3, 48.9, 1, 0, M.pop));
  const push = 0.025 * clamp((T - 45.6) / 4.4, 0, 1) * (1 - shrink);
  const s = (0.72 + push) * (1 - shrink) + 0.3 * shrink;
  const top = 430 + 1500 * (1 - rise) - 120 * shrink, left = -298 * shrink;
  const cap = Math.min(tw(T, 45.5, 46, 0, 1), tw(T, 49.8, 50.2, 1, 0));
  const ptr = T >= 47.1 && T < 49 ? 1 : T >= 51.2 && T < 52.6 ? 1 : 0;
  const tap = T >= 52 && T < 52.2;
  const ptrX = T < 50 ? 760 - 360 * drag : tw(T, 51.2, 51.9, 900, 300, M.draw);
  const ptrY = T < 50 ? 900 : tw(T, 51.2, 51.9, 1500, 1125, M.draw);
  const followed = T >= 52.05;
  const bub = tw(T, 52.5, 53, 0, 1, M.pop);
  return (
    <Shot from={44.8} to={55.1}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${out}px)` }}>
        <div style={{ opacity: tw(T, 50.3, 50.8, 0, 1) }}><Ticker T={T} top={1560} rot={-4} bg={C.accent} fg="#fff" text="FOLLOW FOR PART 1   ✦   COMMENT YOUR LAST FILL-UP" /></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', font: `800 68px ${F}`, color: C.text, opacity: cap, letterSpacing: -1 }}>
          Full breakdown on <span style={{ color: C.bg, background: C.tag, padding: '2px 18px', borderRadius: 14 }}>our post.</span>
        </div>
        <div style={{ position: 'absolute', left, top, width: 1080, height: 1350, transform: `scale(${s}) rotate(${-5 * shrink}deg)`, transformOrigin: 'top center', borderRadius: 36, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.6)' }}>
          <div style={{ display: 'flex', width: 2160, transform: `translateX(${-420 * drag}px)` }}><CoverSlide /><div style={{ width: 1080, height: 1350, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `800 80px ${F}`, color: C.text }}>Slide 2 →</div></div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1440, display: 'flex', justifyContent: 'center', gap: 14, opacity: cap }}>
          {[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: i === 0 ? 40 : 16, height: 16, borderRadius: 8, background: i === 0 ? C.accent : '#3A3E44' }} />)}
        </div>
        <div style={{ position: 'absolute', left: 460, top: 340, width: 480, display: 'flex', flexDirection: 'column', gap: 12, opacity: tw(T, 50.5, 51, 0, 1) }}>
          <div style={{ font: `800 48px/1.1 ${F}`, color: C.text }}>The full breakdown is on our post.</div>
          <div style={{ font: `600 36px ${F}`, color: C.tag }}>← Swipe it. Save it.</div>
        </div>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 780, display: 'flex', flexWrap: 'wrap', gap: '6px 24px', font: `800 116px/1 ${F}`, color: C.text, letterSpacing: -3.5 }}>
          <Pop T={T} at={50.6}>Follow</Pop><Pop T={T} at={50.85}>for</Pop><Pop T={T} at={51.1} rot={-3} style={{ color: C.accent }}>Part 1.</Pop>
        </div>
        <div style={{ position: 'absolute', left: 80, top: 1070, opacity: tw(T, 51.2, 51.6, 0, 1), transform: `scale(${tap ? 0.88 : 1 + 0.08 * Math.max(0, 1 - Math.abs(T - 52.3) / 0.3)}) translateX(${shake(T)}px)`, background: followed ? C.card : C.accent, color: '#fff', font: `800 52px ${F}`, padding: '26px 56px', borderRadius: 999, display: 'flex', gap: 16, boxShadow: followed ? `inset 0 0 0 3px ${C.accent}` : 'none' }}>{followed ? 'Following ✓' : '+ Follow'}</div>
        <div style={{ position: 'absolute', left: 80, right: 140, top: 1230, background: C.card, borderRadius: '36px 36px 36px 8px', padding: '34px 40px', opacity: clamp(bub * 2, 0, 1), transform: `scale(${0.7 + 0.3 * bub})`, transformOrigin: 'left bottom', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ font: `600 30px ${F}`, color: C.sub }}>Comment below</div>
          <div style={{ font: `800 54px/1.1 ${F}`, color: C.text }}>What did your last fill-up cost?</div>
          <div style={{ display: 'flex', gap: 10 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: C.accent, opacity: 0.4 + 0.6 * (Math.floor(T * 4) % 3 === i ? 1 : 0) }} />)}</div>
        </div>
        {[0, 1, 2].map(i => { const p = tw(T, 52 + i * 0.08, 52.7 + i * 0.08, 0, 1); return <div key={i} style={{ position: 'absolute', left: 260 - 300 * p, top: 1125 - 300 * p, width: 600 * p, height: 600 * p, borderRadius: '50%', border: `${10 * (1 - p)}px solid ${[C.accent, C.tag, '#fff'][i]}`, opacity: T >= 52 && p < 1 ? 1 - p : 0, pointerEvents: 'none' }} />; })}
        <div style={{ position: 'absolute', left: ptrX - 40, top: ptrY - 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.85)', boxShadow: '0 0 0 14px rgba(255,255,255,.25)', opacity: ptr, transform: `scale(${tap ? 0.75 : 1})` }} />
      </div>
    </Shot>
  );
}

function Badge({ T }) {
  const o = io(T, 4.4, 4.9, 53.9, 54.3);
  return (
    <div style={{ position: 'absolute', left: 80, top: 170, display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(255,255,255,.94)', padding: '10px 26px 10px 10px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', borderRadius: 999, opacity: o }}>
      <Logo size={64} />
      <div style={{ font: `700 30px ${F}`, color: C.bg }}>What your fill-up costs</div>
      <div style={{ font: `700 24px ${F}`, color: C.bg, background: C.tag, padding: '4px 14px', borderRadius: 999 }}>Intro</div>
    </div>
  );
}

function SafeZones() {
  const z = { position: 'absolute', border: '3px dashed #E8906A', boxSizing: 'border-box', font: `500 22px ${MONO}`, color: '#E8906A', padding: 10 };
  return (
    <React.Fragment>
      <div style={Object.assign({}, z, { left: 0, right: 0, top: 0, height: 150 })}>IG top UI</div>
      <div style={Object.assign({}, z, { left: 0, right: 0, bottom: 0, height: 380 })}>IG caption / actions</div>
      <div style={Object.assign({}, z, { right: 0, top: 1100, width: 140, bottom: 380 })}>btns</div>
    </React.Fragment>
  );
}

function Piece({ t }) {
  const { T } = useComposition();
  const Tl = T < 19 ? T : T < 29.4 ? 24.4 : T - 5;
  const cam = 1 + bump(Tl);
  return (
    <div data-screen-label={`Reel v2 ${Math.floor(T)}s`} style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden', fontFamily: F }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${cam})` }}>
        <Speaker T={Tl} />
        <PostScene T={T} a={19} b={24.4} enter="bottom" src={window.POST_FOSSIL} alt="350 post: We are witnessing fossilflation" bg={C.accent}
          kicker="From our feed" kickBg={C.bg} kickFg="#fff" words={["It's", 'called', 'fossilflation.']} hl="fossilflation." hlBg="#fff" hlFg={C.bg} wordC="#fff"
          focus={[]} sticker="" stickAt={99} />
        <PostScene T={T} a={24.4} b={29.8} enter="right" src={window.POST_ANGER} alt="350 post: Anger about inflation is justified" bg={C.tag}
          kicker="Also from our feed" kickBg={C.bg} kickFg="#fff" words={['Angry', 'about', 'prices?', 'Fair.']} hl="Fair." hlBg={C.accent} hlFg="#fff" wordC={C.bg}
          focus={[]} sticker="" stickAt={99} />
        <Series T={Tl} />
        <PostAndEnd T={Tl} />
        <Hook T={Tl} />
        <Wipe T={T} at={8.75} light />
        <Wipe T={T} at={14.65} light />
        <Wipe T={Tl} at={44.6} />
      </div>
      <Badge T={Tl} />
      {t.captions && <KCap T={T} />}
      {t.safeZones && <SafeZones />}
    </div>
  );
}

function IntroReelV2() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#07090B' }}>
      <CompositionStage width={1080} height={1920} bg={C.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece t={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Reel" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakToggle label="Kinetic captions" value={t.captions} onChange={v => setTweak('captions', v)} />
        <TweakToggle label="IG safe-zone guides" value={t.safeZones} onChange={v => setTweak('safeZones', v)} />
      </TweaksPanel>
    </div>
  );
}
window.IntroReelV2 = IntroReelV2;
