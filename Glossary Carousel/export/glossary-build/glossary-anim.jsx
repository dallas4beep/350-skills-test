// Deliverable 1 — Glossary animation (1080×1350, ~12 s). One tree, keyed to T and CUES.
const { CompositionStage, useComposition, Easing, animate, interpolate, clamp } = window;

const MOTION = {
  enter: (start, end, from = 0, to = 1) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
  swap:  (start, end, from = 0, to = 1) => animate({ from, to, start, end, ease: Easing.easeInOutCubic }),
  pop:   (start, end, from = 0, to = 1) => animate({ from, to, start, end, ease: Easing.easeOutBack }),
};
const C = { bg: '#F6F7F8', card: '#FFFFFF', text: '#0D1014', sub: '#50585C', accent: '#448CB6', tag: '#CADDF7' };
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

function useGiraffe() {
  const [R, setR] = React.useState(null);
  React.useEffect(() => {
    let live = true;
    const go = () => window.GiraffeRender ? window.GiraffeRender.ready.then(r => live && setR(r)) : setTimeout(go, 100);
    go(); return () => { live = false; };
  }, []);
  return R;
}

const fadeIn = (T, a, b) => MOTION.enter(a, b)(T);
const fadeOut = (T, a, b) => 1 - MOTION.swap(a, b)(T);
const win = (T, a, b, inDur = 0.35, outDur = 0.3) => Math.min(fadeIn(T, a, a + inDur), fadeOut(T, b - outDur, b));

function Ph({ marks, children }) {
  return <span style={{ outline: marks ? `3px dashed ${C.accent}` : 'none', outlineOffset: 10, borderRadius: 8 }}>{children}</span>;
}


const q = (v, s) => Math.round(v / s) * s;
function poseAt(T, CUES) {
  const I = CUES.Intro, W = CUES.Word, M = CUES.Meaning, P = CUES.Plain, E = CUES.End;
  const gx = interpolate([I, W - 0.1, W + 0.6, M - 0.2, M + 0.7, P - 0.2, P + 0.7], [280, 280, 80, 80, 480, 480, 480], Easing.easeInOutCubic)(T);
  const rise = MOTION.pop(I + 0.05, I + 0.8, 360, 0)(T);
  const yaw = interpolate([I, W - 0.1, W + 0.6, M - 0.2, M + 0.7, P - 0.2, P + 0.7], [6, 6, 32, 32, 12, 12, -28], Easing.easeInOutCubic)(T);
  const reach = interpolate([W + 1.0, W + 1.6, W + 2.5, W + 3.1], [0, 1, 1, 0], Easing.easeInOutSine)(T);
  const head = 6 + reach * 14;
  const talk = [[I + 0.5, I + 1.7], [W + 0.3, W + 1.9], [M + 0.5, M + 3.0], [P + 0.4, P + 2.2], [E + 0.0, E + 0.8]]
    .some(([a, b]) => T > a && T < b);
  const mouth = talk ? Math.abs(Math.sin(T * 10.5)) : 0;
  const blink = [I + 1.85, W + 2.2, M + 3.4, P + 2.5, E + 0.95].reduce((m, t0) => Math.max(m, 1 - Math.abs(T - t0) / 0.09), 0);
  return { gx, rise, yaw, frame: { yaw: q(yaw, 5), head: q(head, 4.5), pitch: 7, mouth: mouth > 0.45 ? 1 : 0, blink: blink > 0.5 ? 1 : 0, focus: 0.86, w: 390, h: 570 } };
}
const fkey = (f) => [f.yaw, f.head, f.mouth, f.blink].join('|');
function useFrames(R, CUES, total) {
  return React.useMemo(() => {
    if (!R || !isFinite(total)) return null;
    const map = new Map();
    for (let i = 0; i <= Math.ceil(total * 60); i++) {
      const f = poseAt(i / 60, CUES).frame, k = fkey(f);
      if (!map.has(k)) map.set(k, R.frame(f));
    }
    return [...map.entries()];
  }, [R, total, JSON.stringify(CUES)]);
}

function GlossaryPiece({ marks: marksIn, copy }) {
  const ff = copy !== 'Placeholders'; const marks = marksIn && !ff;
  const TERM = ff ? 'Fossilflation' : '[TERM]';
  const DEF = ff ? 'When fossil fuel dependence leaves households at the mercy of war and volatile markets, it\u2019s ordinary people who pay the price.' : '[Insert agreed definition].';
  const PLAIN = ff ? 'Affordable, homegrown, renewable energy shields people from fossil fuel crises.' : '[Insert agreed plain-language version].';
  const { T, CUES, authoredTotal } = useComposition();
  const R = useGiraffe();
  const I = CUES.Intro, W = CUES.Word, M = CUES.Meaning, P = CUES.Plain, E = CUES.End, END = authoredTotal;

  // whole-frame fade at the loop seam + slow push-in so something always moves
  const seam = Math.min(fadeIn(T, 0, 0.3), fadeOut(T, END - 0.45, END));
  const push = interpolate([0, END], [1, 1.035])(T);

  const g = poseAt(T, CUES);
  const { gx, rise, yaw } = g; const gw = 520, gh = 760;
  const gs = interpolate([M - 0.2, M + 0.7], [1, 0.42], Easing.easeInOutCubic)(T);
  const ph1 = Math.min(fadeIn(T, M + 0.2, M + 0.8), fadeOut(T, P - 0.1, P + 0.4));
  const ph2 = Math.min(fadeIn(T, P + 0.1, P + 0.7), 1);
  const kb1 = interpolate([M, P + 0.4], [1.02, 1.12])(T), kb2 = interpolate([P, END], [1.02, 1.1])(T);
  const frames = useFrames(R, CUES, authoredTotal); const activeKey = fkey(g.frame);

  // bubble + lines
  const bub = MOTION.pop(I + 0.35, I + 0.85)(T);
  const tailX = gx + gw * 0.5 - 80 - 24 + yaw * 2.2;
  const l0 = win(T, I + 0.5, W + 0.1), l1 = win(T, W + 0.15, M + 0.1), l2 = win(T, M + 0.3, P + 0.1), l3 = fadeIn(T, P + 0.3, P + 0.7);
  const lift = (v) => `translateY(${(1 - v) * 24}px)`;

  // props
  const sign = Math.min(MOTION.enter(W + 0.3, W + 1.0)(T), fadeOut(T, M - 0.15, M + 0.35));
  const signX = (1 - MOTION.enter(W + 0.3, W + 1.0)(T)) * 420 + MOTION.swap(M - 0.15, M + 0.35)(T) * 420;
  const rc = (d) => Math.min(MOTION.pop(M + 0.45 + d, M + 1.0 + d)(T), fadeOut(T, P - 0.15, P + 0.3));
  const cap = fadeIn(T, P + 0.9, P + 1.4), pill = MOTION.pop(P + 1.4, P + 1.9)(T);
  const credit = fadeIn(T, E + 0.1, E + 0.5);
  const logo = MOTION.enter(I, I + 0.5)(T);

  const abs = { position: 'absolute' };
  return (
    <div data-screen-label={`D1 Animation t=${Math.floor(T)}s`} style={{ ...abs, inset: 0, background: C.bg, overflow: 'hidden', fontFamily: 'Inter, sans-serif', color: C.text }}>
      <div style={{ ...abs, inset: 0, opacity: seam, transform: `scale(${push})`, transformOrigin: '50% 60%' }}>
        <div style={{ ...abs, left: 80, top: 80, width: 120, height: 120, borderRadius: '50%', boxShadow: '0 0 0 12px #0D1014', backgroundColor: '#0D1014', opacity: logo, background: 'url(assets/350-logo.png) -64px -24px/238px auto no-repeat' }} />

        {/* sign (Word) */}
        <div style={{ ...abs, left: 640, top: 620, width: 360, opacity: sign, transform: `translateX(${signX}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 360, boxSizing: 'border-box', padding: '40px 28px', background: C.tag, borderRadius: 28, borderBottom: `10px solid ${C.accent}`, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em' }}><Ph marks={marks}>{TERM}</Ph></span>
          </div>
          <div style={{ width: 20, height: 400, background: '#D5DCE2' }} />
        </div>

        {/* people first: photos (Meaning, Plain) */}
        {[['assets/photo-shopper-meat.png', 'Juho Kuva / NYT', ph1, kb1, 'center 0%'], ['assets/photo-shopper-produce.png', 'Hiroko Masuike / NYT', ph2, kb2, 'center 0%']].map(([src, cr, op, kb, pos]) => (
          <div key={src} style={{ ...abs, left: 80, top: 652, width: 500, height: 580, borderRadius: 36, overflow: 'hidden', opacity: op, background: '#1B292D' }}>
            <img src={src} alt="" style={{ ...abs, inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} />
            <div style={{ ...abs, right: 20, top: 20, background: 'rgba(13,16,20,0.82)', borderRadius: 999, padding: '10px 20px', fontSize: 24, fontWeight: 500, color: '#FFFFFF' }}>Photo: {cr}</div>
          </div>
        ))}

        {/* plain-version extras */}
        <div style={{ ...abs, left: 620, top: 672, width: 380, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 32, lineHeight: 1.35, color: C.sub, opacity: cap, transform: lift(cap) }}>Next up: a word from the campaign.</div>
          <div style={{ alignSelf: 'flex-start', background: C.tag, color: '#0D1014', borderRadius: 999, padding: '24px 34px', fontSize: 34, fontWeight: 500, lineHeight: 1.25, opacity: clamp(pill, 0, 1), transform: `scale(${0.85 + 0.15 * pill})`, transformOrigin: 'left center' }}>Have you heard this word before?</div>
        </div>

        {/* giraffe */}
        <div role="img" aria-label="Giraffe" style={{ ...abs, left: gx, top: 1350 - 80 - gh + 40, width: gw, height: gh, transform: `translateY(${rise}px) scale(${gs})`, transformOrigin: '100% 100%' }}>
          {(frames || []).map(([k, url]) => (
            <div key={k} style={{ ...abs, inset: 0, backgroundImage: `url(${url})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center bottom', opacity: k === activeKey ? 1 : 0.001 }} />
          ))}
        </div>

        {/* speech bubble */}
        <div style={{ ...abs, left: 80, top: 244, width: 920, height: 380, opacity: clamp(bub, 0, 1), transform: `scale(${0.6 + 0.4 * bub})`, transformOrigin: `${tailX + 24}px 100%` }}>
          <div style={{ ...abs, inset: 0, background: C.card, borderRadius: 44, boxShadow: '0 2px 0 #E1E6EA' }} />
          <div style={{ ...abs, left: clamp(tailX, 60, 812), bottom: -22, width: 48, height: 48, background: C.card, transform: 'rotate(45deg)', borderRadius: 6 }} />
          <div style={{ ...abs, left: 56, right: 56, top: 56, opacity: l0, transform: lift(l0), display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 44, fontWeight: 500, color: C.sub }}>Hi! I’m Jargon Giraffe.</div>
            <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', textWrap: 'pretty' }}>I’m here to turn climate jargon into plain talk.</div>
          </div>
          <div style={{ ...abs, left: 56, right: 56, top: 48, opacity: l1, transform: lift(l1), display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 44, fontWeight: 500, color: C.sub }}>Today’s word:</div>
            <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}><Ph marks={marks}>{TERM}</Ph>.</div>
          </div>
          <div style={{ ...abs, left: 56, right: 56, top: 52, opacity: l2, transform: lift(l2), fontSize: ff ? 46 : 60, fontWeight: 800, lineHeight: 1.16, letterSpacing: '-0.015em', textWrap: 'pretty' }}><Ph marks={marks}>{DEF}</Ph>{ff && <div style={{ marginTop: 14, fontSize: 32, fontWeight: 500, color: C.sub }}>— Candice Fortin, 350.org</div>}</div>
          <div style={{ ...abs, left: 56, right: 56, top: 52, opacity: l3, transform: lift(l3), fontSize: ff ? 54 : 60, fontWeight: 800, lineHeight: 1.16, letterSpacing: '-0.015em', textWrap: 'pretty' }}><Ph marks={marks}>{PLAIN}</Ph></div>
        </div>

        <div style={{ ...abs, left: 80, right: 80, bottom: 40, maxWidth: 640, fontSize: 22, lineHeight: 1.4, color: C.sub, opacity: credit }}>Giraffe based on “CSS 3D Giraffe animated” by Jan Valkenburg (codepen.io/janvalkenburg), MIT License · with thanks to codepen.io/josetxu</div>
      </div>
    </div>
  );
}

function GlossaryAnim() {
  const [t, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage width={1080} height={1350} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#F6F7F8">
        <GlossaryPiece marks={t.placeholderMarks} copy={t.copy} />
      </CompositionStage>
      <window.TweaksPanel>
        <window.TweakSection label="Playback" />
        <window.TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <window.TweakSection label="Copy" />
        <window.TweakRadio label="Copy" value={t.copy} options={['Fossilflation', 'Placeholders']} onChange={(v) => setTweak('copy', v)} />
        <window.TweakToggle label="Mark placeholders" value={t.placeholderMarks} onChange={(v) => setTweak('placeholderMarks', v)} />
      </window.TweaksPanel>
    </>
  );
}
window.GlossaryAnim = GlossaryAnim;
