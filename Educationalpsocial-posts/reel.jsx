const C = { bg:'#0D1014', card:'#212328', photo:'#1B292D', text:'#FFFFFF', sub:'#BABFC0', accent:'#448CB6', tag:'#CADDF7', link:'#4E8CE4' };
const M = { enter: Easing.easeOutCubic, draw: Easing.easeInOutQuart, pop: Easing.easeOutBack };
const tw = (T, s, e, a, b, ease = M.enter) => animate({ from: a, to: b, start: s, end: e, ease })(T);
const io = (T, a, b, c, d) => Math.min(tw(T, a, b, 0, 1), tw(T, c, d, 1, 0));
const F = 'Inter, system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

const TOPICS = ['The headline number', 'The Strait of Hormuz', 'Who pays', "Who's collecting", 'Your monthly bill', 'Solar', 'Is it just the war?', 'What you can do'];

function Ph({ label, sub, style }) {
  return (
    <div style={Object.assign({ position: 'absolute', background: `repeating-linear-gradient(135deg, ${C.photo} 0 22px, #22353a 22px 44px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: 40, boxSizing: 'border-box' }, style)}>
      <div style={{ font: `500 30px ${MONO}`, color: C.tag, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      {sub && <div style={{ font: `400 24px ${MONO}`, color: C.sub, maxWidth: 760, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

function Logo({ size = 72 }) {
  return (
    <div title="Replace with official 350 logo file" style={{ width: size, height: size, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: size * 0.04, flex: 'none' }}>
      <span style={{ font: `800 ${size * 0.26}px ${F}`, color: '#fff' }}>←</span>
      <span style={{ font: `800 ${size * 0.3}px ${F}`, color: '#fff', letterSpacing: -0.5 }}>350</span>
    </div>
  );
}

function CoverSlide() {
  return (
    <div style={{ width: 1080, height: 1350, background: C.bg, position: 'relative', overflow: 'hidden', fontFamily: F }}>
      <Ph label="5-sec cut from Intro Reel" sub="Hook beat, 0:00–0:05" style={{ left: 0, top: 0, width: 1080, height: 540 }} />
      <div style={{ position: 'absolute', left: 80, right: 80, top: 610, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ alignSelf: 'flex-start', background: C.tag, color: C.bg, font: `600 32px ${F}`, padding: '8px 20px', borderRadius: 999 }}>The Great Power Shift</div>
        <div style={{ font: `800 104px/1.02 ${F}`, color: C.text, letterSpacing: -2 }}>What your fill-up costs:</div>
        <div style={{ font: `800 72px/1.05 ${F}`, color: C.accent, letterSpacing: -1 }}>8 posts, 4 weeks.</div>
      </div>
      <div style={{ position: 'absolute', left: 80, right: 80, bottom: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={88} />
        <div style={{ font: `600 36px ${F}`, color: C.text, display: 'flex', alignItems: 'center', gap: 14 }}>Swipe <span style={{ color: C.accent, fontSize: 44 }}>→</span></div>
      </div>
    </div>
  );
}

function Hook({ T }) {
  const out = tw(T, 3.6, 4.3, 0, 1, M.draw);
  const a = tw(T, 0.1, 0.7, 0, 1), amt = tw(T, 0.5, 1.2, 0, 1, M.pop), c = tw(T, 2.0, 2.6, 0, 1), rule = tw(T, 0.9, 1.8, 0, 1, M.draw);
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top: 560, opacity: 1 - out, transform: `translateY(${-140 * out}px)` }}>
      <div style={{ font: `800 76px/1.08 ${F}`, color: C.text, letterSpacing: -1.5, opacity: a, transform: `translateY(${40 * (1 - a)}px)` }}>Your cost at the gas pump is up</div>
      <div style={{ font: `800 210px/1 ${F}`, color: C.accent, letterSpacing: -6, marginTop: 24, opacity: Math.min(1, amt * 1.4), transform: `scale(${0.8 + 0.2 * amt})`, transformOrigin: 'left center' }}>[amount]</div>
      <div style={{ height: 6, background: C.accent, width: `${rule * 100}%`, margin: '48px 0', borderRadius: 3 }} />
      <div style={{ font: `500 60px/1.2 ${F}`, color: C.sub, opacity: c, transform: `translateY(${30 * (1 - c)}px)` }}>Here's why, and what you can do.</div>
    </div>
  );
}

function Speaker({ T }) {
  const r = tw(T, 3.7, 4.5, 0, 1, M.draw);
  const kb = 1 + 0.1 * clamp((T - 4) / 21, 0, 1);
  const lt = io(T, 5, 5.6, 8.4, 9);
  const dim = io(T, 9, 9.6, 14.6, 15.2) * 0.86;
  return (
    <Shot from={3.6} to={25.6}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: `inset(${(1 - r) * 100}% 0 0 0)` }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb})` }}>
          <Ph label="Speaker video · full bleed" sub="Speaker at a gas pump, filmed vertical, sharing their own fill-up number" style={{ inset: 0 }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: '#0D1014', opacity: dim }} />
        <div style={{ position: 'absolute', left: 80, bottom: 520, opacity: lt, transform: `translateX(${-40 * (1 - lt)}px)`, background: C.card, borderLeft: 'none', borderRadius: 16, padding: '22px 30px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ font: `800 44px ${F}`, color: C.text }}>[Speaker name]</div>
          <div style={{ font: `500 32px ${F}`, color: C.sub }}>[City, State] · drives [vehicle]</div>
        </div>
      </div>
    </Shot>
  );
}

function Headline({ T }) {
  const inn = tw(T, 9.2, 9.9, 0, 1, M.pop), shift = tw(T, 12.2, 12.9, 0, 1, M.draw), out = tw(T, 14.6, 15.2, 0, 1, M.draw);
  const pc = tw(T, 12.4, 13.1, 0, 1, M.pop);
  return (
    <Shot from={9} to={15.3}>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 520, opacity: Math.min(1, inn * 1.5) * (1 - out), transform: `translateY(${60 * (1 - inn) - 170 * shift - 200 * out}px) scale(${(0.9 + 0.1 * inn) * (1 - 0.18 * shift)})`, transformOrigin: 'top center' }}>
        <div style={{ background: '#F4F5F6', borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
          <div style={{ height: 440, background: 'repeating-linear-gradient(135deg, #E6E9EB 0 22px, #DCE1E4 22px 44px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', padding: 40 }}>
            <div style={{ font: `500 30px ${MONO}`, color: '#2B3236', textTransform: 'uppercase' }}>News headline screenshot</div>
            <div style={{ font: `400 24px ${MONO}`, color: '#4A5156' }}>Gas price increase · own screenshot, no agency photos</div>
          </div>
        </div>
        <div style={{ font: `500 34px ${F}`, color: C.text, marginTop: 24 }}>Source: [Outlet], [Month Day, Year]</div>
      </div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1000, opacity: Math.min(1, pc * 1.5) * (1 - out), transform: `translateY(${200 * (1 - pc) + 200 * out}px)` }}>
        <div style={{ height: 400, borderRadius: 20, overflow: 'hidden', position: 'relative', outline: `3px dashed ${C.tag}`, outlineOffset: -3 }}>
          <Ph label="Reserved · pop culture beat" sub="Licensed still or clip only. No unlicensed TV or film." style={{ inset: 0 }} />
        </div>
      </div>
    </Shot>
  );
}

function Mine({ T }) {
  const a = tw(T, 15.4, 16.2, 0, 1), x = tw(T, 16.0, 16.7, 0, 1, M.pop);
  return (
    <Shot from={15} to={25.6}>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1000, opacity: a, transform: `translateY(${50 * (1 - a)}px)` }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 10, background: C.bg, borderRadius: 24, padding: '36px 44px' }}>
          <div style={{ font: `800 84px/1.05 ${F}`, color: C.text, letterSpacing: -1.5 }}>Mine went up by</div>
          <div style={{ font: `800 84px/1.05 ${F}`, color: C.text, letterSpacing: -1.5, display: 'flex', gap: 22, alignItems: 'baseline' }}>
            <span style={{ color: C.accent, display: 'inline-block', transform: `scale(${0.7 + 0.3 * x})`, transformOrigin: 'left bottom', opacity: Math.min(1, x * 1.5) }}>[X]</span> this year.
          </div>
        </div>
      </div>
    </Shot>
  );
}

function Series({ T }) {
  const r = tw(T, 24.6, 25.4, 0, 1, M.draw);
  const h = tw(T, 25.6, 26.3, 0, 1);
  const out = tw(T, 45, 45.8, 0, 1, M.draw);
  const hi = T >= 37.5 && T < 44.7 ? Math.floor((T - 37.5) / 0.9) : -1;
  return (
    <Shot from={24.5} to={46}>
      <div style={{ position: 'absolute', inset: 0, background: C.bg, clipPath: `inset(${(1 - r) * 100}% 0 0 0)` }}>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 340, opacity: h * (1 - out), transform: `translateY(${30 * (1 - h)}px)` }}>
          <div style={{ font: `800 96px/1 ${F}`, color: C.text, letterSpacing: -2 }}>8 posts. 4 weeks.</div>
          <div style={{ font: `500 44px/1.25 ${F}`, color: C.sub, marginTop: 20 }}>One question at a time about what you pay at the pump.</div>
        </div>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 640, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, opacity: 1 - out, transform: `scale(${1 - 0.06 * out})` }}>
          {TOPICS.map((t, i) => {
            const p = tw(T, 26.6 + i * 1.3, 27.3 + i * 1.3, 0, 1, M.pop);
            const on = hi === i;
            return (
              <div key={i} style={{ height: 176, boxSizing: 'border-box', background: on ? '#26323B' : C.card, borderRadius: 20, padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: Math.min(1, p * 1.6), transform: `translateY(${50 * (1 - p)}px) scale(${0.92 + 0.08 * p})`, boxShadow: on ? `inset 0 0 0 3px ${C.accent}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ font: `800 44px ${F}`, color: C.accent }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ font: `600 24px ${F}`, color: C.bg, background: C.tag, padding: '4px 14px', borderRadius: 999 }}>Week {Math.floor(i / 2) + 1}</span>
                </div>
                <div style={{ font: `800 40px/1.1 ${F}`, color: C.text, letterSpacing: -0.5 }}>{t}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Shot>
  );
}

function PostAndEnd({ T }) {
  const inn = tw(T, 45.4, 46.3, 0, 1, M.pop);
  const shrink = tw(T, 50, 50.9, 0, 1, M.draw);
  const out = tw(T, 54.3, 55, 0, 1, M.draw);
  const push = 0.02 * clamp((T - 46.3) / 3.7, 0, 1) * (1 - shrink);
  const s = (0.64 + 0.08 * inn) * (1 - shrink) + 0.3 * shrink + push;
  const top = 430 + 120 * (1 - inn) - 110 * shrink;
  const cap = io(T, 45.7, 46.3, 49.8, 50.3);
  const dots = io(T, 46.4, 47, 49.8, 50.3);
  const cta = tw(T, 50.7, 51.4, 0, 1), cm = tw(T, 51.3, 52, 0, 1), nt = tw(T, 52, 52.6, 0, 1);
  return (
    <Shot from={45.2} to={55.1}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', font: `800 60px ${F}`, color: C.text, opacity: cap, transform: `translateY(${20 * (1 - cap)}px)` }}>Full breakdown on our post.</div>
      <div style={{ position: 'absolute', left: '50%', top, width: 1080, height: 1350, transform: `translateX(-50%) scale(${s})`, transformOrigin: 'top center', opacity: Math.min(1, inn * 1.6) * (1 - out), borderRadius: 28, overflow: 'hidden', boxShadow: `0 40px 120px rgba(0,0,0,.6), 0 0 0 ${4 / s}px ${C.card}` }}>
        <CoverSlide />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1440, display: 'flex', justifyContent: 'center', gap: 14, opacity: dots }}>
        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: i === 0 ? C.accent : '#3A3E44' }} />)}
      </div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 800, opacity: 1 - out, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ font: `800 112px/1 ${F}`, color: C.text, letterSpacing: -2.5, opacity: cta, transform: `translateY(${40 * (1 - cta)}px)` }}>Follow for <span style={{ color: C.accent }}>Part 1.</span></div>
        <div style={{ font: `500 56px/1.2 ${F}`, color: C.text, opacity: cm, transform: `translateY(${30 * (1 - cm)}px)` }}>Comment below: what did your last fill-up cost?</div>
        <div style={{ font: `500 40px/1.3 ${F}`, color: C.sub, opacity: nt, display: 'flex', alignItems: 'center', gap: 16 }}><span style={{ color: C.accent, font: `800 48px ${F}` }}>↑</span> Swipe the carousel on our profile and save it.</div>
      </div>
    </Shot>
  );
}

function Badge({ T }) {
  const o = io(T, 4.4, 5, 54.1, 54.7);
  return (
    <div style={{ position: 'absolute', left: 80, top: 170, display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(13,16,20,.82)', padding: '10px 26px 10px 10px', borderRadius: 999, opacity: o, transform: `translateY(${-20 * (1 - o)}px)` }}>
      <Logo size={64} />
      <div style={{ font: `700 30px ${F}`, color: C.text }}>What your fill-up costs</div>
      <div style={{ font: `600 24px ${F}`, color: C.bg, background: C.tag, padding: '4px 14px', borderRadius: 999 }}>Intro</div>
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
      <div style={Object.assign({}, z, { left: 80, right: 80, top: 150, bottom: 380, borderColor: 'rgba(232,144,106,.35)' })}>80px margins</div>
    </React.Fragment>
  );
}

function Piece({ t }) {
  const { T } = useComposition();
  return (
    <div data-screen-label={`Reel ${Math.floor(T)}s`} style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden', fontFamily: F }}>
      <Speaker T={T} />
      <Headline T={T} />
      <Mine T={T} />
      <Series T={T} />
      <Hook T={T} />
      <PostAndEnd T={T} />
      <Badge T={T} />
      {t.captions && (
        <Captions style={{ bottom: 400, font: `600 40px/1.3 ${F}`, color: '#fff', textShadow: '0 2px 16px rgba(0,0,0,.8)' }} items={[
          { at: 4.3, text: '[Speaker VO: who they are, where they fill up]' },
          { at: 9.2, text: '[VO: what the headline says, in plain words]' },
          { at: 12.5, text: '[VO: pop culture beat, if licensed]', until: 15 },
          { at: 15.4, text: 'Mine went up by [X] this year.' },
          { at: 19, text: '[Speaker VO: what that means for their budget]', until: 24.6 },
          { at: 26, text: 'Eight posts: what you pay, and why.', until: 44.8 },
        ]} />
      )}
      {t.safeZones && <SafeZones />}
    </div>
  );
}

function IntroReel() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#07090B' }}>
      <CompositionStage width={1080} height={1920} bg={C.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece t={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Reel" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakToggle label="Captions" value={t.captions} onChange={v => setTweak('captions', v)} />
        <TweakToggle label="IG safe-zone guides" value={t.safeZones} onChange={v => setTweak('safeZones', v)} />
      </TweaksPanel>
    </div>
  );
}
window.IntroReel = IntroReel;
window.CoverSlide = CoverSlide;
