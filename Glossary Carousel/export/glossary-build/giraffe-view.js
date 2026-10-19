// Giraffe: a three.js port of "CSS 3D Giraffe animated" (MIT © Jan Valkenburg, https://codepen.io/janvalkenburg/pen/RwqZPGj).
// Same box geometry, proportions and native colors; the external stock-photo skin is replaced with a generated spot
// pattern; adds a small mouth so it can talk to camera. Poses are calm and face the audience.
//   <giraffe-view pose="lean|center|face" [yaw head pitch focus]>  — live element (carousel)
//   window.GiraffeRender.ready.then(R => R.frame({yaw, head, pitch, mouth, blink, w, h})) -> dataURL (animation export)
(function () {
  const C1 = '#79361e', C2 = '#f2c642', PINK = '#ffc0cb';
  const POSES = {
    lean:   { yaw: 32, head: 12, pitch: 7 },   // three-quarter to us, head reaching toward the sign on the right
    center: { yaw: 26, head: 6,  pitch: 7 },   // three-quarter to us, talking
    face:   { yaw: -30, head: 6, pitch: 7 },   // three-quarter to us, turned toward the text on the left
  };
  const LEG = [[20, [0, 0, 0], [1, 1, 1], C1, 0], [20, [0, -20, 0], [1, 2, 1], C2, 1]];
  const LEG_OFF = [[-20, 0, 0], [20, 0, 0], [-20, 0, -80], [20, 0, -80]];
  const BODY = [[60, [-15, -100, -20], [1.05, .9, 2], C2, 1], [20, [0, -90, -110], [1, 1, 1], C1, 0]];
  const HEAD = [
    [30, [-5, -50, 10], [1, 3.5, 1], C2, 1], [10, [5.25, -15.75, -10], [1, 11.75, 1], C1, 0],
    [30, [-5, -190, 12.5], [1, 1, 2], C2, 1], [10, [-4, -136, 0], [1, 1.5, 1], C1, 0], [10, [15, -136, 0], [1, 1.5, 1], C1, 0],
    [10, [57.5, -100, 5], [2, 2, 1], C2, 1], [10, [77.5, -100, 5], [2, 2, 1], C2, 1],
    [8, [58.75, -99, 7.5], [2, 2, 1], PINK, 0], [8, [77.75, -99, 7.5], [2, 2, 1], PINK, 0],
    [10, [91, -183, 20], [3.2, 1, 1], '#111111', 0, 'eyes'], [10, [67.5, -185, 52], [2, 1, 1], C1, 0],
  ];
  const CX = 10;
  let libP;
  const lib = () => libP || (libP = import('https://esm.sh/three@0.160.0'));

  function skinTexture(T) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'); g.fillStyle = C2; g.fillRect(0, 0, 128, 128); g.fillStyle = C1;
    [[30, 34, 20], [92, 26, 14], [70, 84, 22], [18, 100, 13], [112, 104, 12], [52, 4, 9], [116, 62, 9]].forEach(([x, y, r]) => {
      g.beginPath(); g.ellipse(x, y, r, r * .82, .4, 0, Math.PI * 2); g.fill();
    });
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; return t;
  }

  class Rig {
    constructor(T) {
      this.T = T; const skin = skinTexture(T); const flat = {};
      const box = ([s, t, sc, color, sk, name]) => {
        const w = s * sc[0], h = s * sc[1], d = s * sc[2], geo = new T.BoxGeometry(w, h, d);
        let mat;
        if (sk) { const tx = skin.clone(); tx.needsUpdate = true; tx.repeat.set(Math.max(w, d) / 55, h / 55); mat = new T.MeshLambertMaterial({ map: tx }); }
        else mat = flat[color] || (flat[color] = new T.MeshLambertMaterial({ color }));
        const m = new T.Mesh(geo, mat);
        m.add(new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: .22 })));
        m.position.set(135 + sc[0] * (s / 2 + t[0] - 135) - CX, -sc[1] * (s / 2 + t[1]), sc[2] * t[2]);
        if (name) this[name] = m;
        return m;
      };
      const scene = new T.Scene();
      scene.add(new T.HemisphereLight('#ffffff', '#6a6f76', 2.3));
      const key = new T.DirectionalLight('#ffffff', 1.2); key.position.set(80, 240, 320); scene.add(key);
      const root = new T.Group(), head = new T.Group(), headIn = new T.Group();
      LEG_OFF.forEach(o => LEG.forEach(b => { const m = box(b); m.position.x += o[0]; m.position.z += o[2]; root.add(m); }));
      BODY.forEach(b => root.add(box(b)));
      HEAD.forEach(b => headIn.add(box(b)));
      // mouth: small dark slot on the front of the snout, under the nose
      const mouth = new T.Mesh(new T.BoxGeometry(14, 3, 3), new T.MeshBasicMaterial({ color: '#3b160a' }));
      mouth.position.set(0, 166, 56); headIn.add(mouth); this.mouth = mouth;
      // audience-readable eyes on both sides of the head (the original's eye bar sits inside the head)
      this.eyeParts = [];
      [-1, 1].forEach(sd => {
        const w = new T.Mesh(new T.BoxGeometry(3, 11, 11), new T.MeshLambertMaterial({ color: '#ffffff' }));
        w.position.set(sd * 16.2, 181, 33); headIn.add(w);
        const p = new T.Mesh(new T.BoxGeometry(2, 6.5, 6.5), new T.MeshBasicMaterial({ color: '#141414' }));
        p.position.set(sd * 17.4, 180, 35); headIn.add(p);
        this.eyeParts.push(w, p);
      });
      // 350 logo worn as a round pin on the front of the neck
      if (Rig.logo) {
        const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
        g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.clip();
        // logo source: circle centered ~(191,131), r ~95 in the 356x262 file
        g.drawImage(Rig.logo, 191 - 95, 131 - 95, 190, 190, 0, 0, 256, 256);
        const tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace;
        const face = new T.MeshBasicMaterial({ map: tx }), rim = new T.MeshLambertMaterial({ color: '#2a6f98' });
        const pin = new T.Mesh(new T.CylinderGeometry(10, 10, 2.4, 40), [rim, face, rim]);
        pin.rotation.set(Math.PI / 2, Math.PI / 2, 0); pin.position.set(0, 138, 26.4); headIn.add(pin);
      }
      head.add(headIn); root.add(head); scene.add(root);
      Object.assign(this, { scene, root, head, headIn });
      const b = new T.Box3().setFromObject(root); this.bbox = b; // neutral framing, fixed for all poses
      this.cam = new T.PerspectiveCamera(22, 1, 1, 6000);
    }
    pose({ yaw = 0, head = 6, pitch = 6, mouth = 0, blink = 0 } = {}) {
      const d = this.T.MathUtils.degToRad;
      this.root.rotation.y = d(yaw); this.head.rotation.x = d(head); this.headIn.position.z = -head * 1.1;
      this.mouth.scale.y = 0.6 + mouth * 2.2; this.mouth.position.y = 166 - mouth * 2.5;
      this.eyes.scale.y = 1 - 0.85 * blink; this.eyeParts.forEach(m => m.scale.y = 1 - 0.9 * blink); this._pitch = pitch;
    }
    frame(r, w, h, focus = 1) {
      const T = this.T, cam = this.cam, b = this.bbox;
      cam.aspect = w / h;
      const top = b.max.y + 12, bot = top - (b.max.y - b.min.y + 24) * focus, cy = (top + bot) / 2, vh = top - bot;
      const pb = new T.Box3().setFromObject(this.root); const cx = (pb.min.x + pb.max.x) / 2; const vw = (pb.max.x - pb.min.x) * 1.06;
      const fov = cam.fov * Math.PI / 180, tan = Math.tan(fov / 2);
      const dist = Math.max(vh / 2 / tan, vw / 2 / (tan * cam.aspect)) + 60;
      const pr = this._pitch * Math.PI / 180;
      cam.position.set(cx, cy + Math.sin(pr) * dist, 20 + Math.cos(pr) * dist);
      cam.lookAt(cx, cy, 20); cam.updateProjectionMatrix();
      r.render(this.scene, cam);
    }
  }

  function loadLogo() {
    return new Promise(res => {
      const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = 'assets/350-logo.png';
    });
  }
  const readyP = Promise.all([lib(), loadLogo()]).then(([T, logo]) => {
    Rig.logo = logo;
    const rig = new Rig(T);
    const r = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.outputColorSpace = T.SRGBColorSpace;
    const cache = new Map();
    return {
      T, Rig,
      frame(o) {
        const w = o.w || 540, h = o.h || 760;
        const key = [o.format || 'png', w, h, o.focus, o.yaw, o.head, o.pitch, o.mouth, o.blink].map(v => (+v || 0).toFixed(1)).join('|');
        if (cache.has(key)) return cache.get(key);
        r.setSize(w, h, false); rig.pose(o); rig.frame(r, w, h, o.focus ?? 1);
        const url = r.domElement.toDataURL(o.format || 'image/png', 0.92);
        if (cache.size > 1500) cache.delete(cache.keys().next().value);
        cache.set(key, url); return url;
      },
    };
  });
  window.GiraffeRender = { ready: readyP };

  class GiraffeView extends HTMLElement {
    static get observedAttributes() { return ['pose', 'yaw', 'head', 'pitch', 'focus', 'mouth']; }
    connectedCallback() {
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' }).innerHTML =
        '<style>:host{display:block;position:relative;width:100%;height:100%;min-height:0}img{position:absolute;inset:0;width:100%;height:100%;display:block}</style><img alt="">';
      this._img = this.shadowRoot.querySelector('img');
      readyP.then(R => { this._R = R; this.draw(); });
      this._ro = new ResizeObserver(() => this.draw()); this._ro.observe(this);
    }
    disconnectedCallback() { this._ro && this._ro.disconnect(); }
    attributeChangedCallback() { this.draw(); }
    draw() {
      if (!this._R || !this._img) return;
      const p = Object.assign({}, POSES[this.getAttribute('pose')] || POSES.face);
      ['yaw', 'head', 'pitch', 'mouth'].forEach(k => { if (this.hasAttribute(k)) p[k] = +this.getAttribute(k); });
      const w = this.clientWidth, h = this.clientHeight; if (!w || !h) return;
      const k = 2; // render at 2x for crisp export
      p.w = Math.round(w * k); p.h = Math.round(h * k); p.focus = this.hasAttribute('focus') ? +this.getAttribute('focus') : 1;
      this._img.src = this._R.frame(p);
    }
  }
  if (!customElements.get('giraffe-view')) customElements.define('giraffe-view', GiraffeView);
})();
