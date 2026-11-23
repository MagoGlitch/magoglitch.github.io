    const { useState, useEffect, useRef, useMemo } = React;

    const WHATSAPP_NUMBER = '5531992142870';

    // Acessibilidade: transforma um elemento clicável em "botão" de teclado
    const pressable = (fn, label) => ({
      role: 'button',
      tabIndex: 0,
      'aria-label': label,
      onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          fn();
        }
      },
    });
    const shortTitle = (t = '') => t.split(/ [—-] /)[0];
    // Versão mobile (< 768px): Carrosséis e Estáticos não prendem a rolagem da página (navegação livre por arraste).
    // Acima disso (desktop/tablet largo) nada muda.
    const isFreeMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
    // No celular os slides "todos na tela" ficam minúsculos: abre já no modo ampliado (arrastar para o lado)
    const defaultRibbonMode = () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 'scroll' : 'fit');

    // No celular a barra do navegador aparece/some ao rolar e dispara "resize" sem mudar a largura.
    // Recalcular tudo nessa hora trava a rolagem; então só reagimos quando a largura muda.
    const onWidthResize = (fn) => {
      let lastW = window.innerWidth;
      return (e) => {
        const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (coarse && window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        fn(e);
      };
    };
    const IS_TOUCH = typeof window !== 'undefined' && (
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    );
    const WA_ICON_PATH = "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z";
    const PHOTO_PORTFOLIO_URL = 'https://www.cliqueepoesia.com.br/#portfolio';
    const DEFAULT_WA_MSG = 'Olá Marcos! Vi seu portfólio e gostaria de conversar sobre um projeto de design.';
    const whatsappHref = (msg = DEFAULT_WA_MSG) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    // Shared Scroll & Pacing Constants for Hero 3D & Transitions
    const ANIM_SCROLL = 1800;
    const BROWSE_SCROLL = 350;
    const GALLERY_END = ANIM_SCROLL + BROWSE_SCROLL;
    const HEADER_H = 0; // Header height (0 = disabled/hidden as requested, 68 = enabled)

    
    // =========================================================================
    // VANTE 3D RIBBON SCROLL HERO (INÍCIO / HOME VIEW)
    // =========================================================================
    // Área de atuação: ao passar o mouse, tocar ou focar, a barra enche até 100% com contador
    function SkillRow({ label }) {
      const [level, setLevel] = useState(0);
      const animRef = useRef(0);
      const fill = () => {
        if (level >= 100 || animRef.current) return;
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { setLevel(100); return; }
        const start = performance.now();
        const DURATION = 900;
        const step = (now) => {
          const t = Math.min(1, (now - start) / DURATION);
          const eased = 1 - Math.pow(1 - t, 4);
          setLevel(Math.round(eased * 100));
          if (t < 1) animRef.current = requestAnimationFrame(step);
          else animRef.current = 0;
        };
        animRef.current = requestAnimationFrame(step);
      };
      useEffect(() => () => cancelAnimationFrame(animRef.current), []);
      const done = level >= 100;
      return (
        <li
          className={`vante-skill-item vante-skill-meter${done ? ' is-full' : ''}`}
          tabIndex={0}
          aria-label={label}
          onMouseEnter={fill}
          onFocus={fill}
          onClick={fill}
        >
          <span className="vante-skill-fill" aria-hidden="true" style={{ transform: `scaleX(${level / 100})` }} />
          <span className="vante-skill-name">
            <span className="vante-skill-star" aria-hidden="true">✦</span> {label}
          </span>
          <span className="vante-skill-level" aria-hidden="true">{level > 0 ? `${level}%` : ''}</span>
        </li>
      );
    }

    function HomeView({ idVisual, onSelectProject, onNavigate, heroVersion = 'v2' }) {
      const containerRef = useRef(null);
      const stageRef = useRef(null);
      const canvasRef = useRef(null);
      const nameRef = useRef(null);
      const l1Ref = useRef(null);
      const l2Ref = useRef(null);
      const capRef = useRef(null);
      const glowRef = useRef(null);
      const crossRef = useRef(null);
      const ruleRef = useRef(null);
      const hintRef = useRef(null);
      const bgPhotoRef = useRef(null);
      const charCutoutRef = useRef(null);
      const uiWrapRef = useRef(null);
      const uiTopRef = useRef(null);
      const uiLeftCardRef = useRef(null);
      const uiRightCardRef = useRef(null);
      const uiDockRef = useRef(null);
      const botRef = useRef(null);

      useEffect(() => {
        let renderer = null, scene = null, camera = null;
        let animId = null;
        let isDisposed = false;

        const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
        const mix = (a, b, t) => a + (b - a) * t;
        const ease = t => t * t * (3 - 2 * t);
        const out = t => 1 - Math.pow(1 - t, 3);
        const span = (p, a, b) => clamp((p - a) / (b - a));

        function initThree() {
          const THREE = window.THREE;
          if (!THREE || !canvasRef.current || isDisposed) return;

          const canvas = canvasRef.current;
          renderer = new THREE.WebGLRenderer({ canvas, antialias: !(window.matchMedia && window.matchMedia('(pointer: coarse)').matches), alpha: true, powerPreference: 'high-performance' });
          renderer.setClearColor(0, 0);
          renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
          scene = new THREE.Scene();

          const FOV = 35;
          camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

          // Build ribbon path
          let path, PATH_L = 1;
          const SAMPLES = 1200, pathP = [], pathT = [];
          const PH0 = -1.5, PH1 = Math.PI * 2 + 1.35;

          function buildPath() {
            const pts = [];
            for (let i = 0; i <= 160; i++) {
              const t = i / 160, ph = mix(PH0, PH1, t), cs = Math.cos(ph), u = 2 * t - 1;
              const depth = cs > 0 ? 7.6 + 16.4 * Math.pow(cs, 0.9) : 7.6 + 2.2 * cs;
              const edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
              pts.push(new THREE.Vector3(
                edge * Math.sin(ph) * depth * 0.561,
                0.5 * Math.sign(u) * Math.pow(Math.abs(u), 1.4) * depth * 0.63,
                -depth
              ));
            }
            path = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
            path.arcLengthDivisions = 1500;
            PATH_L = path.getLength();
            pathP.length = pathT.length = 0;
            for (let i = 0; i <= SAMPLES; i++) {
              const u = i / SAMPLES;
              pathP.push(path.getPointAt(u));
              pathT.push(path.getTangentAt(u));
            }
          }

          const at = (s, op, ot) => {
            const f = clamp(s / PATH_L) * SAMPLES, i = Math.min(SAMPLES - 1, Math.floor(f)), k = f - i;
            op.lerpVectors(pathP[i], pathP[i + 1], k);
            ot.lerpVectors(pathT[i], pathT[i + 1], k).normalize();
          };

          // Cards setup
          const CARD_W = 2.1, CARD_H = 1.32, GAP = 0.03, STEP = CARD_W + GAP, NX = 28, NY = 3;
          const vs = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
          const fs = 'uniform sampler2D map;uniform vec2 cover;uniform float aspect,ready,radius;varying vec2 vUv;' +
            'void main(){' +
            '  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;' +
            '  vec4 texColor=texture2D(map,(uv-.5)*cover+.5);' +
            '  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;' +
            '  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;' +
            '  float px=fwidth(d),a=1.-smoothstep(-px,px,d);' +
            '  if(a<.01)discard;' +
            '  vec3 c=mix(vec3(.075),texColor.rgb,ready);' +
            '  float edge=smoothstep(-.012-px,-.012,d);' +
            '  gl_FragColor=vec4(mix(c,vec3(1.),edge*.1),a);' +
            '}';

          const textureLoader = new THREE.TextureLoader();
          const cards = idVisual.map((item, i) => {
            const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
            const mat = new THREE.ShaderMaterial({
              vertexShader: vs,
              fragmentShader: fs,
              transparent: true,
              depthWrite: true,
              depthTest: true,
              side: THREE.DoubleSide,
              uniforms: {
                map: { value: null },
                cover: { value: new THREE.Vector2(1, 1) },
                aspect: { value: CARD_W / CARD_H },
                ready: { value: 0 },
                radius: { value: 0.018 }
              }
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.frustumCulled = false;
            mesh.renderOrder = 1;
            scene.add(mesh);

            const imgSrc = item.vanteCover || item.presentationImage || item.cover;
            textureLoader.load(imgSrc, (tex) => {
              if (isDisposed) return;
              tex.colorSpace = THREE.LinearSRGBColorSpace;
              tex.generateMipmaps = true;
              tex.minFilter = THREE.LinearMipmapLinearFilter;
              tex.magFilter = THREE.LinearFilter;
              if (renderer) {
                tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 16);
              }
              tex.needsUpdate = true;
              mat.uniforms.map.value = tex;
              const img = tex.image;
              if (img && img.width && img.height) {
                const va = img.width / img.height;
                const ca = CARD_W / CARD_H;
                mat.uniforms.cover.value.set(va > ca ? ca / va : 1, va > ca ? 1 : va / ca);
              }
              mat.uniforms.ready.value = 1;
              mat.needsUpdate = true;
              heroDirty = true;
            });

            return { i, title: item.title, project: item, geo, mat, mesh, rect: null };
          });

          // Character Mesh (Marcos Cutout in 3D at z = -10.0)
          // In Versão 01: front loop (z > -10.0) renders in front of Marcos (renderOrder = 3)
          // back loop (z <= -10.0) renders behind Marcos (renderOrder = 1)
          // In Versão 02: all ribbon movements pass behind Marcos (cards renderOrder = 1, charMesh renderOrder = 2)
          let baseCharW = 1, baseCharH = 1;
          const charGeo = new THREE.PlaneGeometry(1, 1);
          const charMat = new THREE.MeshBasicMaterial({
            map: null,
            transparent: true,
            alphaTest: 0.02,
            depthWrite: false,
            depthTest: false,
            side: THREE.DoubleSide
          });
          const charMesh = new THREE.Mesh(charGeo, charMat);
          charMesh.position.set(0, 0, -10.0);
          charMesh.renderOrder = 2;
          charMesh.frustumCulled = false;
          charMesh.visible = false;
          scene.add(charMesh);

          const cutoutSrc = heroVersion === 'v2'
            ? 'https://pub-08de669c0de241f1af8701cc7d228e29.r2.dev/BG%20HERO/marcos-v2-cutout.webp?v=1'
            : 'https://pub-08de669c0de241f1af8701cc7d228e29.r2.dev/BG%20HERO/marcos-cutout.webp?v=2';

          textureLoader.load(cutoutSrc, (tex) => {
            if (isDisposed) return;
            tex.colorSpace = THREE.LinearSRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            charMat.map = tex;
            charMat.needsUpdate = true;
            heroDirty = true;
            charMesh.visible = true;
            if (charCutoutRef.current) charCutoutRef.current.style.display = 'none';
          });

          // Layout & Sizing
          const GZ = 8.4;
          let W = 1, H = 1, asp = 1, cols = 3, rows = 3, tanH = 0.3153;

          let STAGE_H = Math.max(1, window.innerHeight - HEADER_H);
          let TRACK_TOTAL = GALLERY_END + STAGE_H;

          function updateTrackHeight() {
            STAGE_H = Math.max(1, window.innerHeight - HEADER_H);
            TRACK_TOTAL = GALLERY_END + STAGE_H;
            if (containerRef.current) {
              containerRef.current.style.height = TRACK_TOTAL + 'px';
            }
          }

          let target = 0, p = 0;
          var heroDirty = true; // só redesenha o WebGL quando algo mudou
          function readScroll() {
            const sy = window.scrollY;
            target = clamp(sy / ANIM_SCROLL);

            const stageEl = stageRef.current;
            if (stageEl) {
              if (sy > GALLERY_END) {
                const offset = sy - GALLERY_END;
                stageEl.style.transform = 'translate3d(0, -' + offset + 'px, 0)';
                stageEl.style.pointerEvents = offset >= STAGE_H ? 'none' : 'auto';
              } else {
                stageEl.style.transform = 'translate3d(0, 0, 0)';
                stageEl.style.pointerEvents = 'auto';
              }
            }
          }

          function resize() {
            if (!containerRef.current || isDisposed) return;
            updateTrackHeight();
            W = window.innerWidth;
            H = Math.max(1, window.innerHeight - HEADER_H);
            asp = W / H;
            const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
            renderer.setPixelRatio(isCoarse ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2));
            heroDirty = true;
            renderer.setSize(W, H, false);
            camera.aspect = asp;
            camera.fov = asp < 16 / 9 ? Math.atan(0.561 / asp) * 360 / Math.PI : FOV;
            camera.updateProjectionMatrix();
            tanH = Math.tan(camera.fov * Math.PI / 360);
            cols = asp < 0.9 ? 2 : 3;
            rows = asp < 0.9 ? 5 : 3;

            const D = 10.0;
            const vh3d = 2 * D * tanH;
            const vw3d = vh3d * asp;
            const imgAspect = 2560 / 1440;
            if (asp > imgAspect) {
              baseCharW = vw3d;
              baseCharH = vw3d / imgAspect;
            } else {
              baseCharH = vh3d;
              baseCharW = vh3d * imgAspect;
            }

            readScroll();
          }

          updateTrackHeight();
          const resizeOnWidth = onWidthResize(resize);
          window.addEventListener('resize', resizeOnWidth);
          resize();
          buildPath();

          window.addEventListener('scroll', readScroll, { passive: true });
          readScroll();

          function grid(i) {
            const vh = 2 * GZ * tanH;
            const vw = vh * asp;
            const targetGW = vw * (cols === 3 ? 0.78 : 0.95);
            const gap = targetGW * 0.016;
            let cw = (targetGW - gap * (cols - 1)) / cols;
            let ch = cw / (CARD_W / CARD_H);
            let gh = ch * rows + gap * 1.5 * (rows - 1);

            // Cap grid height to 70% of viewport height so covers are large and immersive while 2026 and footer remain completely clear
            const maxGH = vh * (cols === 3 ? 0.70 : 0.84);
            if (gh > maxGH) {
              const scale = maxGH / gh;
              cw *= scale;
              ch *= scale;
              gh = maxGH;
            }
            const gw = cw * cols + gap * (cols - 1);

            // Balanced vertical margin leaving clear headroom for PORTFÓLIO and 2026 at the top
            const yOffset = -vh * 0.01;

            const c = i % cols;
            const r = Math.floor(i / cols);
            return {
              x: -gw / 2 + cw / 2 + c * (cw + gap),
              y: gh / 2 - ch / 2 - r * (ch + gap * 1.5) + yOffset,
              w: cw,
              h: ch,
              vw,
              vh,
              c,
              r
            };
          }

          // Poses
          const op = new THREE.Vector3(), ot = new THREE.Vector3(), up = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), vp = new THREE.Vector3();

          function poseRibbon(c, head) {
            const pos = c.geo.attributes.position;
            const centre = head - c.i * STEP;
            for (let iy = 0; iy <= NY; iy++) {
              for (let ix = 0; ix <= NX; ix++) {
                const k = iy * (NX + 1) + ix, lu = ix / NX - 0.5, lv = 0.5 - iy / NY;
                at(centre + lu * CARD_W, op, ot);
                up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
                vp.copy(op).addScaledVector(up, lv * CARD_H);
                pos.setXYZ(k, vp.x, vp.y, vp.z);
              }
            }
            pos.needsUpdate = true;
          }

          function poseGrid(c, q) {
            const g = grid(c.i);
            const pos = c.geo.attributes.position;
            const dx = (g.c - (cols - 1) / 2) * 1.2;
            const dy = g.r === 0 ? 1 : (g.r === rows - 1 ? -1 : 0);
            const ox = dx * g.vw * 0.62 * (1 - q);
            const oy = dy * g.vh * (g.c === 1 ? 0.95 : 0.34) * (1 - q);
            const tilt = (1 - q) * 0.22 * (g.c - 1 || 0.5) * (dy || 1);
            const cs = Math.cos(tilt);
            const sn = Math.sin(tilt);
            for (let iy = 0; iy <= NY; iy++) {
              for (let ix = 0; ix <= NX; ix++) {
                const k = iy * (NX + 1) + ix, x = (ix / NX - 0.5) * g.w, y = (0.5 - iy / NY) * g.h;
                pos.setXYZ(
                  k,
                  g.x + ox + x * cs - y * sn,
                  g.y + oy + x * sn + y * cs,
                  -GZ - (1 - q) * 0.6 * Math.sin(ix / NX * Math.PI)
                );
              }
            }
            pos.needsUpdate = true;
            c.rect = g;
          }

          const RIB_A = 0.20, RIB_B = 0.68;

          function render() {
            const pp = p;

            // Phase 1: Desktop UI overlay (PORTFÓLIO, Cards, Dock)
            // Visible at pp = 0, slides out and fades completely before pp = 0.16
            const uiP = span(pp, 0.00, 0.15);
            const uiAlpha = 1 - uiP;
            if (uiWrapRef.current) {
              uiWrapRef.current.style.opacity = uiAlpha;
              uiWrapRef.current.style.pointerEvents = uiAlpha < 0.1 ? 'none' : 'auto';
              uiWrapRef.current.style.visibility = uiAlpha < 0.02 ? 'hidden' : 'visible';
            }
            if (uiTopRef.current) {
              uiTopRef.current.style.transform = `translate(-50%, ${-uiP * 50}px)`;
            }
            if (uiLeftCardRef.current) {
              uiLeftCardRef.current.style.transform = `translate3d(${-uiP * 80}px, 0, 0)`;
            }
            if (uiRightCardRef.current) {
              uiRightCardRef.current.style.transform = `translate3d(${uiP * 80}px, 0, 0)`;
            }
            if (uiDockRef.current) {
              uiDockRef.current.style.transform = `translate(-50%, ${uiP * 60}px)`;
            }

            // Phase 2: Kinetic Typography (MARCOS / DESIGNER)
            // Appears ONLY after desktop UI has faded out (pp >= 0.16)
            // some no fim do percurso para não sobrar pedaço da palavra na borda (ex.: "ER" no celular)
            const textAlpha = span(pp, 0.16, 0.24) * (1 - span(pp, 0.6, 0.7));
            const rise = 1 - out(span(pp, 0.16, 0.32));
            const run = mix(-48, 72, span(pp, 0.16, 0.65));

            if (l1Ref.current) {
              l1Ref.current.style.opacity = textAlpha;
              l1Ref.current.style.transform = 'translate3d(' + run + 'vw,' + (rise * 20) + 'vh,0)';
            }
            if (l2Ref.current) {
              l2Ref.current.style.opacity = textAlpha;
              l2Ref.current.style.transform = 'translate3d(' + (-run) + 'vw,' + (rise * 20) + 'vh,0)';
            }

            const capA = span(pp, 0.20, 0.28) * (1 - span(pp, 0.58, 0.66));
            if (capRef.current) {
              capRef.current.style.opacity = capA;
              capRef.current.style.transform = 'translate(-50%, calc(-50% + ' + (rise * 20) + 'vh))';
            }

            if (hintRef.current) hintRef.current.style.opacity = 0;
            if (crossRef.current) crossRef.current.style.opacity = 0;
            if (glowRef.current) glowRef.current.style.opacity = 0;

            if (ruleRef.current) {
              ruleRef.current.style.transform = 'scaleX(' + ease(span(pp, 0.72, 0.86)) + ')';
              ruleRef.current.style.top = '44.5%';
            }

            if (botRef.current) {
              const botAlpha = span(pp, 0.72, 0.86);
              botRef.current.style.opacity = botAlpha;
              botRef.current.style.visibility = botAlpha < 0.05 ? 'hidden' : 'visible';
            }

            if (bgPhotoRef.current) {
              const photoFade = 1 - span(pp, 0.62, 0.76);
              const photoScale = 1 + pp * 0.08;
              bgPhotoRef.current.style.opacity = photoFade;
              bgPhotoRef.current.style.transform = `scale(${photoScale})`;
            }

            if (charCutoutRef.current) {
              const photoFade = 1 - span(pp, 0.62, 0.76);
              const photoScale = 1 + pp * 0.08;
              charCutoutRef.current.style.opacity = photoFade;
              charCutoutRef.current.style.transform = `scale(${photoScale})`;
            }

            if (charMesh && charMat && charMat.map) {
              const photoFade = 1 - span(pp, 0.62, 0.76);
              const photoScale = 1 + pp * 0.08;
              charMat.opacity = photoFade;
              charMat.depthWrite = heroVersion === 'v1' ? (photoFade > 0.5) : false;
              charMat.depthTest = heroVersion === 'v1' ? (photoFade > 0.5) : false;
              charMesh.scale.set(baseCharW * photoScale, baseCharH * photoScale, 1);
              charMesh.visible = photoFade > 0.001;
            }

            const pr = span(pp, RIB_A, RIB_B);
            const head = mix(0, PATH_L + cards.length * STEP, pr);

            for (const c of cards) {
              const s = head - c.i * STEP;
              const end = PATH_L - CARD_W;
              if (s < end) {
                c.mesh.visible = (pp >= RIB_A) && (s > CARD_W);
                c.rect = null;
                if (c.mesh.visible) {
                  poseRibbon(c, head);
                  at(head - c.i * STEP, op, ot);
                  // Front loop (z > -10.0, across face/chest): passes IN FRONT of character (renderOrder = 3)
                  // Bottom sweep & top head sweep (z <= -10.0): passes BEHIND character (renderOrder = 1)
                  c.mesh.renderOrder = (op.z > -10.0) ? 3 : 1;
                }
              } else if (c.i < cols * rows) {
                const st = mix(RIB_A, RIB_B, (end + c.i * STEP) / (PATH_L + cards.length * STEP));
                const q = out(span(pp, st, st + 0.13));
                c.mesh.visible = q > 0.001;
                if (c.mesh.visible) {
                  poseGrid(c, q);
                  c.mesh.renderOrder = 3;
                }
              } else {
                c.mesh.visible = false;
                c.rect = null;
              }
            }
            renderer.render(scene, camera);
          }

          // Hover detection
          const handlePointerMove = (e) => {
            if (!nameRef.current || isDisposed) return;
            if (e.pointerType && e.pointerType !== 'mouse') { nameRef.current.style.opacity = '0'; return; }
            if (window.scrollY > GALLERY_END + STAGE_H) {
              nameRef.current.style.opacity = '0';
              return;
            }
            let hit = null;
            if (p > 0.72) {
              const stageEl = stageRef.current;
              const stageY = stageEl ? stageEl.getBoundingClientRect().top : HEADER_H;
              const relativeY = e.clientY - stageY;
              const nx = (e.clientX / W - 0.5);
              const ny = (0.5 - relativeY / H);
              for (const c of cards) {
                const g = c.rect;
                if (!g) continue;
                const x = nx * g.vw, y = ny * g.vh;
                if (Math.abs(x - g.x) < g.w / 2 && Math.abs(y - g.y) < g.h / 2) {
                  hit = c;
                  break;
                }
              }
            }
            nameRef.current.style.opacity = hit ? '1' : '0';
            if (hit) {
              nameRef.current.textContent = hit.title + ' ↗';
              nameRef.current.style.transform = 'translate(' + (e.clientX + 14) + 'px, ' + (e.clientY + 16) + 'px)';
              if (canvas) canvas.style.cursor = 'pointer';
            } else {
              if (canvas) canvas.style.cursor = 'default';
            }
          };

          const handleClick = (e) => {
            if (window.scrollY > GALLERY_END + STAGE_H) return;
            if (p > 0.72) {
              const stageEl = stageRef.current;
              const stageY = stageEl ? stageEl.getBoundingClientRect().top : HEADER_H;
              const relativeY = e.clientY - stageY;
              const nx = (e.clientX / W - 0.5);
              const ny = (0.5 - relativeY / H);
              for (const c of cards) {
                const g = c.rect;
                if (!g) continue;
                const x = nx * g.vw, y = ny * g.vh;
                if (Math.abs(x - g.x) < g.w / 2 && Math.abs(y - g.y) < g.h / 2) {
                  onSelectProject(c.project);
                  break;
                }
              }
            }
          };

          window.addEventListener('pointermove', handlePointerMove, { passive: true });
          window.addEventListener('click', handleClick);

          // Animation loop com occlusion culling: pausa WebGL quando o Hero estiver fora da tela
          function loop() {
            if (isDisposed) return;
            const inView = window.scrollY <= TRACK_TOTAL + 100;
            const isMoving = Math.abs(target - p) > 0.0001;
            if ((inView && heroDirty) || isMoving) {
              p += (target - p) * 0.12;
              if (Math.abs(target - p) < 0.00005) p = target;
              render();
              heroDirty = isMoving;
            }
            animId = requestAnimationFrame(loop);
          }
          loop();

          return () => {
            isDisposed = true;
            if (animId) cancelAnimationFrame(animId);
            window.removeEventListener('resize', resizeOnWidth);
            window.removeEventListener('scroll', readScroll);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('click', handleClick);
            if (renderer) renderer.dispose();
          };
        }

        if (window.THREE) {
          const cleanup = initThree();
          return cleanup;
        } else {
          let cleanupFn = null;
          const onThreeReady = () => {
            cleanupFn = initThree();
          };
          window.addEventListener('three-ready', onThreeReady, { once: true });
          return () => {
            isDisposed = true;
            window.removeEventListener('three-ready', onThreeReady);
            if (cleanupFn) cleanupFn();
          };
        }
      }, [idVisual, onSelectProject, heroVersion]);

      return (
        <div id="vante-track" ref={containerRef}>
          <main className="vante-stage" ref={stageRef}>
            <div
              id="vante-bg-photo"
              ref={bgPhotoRef}
              className={`vante-bg-photo ${heroVersion === 'v2' ? 'vante-bg-photo-v2' : ''}`}
            ></div>

            {/* TOP HEADLINE (Behind Character in V1, z-index: 2) */}
            <div className="vante-ui-top" ref={uiTopRef}>
              <h1 className="vante-ui-headline"><span className="sr-only">Marcos Gabriel, designer gráfico — </span>PORTFÓLIO</h1>
              <div className="vante-ui-sublines" style={{ justifyContent: 'flex-end' }}>
                <span className="vante-ui-year">2026</span>
              </div>
            </div>

            {/* CHARACTER CUTOUT (In front of PORTFÓLIO, z-index: 3) */}
            <div
              id="vante-char-cutout"
              ref={charCutoutRef}
              className={`vante-char-cutout ${heroVersion === 'v2' ? 'vante-char-cutout-v2' : ''}`}
            ></div>

            {/* HERO DESKTOP UI OVERLAY: CARDS & DOCK (z-index: 8) */}
            <div className="vante-desktop-ui" ref={uiWrapRef}>
              {/* LEFT CARD: DESIGNER & CRIADOR */}
              <div className="vante-ui-card vante-ui-card-left" ref={uiLeftCardRef}>
                {/* Subtle Doodle Sparkle */}
                <div className="absolute -top-3 -right-3 pointer-events-none rotate-12">
                  <svg className="w-5 h-5 doodle-ink doodle" viewBox="0 0 50 50" fill="currentColor" aria-hidden="true">
                    <path d="M25,2 Q25,25 48,25 Q25,25 25,48 Q25,25 2,25 Q25,25 25,2 Z" />
                  </svg>
                </div>

                <p className="vante-ui-desc">
                  Gosto de criar, testar e explorar ideias criativas, unindo design, conteúdo, identidade visual e arte.
                </p>
                <button
                  type="button"
                  className="vante-ui-btn"
                  onClick={() => {
                    window.scrollTo({ top: ANIM_SCROLL, behavior: 'smooth' });
                  }}
                >
                  Conheça meu trabalho
                </button>
                <a
                  className="vante-ui-btn vante-ui-btn-ghost"
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conversar no WhatsApp ↗
                </a>
              </div>

              {/* RIGHT CARD: HABILIDADES */}
              <div className="vante-ui-card vante-ui-card-right" ref={uiRightCardRef}>
                {/* Subtle Doodle Sparkle */}
                <div className="absolute -top-3 -left-3 pointer-events-none -rotate-12">
                  <svg className="w-4 h-4 doodle-ink doodle" viewBox="0 0 50 50" fill="currentColor" aria-hidden="true">
                    <path d="M25,2 Q25,25 48,25 Q25,25 25,48 Q25,25 2,25 Q25,25 25,2 Z" />
                  </svg>
                </div>
                <p className="vante-skills-title">
                  <span>Áreas de atuação</span>
                </p>
                <ul className="vante-skills-list">
                  <SkillRow label="Design Gráfico" />
                  <SkillRow label="Identidade Visual" />
                  <SkillRow label="Social Media" />
                  <SkillRow label="Edição de vídeo" />
                  <SkillRow label="Motion Designer" />
                  <SkillRow label="Fotografia" />
                </ul>
              </div>

              {/* BOTTOM DOCK (macOS STYLE) */}
              <div className="vante-ui-dock-wrap" ref={uiDockRef} aria-label="Ferramentas que uso">
                <div className="vante-ui-dock">
                  {/* Ps */}
                  <div className="vante-dock-item" title="Adobe Photoshop">
                    <div className="vante-dock-icon" style={{ background: '#001e36', border: '1.5px solid #31a8ff' }}>
                      <span style={{ color: '#31a8ff', fontWeight: 800, fontSize: '15px' }}>Ps</span>
                    </div>
                    <span className="vante-dock-label">Photoshop</span>
                  </div>

                  {/* Ai */}
                  <div className="vante-dock-item" title="Adobe Illustrator">
                    <div className="vante-dock-icon" style={{ background: '#330000', border: '1.5px solid #ff9a00' }}>
                      <span style={{ color: '#ff9a00', fontWeight: 800, fontSize: '15px' }}>Ai</span>
                    </div>
                    <span className="vante-dock-label">Illustrator</span>
                  </div>

                  {/* Id */}
                  <div className="vante-dock-item" title="Adobe InDesign">
                    <div className="vante-dock-icon" style={{ background: '#2b001a', border: '1.5px solid #ff3366' }}>
                      <span style={{ color: '#ff3366', fontWeight: 800, fontSize: '15px' }}>Id</span>
                    </div>
                    <span className="vante-dock-label">InDesign</span>
                  </div>

                  {/* Pr */}
                  <div className="vante-dock-item" title="Adobe Premiere Pro">
                    <div className="vante-dock-icon" style={{ background: '#00005b', border: '1.5px solid #9999ff' }}>
                      <span style={{ color: '#9999ff', fontWeight: 800, fontSize: '15px' }}>Pr</span>
                    </div>
                    <span className="vante-dock-label">Premiere</span>
                  </div>

                  {/* Ae */}
                  <div className="vante-dock-item" title="Adobe After Effects">
                    <div className="vante-dock-icon" style={{ background: '#00005b', border: '1.5px solid #9999ff' }}>
                      <span style={{ color: '#9999ff', fontWeight: 800, fontSize: '15px' }}>Ae</span>
                    </div>
                    <span className="vante-dock-label">After Effects</span>
                  </div>

                  {/* Figma */}
                  <div className="vante-dock-item" title="Figma">
                    <div className="vante-dock-icon" style={{ background: '#1e1e1e' }}>
                      <svg viewBox="0 0 38 57" width="16" height="24" fill="none">
                        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
                        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
                        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
                        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
                        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
                      </svg>
                    </div>
                    <span className="vante-dock-label">Figma</span>
                  </div>
                </div>

              </div>
            </div>

            <div aria-hidden="true">
              <div className="vante-hl" id="vante-l1" ref={l1Ref} aria-hidden="true" style={{ opacity: 0 }}>
                <span>MAGO</span>
              </div>
              <div className="vante-hl" id="vante-l2" ref={l2Ref} aria-hidden="true" style={{ opacity: 0 }}>
                <span>DESIGNER</span>
              </div>
            </div>
            <div id="vante-cap" ref={capRef} style={{ opacity: 0 }}>
              DIREÇÃO DE ARTE, BRANDING & IDENTIDADE VISUAL ESTRATÉGICA
            </div>
            <div id="vante-glow" ref={glowRef}></div>
            <div id="vante-cross" ref={crossRef}><i>+</i></div>
            <div id="vante-rule" ref={ruleRef}></div>
            <canvas id="vante-gl" ref={canvasRef}></canvas>
            <div
              id="vante-hint"
              ref={hintRef}
              style={{ opacity: 0, pointerEvents: 'none' }}
              onClick={() => {
                window.scrollTo({ top: ANIM_SCROLL, behavior: 'smooth' });
              }}
            >
              ROLE PARA EXPLORAR &nbsp;↓
            </div>

            <footer className="vante-bot" ref={botRef} style={{ opacity: 0, visibility: 'hidden' }}>
              <div></div>
              <div className="vante-mid"></div>
              <button
                type="button"
                className="vante-r pointer-events-auto cursor-pointer hover:opacity-100 transition-opacity flex items-center gap-1 py-3"
                onClick={() => {
                  const sobre = document.getElementById('sobre-mim-section');
                  if (sobre) {
                    const rect = sobre.getBoundingClientRect();
                    const targetY = rect.top + window.scrollY - HEADER_H;
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                  } else {
                    const track = document.getElementById('carrosseis-track');
                    if (track) {
                      const rect = track.getBoundingClientRect();
                      const targetY = rect.top + window.scrollY - HEADER_H;
                      window.scrollTo({ top: targetY, behavior: 'smooth' });
                    }
                  }
                }}
              >
                <span>SOBRE O MAGO</span>
                <span className="text-emerald-400" aria-hidden="true">↓</span>
              </button>
            </footer>
          </main>
          <div id="vante-name" ref={nameRef}></div>
        </div>
      );
    }

    function App() {
      // Hero Version Switcher: 'v1' (locked chair cutout) | 'v2' (new cinematic bokeh portrait)
      const [heroVersion, setHeroVersion] = useState(() => {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const v = params.get('v') || params.get('hero');
          if (v === '1' || v === 'v1' || v === 'hero_v1') return 'v1';
          if (v === '2' || v === 'v2' || v === 'hero_v2') return 'v2';
        }
        return 'v2';
      });

      // 3 Main Category Menus: 'carrosseis' | 'estaticos' | 'identidade-visual'
      const [activeTab, setActiveTab] = useState('home');

      // Limpeza suave da URL: remove parâmetros de teste (?v=hero_v2) da barra sem recarregar
      useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search) {
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }, []);

      // Shared lightbox / details modal
      const [selectedProject, setSelectedProject] = useState(null);
      const [viewingCarousel, setViewingCarousel] = useState(null);
      const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

      // Separate projects by category
      const { carrosseis, estaticos, idVisual } = useMemo(() => {
        const all = (typeof window !== 'undefined' && window.PORTFOLIO_PROJECTS)
          ? window.PORTFOLIO_PROJECTS
          : (typeof PORTFOLIO_PROJECTS !== 'undefined' ? PORTFOLIO_PROJECTS : []);

        return {
          carrosseis: all.filter(p => p.category === 'Carrosséis'),
          estaticos: all.filter(p => p.category === 'Estáticos'),
          idVisual: all.filter(p => p.category === 'Identidade Visual')
        };
      }, []);

      // Selected Identidade Visual for the continuous presentation view
      const [selectedIdVisualIndex, setSelectedIdVisualIndex] = useState(0);
      const activeIdVisualProject = idVisual[selectedIdVisualIndex] || idVisual[0];

      // Manage body and html scroll depending on whether Home (Vante) is active
      useEffect(() => {
        if (activeTab === 'home') {
          document.documentElement.style.overflowY = 'auto';
          document.documentElement.style.overflowX = 'clip';
          document.body.style.overflowY = 'visible'; // body não pode virar contêiner de rolagem (senão o sticky dos Estáticos não prende)
          document.body.style.overflowX = 'clip';
          document.documentElement.style.height = 'auto';
          document.body.style.height = 'auto';
          const rootEl = document.getElementById('root');
          if (rootEl) {
            rootEl.style.height = 'auto';
            rootEl.style.overflow = 'visible';
          }
        } else {
          window.scrollTo(0, 0);
          document.documentElement.style.overflowY = 'hidden';
          document.documentElement.style.overflowX = 'hidden';
          document.body.style.overflowY = 'hidden';
          document.body.style.overflowX = 'hidden';
          document.documentElement.style.height = '100%';
          document.body.style.height = '100%';
          const rootEl = document.getElementById('root');
          if (rootEl) {
            rootEl.style.height = '100%';
            rootEl.style.overflow = 'hidden';
          }
        }
      }, [activeTab]);

      // =========================================================================
      // LENIS SMOOTH SCROLL (Global Butter-Smooth In-Page Physics Scroll)
      // =========================================================================
      useEffect(() => {
        if (typeof Lenis === 'undefined') return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        // No celular a rolagem nativa (com inércia do sistema) é mais fluida que a rolagem suave
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

        const lenis = new Lenis({
          duration: 1.25,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.5,
          infinite: false,
        });

        window.lenis = lenis;

        // Bridge window.scrollTo so all programmatic scrolls use Lenis physics
        const origScrollTo = window.scrollTo.bind(window);
        window.scrollTo = function(...args) {
          if (window.lenis && typeof args[0] === 'object' && args[0] !== null) {
            const opts = args[0];
            if (opts.top !== undefined) {
              window.lenis.scrollTo(opts.top, { immediate: opts.behavior === 'instant' });
              return;
            }
          } else if (window.lenis && typeof args[0] === 'number') {
            window.lenis.scrollTo(args[0], { immediate: true });
            return;
          }
          return origScrollTo(...args);
        };

        let reqId;
        function raf(time) {
          lenis.raf(time);
          reqId = requestAnimationFrame(raf);
        }
        reqId = requestAnimationFrame(raf);

        return () => {
          cancelAnimationFrame(reqId);
          lenis.destroy();
          window.lenis = null;
          window.scrollTo = origScrollTo;
        };
      }, []);

      // Synchronize Lenis running state with activeTab & modals
      useEffect(() => {
        if (!window.lenis) return;
        if (activeTab === 'home' && !selectedProject && !viewingCarousel) {
          window.lenis.start();
        } else {
          window.lenis.stop();
        }
      }, [activeTab, selectedProject, viewingCarousel]);

      // =========================================================================
      // DEDICATED PRESENTATION SMOOTH SCROLL (LENIS)
      // Provides ultra-fluid, floaty inertial scrolling across presentations
      // Direct DOM updates for 120fps hardware-accelerated responsiveness
      // =========================================================================
      useEffect(() => {
        if (typeof Lenis === 'undefined') return;

        // If not in presentation mode, tear down any existing presentation lenis
        if (!selectedProject || selectedProject.category !== 'Identidade Visual') {
          if (window.presentationLenis) {
            if (window.presentationLenis._cleanupRaf) {
              window.presentationLenis._cleanupRaf();
            }
            window.presentationLenis.destroy();
            window.presentationLenis = null;
          }
          return;
        }

        let rafId;
        let pLenis = null;

        // Allow DOM to paint the presentation modal container
        const timer = setTimeout(() => {
          const modalEl = document.getElementById('idvisual-modal-scroll');
          if (!modalEl) return;

          if (window.presentationLenis) {
            if (window.presentationLenis._cleanupRaf) {
              window.presentationLenis._cleanupRaf();
            }
            window.presentationLenis.destroy();
          }

          pLenis = new Lenis({
            wrapper: modalEl,
            content: modalEl.querySelector('main') || modalEl,
            duration: 1.6, // Floaty, luxurious momentum
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.4,
            infinite: false,
          });

          window.presentationLenis = pLenis;

          // Direct DOM tracking for zero React re-render overhead during high-framerate scroll
          pLenis.on('scroll', (e) => {
            const bar = document.getElementById('idvisual-progress-bar');
            if (bar && typeof e.progress === 'number') {
              bar.style.width = `${Math.min(100, Math.max(0, e.progress * 100))}%`;
            }

            const topBtn = document.getElementById('idvisual-back-to-top');
            if (topBtn && typeof e.progress === 'number') {
              if (e.progress > 0.02) {
                topBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
                topBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
              } else {
                topBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                topBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
              }
            }
          });

          function raf(time) {
            if (pLenis && !pLenis.isStopped) {
              pLenis.raf(time);
            }
            rafId = requestAnimationFrame(raf);
          }
          rafId = requestAnimationFrame(raf);

          pLenis._cleanupRaf = () => cancelAnimationFrame(rafId);
        }, 40);

        return () => {
          clearTimeout(timer);
          if (rafId) cancelAnimationFrame(rafId);
          if (pLenis) {
            pLenis.destroy();
            if (window.presentationLenis === pLenis) {
              window.presentationLenis = null;
            }
          }
        };
      }, [selectedProject?.id]);


      // =========================================================================
      // 3D COVER FLOW FOR CARROSSÉIS (DYNAMIC COVER FLOW NAVIGATION + UNITED VIEW)
      // =========================================================================
      // (declarado mais acima: viewingCarousel)
      const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
      const [coverMetrics, setCoverMetrics] = useState({ w: 320, h: 400 });
      const [ribbonFitMode, setRibbonFitMode] = useState(defaultRibbonMode()); // 'fit' (todos na tela) or 'scroll' (ampliado com rolagem)

      const flowViewportRef = useRef(null);
      const editorialTitleRef = useRef(null);
      const flowPos = useRef(0);
      const flowTarget = useRef(0);
      const flowLastTime = useRef(performance.now());
      const flowFrameId = useRef(0);
      const flowCardsRefs = useRef([]);
      const flowSettledAt = useRef(null);
      const flowHintRefs = useRef([]);
      const flowWheelAccum = useRef(0);

      const flowIsDragging = useRef(false);
      const flowDragStartX = useRef(0);
      const flowDragStartPos = useRef(0);
      const flowLastDragX = useRef(0);
      const flowLastDragTime = useRef(0);
      const flowVelocity = useRef(0);
      const flowHasDragged = useRef(false);
      const ribbonRef = useRef(null);
      const carrosseisTrackRef = useRef(null);
      const carrosseisSectionRef = useRef(null);

      // Lock body scroll when viewing panoramic carousel strip so horizontal gestures are smooth
      useEffect(() => {
        if (viewingCarousel) {
          const prev = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
          return () => {
            document.body.style.overflow = prev;
          };
        }
      }, [viewingCarousel]);

      // Color glow helper
      const hexToRgb = (hex) => {
        if (!hex || typeof hex !== 'string') return '16, 185, 129';
        const clean = hex.replace('#', '');
        if (clean.length === 6) {
          const r = parseInt(clean.substring(0, 2), 16);
          const g = parseInt(clean.substring(2, 4), 16);
          const b = parseInt(clean.substring(4, 6), 16);
          return `${r}, ${g}, ${b}`;
        }
        return '16, 185, 129';
      };

      // Responsive cover width and height (4:5 vertical covers) - fills full viewport with generous top/bottom padding
      useEffect(() => {
        const updateMetrics = () => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const maxH = Math.max(500, h - HEADER_H);
          const isMobile = w < 768;
          // Allocate space so cards never touch or cut off top/bottom
          // No mobile: calibra a altura para deixar respiro generoso entre cabeçalho, 'Psiu!' e título inferior
          const availableSceneH = isMobile ? Math.max(340, maxH - 260) : Math.max(380, maxH - 220);
          const maxCardH = isMobile ? Math.min(availableSceneH * 0.68, 380) : 440;
          const H = Math.round(Math.min(availableSceneH * (isMobile ? 0.68 : 0.74), maxCardH));
          const W = Math.round(H * 0.8); // 4:5 aspect ratio
          setCoverMetrics({ w: W, h: H });
        };
        updateMetrics();
        const updateMetricsOnWidth = onWidthResize(updateMetrics);
        window.addEventListener('resize', updateMetricsOnWidth);
        return () => window.removeEventListener('resize', updateMetricsOnWidth);
      }, []);

      // Scroll-driven progression & programmatic full-screen pinning for Carrosséis on Home page
      useEffect(() => {
        if (activeTab !== 'home') return;

        const handleHomeScroll = () => {
          const track = carrosseisTrackRef.current;
          const section = carrosseisSectionRef.current;
          if (!track || !section) return;

          if (isFreeMobile()) {
            // Mobile: seção normal na página; as capas andam só com o arraste lateral
            section.style.position = 'absolute';
            section.style.top = '0px';
            section.style.bottom = 'auto';
            section.style.left = '0px';
            section.style.right = '0px';
            section.style.width = '100%';
            return;
          }

          const rect = track.getBoundingClientRect();
          const stageH = window.innerHeight - HEADER_H;
          const travel = track.offsetHeight - stageH;
          if (travel <= 0) return;

          // Header offset
          if (rect.top > HEADER_H) {
            // State 1: Above track (user is in Hero / Identidade Visual)
            section.style.position = 'absolute';
            section.style.top = '0px';
            section.style.bottom = 'auto';
            section.style.left = '0px';
            section.style.right = '0px';
            section.style.width = '100%';
            flowTarget.current = 0;
          } else if (rect.bottom >= window.innerHeight) {
            // State 2: Inside track -> PINNED FULL-SCREEN!
            // Full 100vh viewport coverage, cards rotate directly with scroll
            section.style.position = 'fixed';
            section.style.top = `${HEADER_H}px`;
            section.style.bottom = 'auto';
            section.style.left = '0px';
            section.style.right = '0px';
            section.style.width = '100%';

            const scrolled = HEADER_H - rect.top;
            const rel = Math.max(0, Math.min(1, scrolled / travel));
            flowTarget.current = rel * (carrosseis.length - 1);
          } else {
            // State 3: Past track -> Pinned to bottom of track, pushed smoothly up by Estáticos
            section.style.position = 'absolute';
            section.style.top = 'auto';
            section.style.bottom = '0px';
            section.style.left = '0px';
            section.style.right = '0px';
            section.style.width = '100%';
            flowTarget.current = carrosseis.length - 1;
          }
        };

        window.addEventListener('scroll', handleHomeScroll, { passive: true });
        window.addEventListener('resize', handleHomeScroll);
        handleHomeScroll();
        return () => {
          window.removeEventListener('scroll', handleHomeScroll);
          window.removeEventListener('resize', handleHomeScroll);
        };
      }, [activeTab, carrosseis.length]);

      // Active glow color update
      useEffect(() => {
        if (carrosseis.length > 0 && carrosseis[currentFlowIndex]) {
          const c = carrosseis[currentFlowIndex].colors?.[0] || '#10b981';
          const rgb = hexToRgb(c);
          document.documentElement.style.setProperty('--glow', rgb);
        }
      }, [currentFlowIndex, carrosseis]);

      // Cover Flow Animation Loop (Apple exponential ease-out)
      useEffect(() => {
        if ((activeTab !== 'carrosseis' && activeTab !== 'home') || viewingCarousel) return;

        const N = carrosseis.length;
        if (N === 0) return;

        const ANG = 72;
        const GAP = 0.62;
        const STEP = 0.2;
        const DEPTH = 0.42;
        const W = coverMetrics.w;

        flowLastTime.current = performance.now();
        flowSettledAt.current = null;

        const tick = (now) => {
          const dt = Math.min((now - flowLastTime.current) / 1000, 0.1);
          flowLastTime.current = now;

          // Mobile: desaceleração suave e controlada (sem frear bruscamente nem disparar rápido)
          const easeSpeed = isFreeMobile() ? 7.5 : 12;
          const delta = flowTarget.current - flowPos.current;
          flowPos.current += delta * (1 - Math.exp(-dt * easeSpeed));
          if (Math.abs(delta) < 0.0005) {
            flowPos.current = flowTarget.current;
          }

          // Occlusion culling: se a trilha dos carrosséis estiver fora da tela e em repouso, pausa updates do DOM
          let inView = true;
          if (activeTab === 'home') {
            const track = document.getElementById('carrosseis-track');
            if (track) {
              const r = track.getBoundingClientRect();
              inView = r.bottom > -150 && r.top < window.innerHeight + 150;
            }
          }

          const settled = Math.abs(delta) < 0.0005;
          if ((!inView || flowSettledAt.current === flowPos.current) && settled) {
            flowFrameId.current = requestAnimationFrame(tick);
            return;
          }
          flowSettledAt.current = settled ? flowPos.current : null;

          const rounded = Math.max(0, Math.min(N - 1, Math.round(flowPos.current)));
          setCurrentFlowIndex(prev => (prev !== rounded ? rounded : prev));

          // Lembrete "Psiu!": some para a esquerda quando a fila anda, volta no primeiro carrossel
          const hintT = Math.min(1, Math.max(0, flowPos.current / 0.5));
          flowHintRefs.current.forEach((hintEl) => {
            if (!hintEl) return;
            hintEl.style.opacity = String(1 - hintT);
            hintEl.style.transform = `translate(${-hintT * 140}px, ${hintEl.dataset.centered ? '-50%' : '0'})`;
            hintEl.style.visibility = hintT >= 1 ? 'hidden' : 'visible';
          });

          // Position all covers in 3D
          const FLOW_CULL = window.innerWidth < 768 ? 4 : 9; // no celular só as capas próximas do centro ficam ativas
          for (let i = 0; i < N; i++) {
            const el = flowCardsRefs.current[i];
            if (!el) continue;

            const d = i - flowPos.current;
            const a = Math.abs(d);
            const s = Math.sign(d);

            if (a > FLOW_CULL) {
              el.style.display = 'none';
              continue;
            }

            el.style.display = 'block';

            let x, rot, z;
            if (a < 1) {
              x = d * GAP;
              rot = -d * ANG;
              z = -a * DEPTH;
            } else {
              x = s * (GAP + (a - 1) * STEP);
              rot = -s * ANG;
              z = -DEPTH;
            }

            const zIndex = Math.round(500 - a * 10);
            el.style.transform = `translate3d(${x * W}px, 0px, ${z * W}px) rotateY(${rot}deg)`;
            el.style.zIndex = zIndex;
          }

          // Smoothly hide left editorial title as carousels get close to the text
          if (editorialTitleRef.current) {
            // Stays 100% visible while cards are away (flowPos <= 0.7).
            // Fades smoothly between 0.7 and 1.4 as the cards arrive close to the writing.
            const p = Math.max(0, Math.min(1, (flowPos.current - 0.7) / 0.7));
            const op = 1 - p;
            editorialTitleRef.current.style.opacity = op.toFixed(3);
            editorialTitleRef.current.style.transform = `translate3d(${-p * 24}px, 0, 0)`;
            editorialTitleRef.current.style.pointerEvents = op < 0.05 ? 'none' : 'auto';
            editorialTitleRef.current.style.visibility = op < 0.01 ? 'hidden' : 'visible';
          }

          flowFrameId.current = requestAnimationFrame(tick);
        };

        flowFrameId.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(flowFrameId.current);
      }, [activeTab, viewingCarousel, carrosseis, coverMetrics]);

      // Wheel handler for Cover Flow
      const handleFlowWheel = (e) => {
        if (viewingCarousel || selectedProject) return;
        if (activeTab === 'home') {
          // On Home page, the flow is 100% driven by the native page scroll!
          // We let the window scroll naturally so trackpad, wheel, and scrollbar work uniformly.
          return;
        }

        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        flowWheelAccum.current += delta;
        if (Math.abs(flowWheelAccum.current) >= 30) {
          const step = flowWheelAccum.current > 0 ? 1 : -1;
          flowTarget.current = Math.max(0, Math.min(carrosseis.length - 1, flowTarget.current + step));
          flowWheelAccum.current = 0;
        }
      };

      // Pointer drag handlers for Cover Flow
      const handleFlowPointerDown = (e) => {
        if (viewingCarousel || selectedProject) return;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {}
        flowIsDragging.current = true;
        flowDragStartX.current = e.clientX;
        flowDragStartPos.current = flowPos.current;
        flowLastDragX.current = e.clientX;
        flowLastDragTime.current = performance.now();
        flowVelocity.current = 0;
        flowHasDragged.current = false;
      };

      const handleFlowPointerMove = (e) => {
        if (!flowIsDragging.current) return;
        const dx = e.clientX - flowDragStartX.current;
        if (Math.abs(dx) > 4) {
          flowHasDragged.current = true;
        }
        const now = performance.now();
        const dt = Math.max(1, now - flowLastDragTime.current);
        flowVelocity.current = (e.clientX - flowLastDragX.current) / dt;
        flowLastDragX.current = e.clientX;
        flowLastDragTime.current = now;

        // Sensibilidade natural e controlada: no mobile requer arrasto completo para passar um card
        const sensitivity = isFreeMobile() ? coverMetrics.w * 1.35 : coverMetrics.w * 0.8;
        const newPos = flowDragStartPos.current - dx / sensitivity;
        flowPos.current = Math.max(-0.4, Math.min(carrosseis.length - 0.6, newPos));
        flowTarget.current = flowPos.current;
      };

      const handleFlowPointerUp = () => {
        if (!flowIsDragging.current) return;
        flowIsDragging.current = false;
        if (flowHasDragged.current) {
          let target;
          if (isFreeMobile()) {
            // No celular: avança no máximo 1 card por arrasto, com resposta natural e sem disparar
            const startIndex = Math.round(flowDragStartPos.current);
            const delta = flowPos.current - startIndex;
            const flickThreshold = 0.4; // px/ms
            let step = 0;
            if (flowVelocity.current < -flickThreshold || delta > 0.25) {
              step = 1; // arrastou para a esquerda -> avança 1 card
            } else if (flowVelocity.current > flickThreshold || delta < -0.25) {
              step = -1; // arrastou para a direita -> volta 1 card
            }
            target = Math.max(0, Math.min(carrosseis.length - 1, startIndex + step));
          } else {
            target = Math.max(0, Math.min(carrosseis.length - 1, Math.round(flowPos.current - flowVelocity.current * 18)));
          }

          if (activeTab === 'home' && carrosseisTrackRef.current && !isFreeMobile()) {
            const track = carrosseisTrackRef.current;
            const rect = track.getBoundingClientRect();
            const trackTop = rect.top + window.scrollY;
            const stageH = window.innerHeight - HEADER_H;
            const travel = track.offsetHeight - stageH;
            const targetSy = trackTop - HEADER_H + (target / Math.max(1, carrosseis.length - 1)) * travel;
            window.scrollTo({ top: targetSy, behavior: 'smooth' });
          } else {
            flowTarget.current = target;
          }
        }
      };

      // Card click in Cover Flow
      const handleCardClick = (idx) => {
        if (flowHasDragged.current) return;
        const currentTarget = Math.round(flowTarget.current);
        if (idx === currentTarget) {
          setRibbonFitMode(defaultRibbonMode());
          setViewingCarousel(carrosseis[idx]);
        } else {
          if (activeTab === 'home' && carrosseisTrackRef.current && !isFreeMobile()) {
            const track = carrosseisTrackRef.current;
            const rect = track.getBoundingClientRect();
            const trackTop = rect.top + window.scrollY;
            const stageH = window.innerHeight - HEADER_H;
            const travel = track.offsetHeight - stageH;
            const targetSy = trackTop - HEADER_H + (idx / Math.max(1, carrosseis.length - 1)) * travel;
            window.scrollTo({ top: targetSy, behavior: 'smooth' });
          } else {
            flowTarget.current = idx;
          }
        }
      };

      const goToFlowIndex = (idx) => {
        const target = Math.max(0, Math.min(carrosseis.length - 1, idx));
        if (activeTab === 'home' && carrosseisTrackRef.current && !isFreeMobile()) {
          const track = carrosseisTrackRef.current;
          const rect = track.getBoundingClientRect();
          const trackTop = rect.top + window.scrollY;
          const stageH = window.innerHeight - HEADER_H;
          const travel = track.offsetHeight - stageH;
          const targetSy = trackTop - HEADER_H + (target / Math.max(1, carrosseis.length - 1)) * travel;
          window.scrollTo({ top: targetSy, behavior: 'smooth' });
        } else {
          flowTarget.current = target;
        }
      };

      // Ribbon scroll for United View
      const handleRibbonWheel = (e) => {
        if (!ribbonRef.current) return;
        e.preventDefault();
        ribbonRef.current.scrollLeft += (e.deltaY || e.deltaX) * 1.5;
      };

      // Global Keyboard listener for Carrosséis tab & Modal navigation
      useEffect(() => {
        const handleKeyDown = (e) => {
          if (selectedProject) {
            if (e.key === 'Escape') setSelectedProject(null);
            else if (e.key === 'ArrowLeft') { e.preventDefault(); lightboxNav(-1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); lightboxNav(1); }
            return;
          }

          if (viewingCarousel) {
            if (e.key === 'Escape') setViewingCarousel(null);
            return;
          }

          const t = e.target;
          if (t && t.closest && t.closest('a,button,input,textarea,select,[role="button"]')) return;
          if (activeTab === 'home') {
            const trackEl = document.getElementById('carrosseis-track');
            const r = trackEl && trackEl.getBoundingClientRect();
            const mid = window.innerHeight / 2;
            if (!r || r.top > mid || r.bottom < mid) return;
          }
          if (activeTab === 'carrosseis' || activeTab === 'home') {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              flowTarget.current = Math.max(0, flowTarget.current - 1);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              flowTarget.current = Math.min(carrosseis.length - 1, flowTarget.current + 1);
            } else if (e.key === 'Enter') {
              e.preventDefault();
              const curr = carrosseis[Math.round(flowTarget.current)];
              if (curr) {
                setRibbonFitMode(defaultRibbonMode());
                setViewingCarousel(curr);
              }
            }
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [activeTab, viewingCarousel, selectedProject, carrosseis]);

      // =========================================================================
      // HORIZONTAL SCROLL FOR IDENTIDADE VISUAL ("UMA AO LADO DA OUTRA, SCROLL HORIZONTAL")
      // =========================================================================
      const idVisualContainerRef = useRef(null);
      const [isDraggingID, setIsDraggingID] = useState(false);
      const dragStartXID = useRef(0);
      const scrollStartXID = useRef(0);

      const handleIdVisualWheel = (e) => {
        if (!idVisualContainerRef.current || selectedProject) return;
        e.preventDefault();
        idVisualContainerRef.current.scrollLeft += (e.deltaY || e.deltaX) * 1.6;
      };

      const handleMouseDownID = (e) => {
        if (!idVisualContainerRef.current) return;
        setIsDraggingID(true);
        dragStartXID.current = e.pageX - idVisualContainerRef.current.offsetLeft;
        scrollStartXID.current = idVisualContainerRef.current.scrollLeft;
      };

      const handleMouseMoveID = (e) => {
        if (!isDraggingID || !idVisualContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - idVisualContainerRef.current.offsetLeft;
        const walk = (x - dragStartXID.current) * 1.5;
        idVisualContainerRef.current.scrollLeft = scrollStartXID.current - walk;
      };

      const handleMouseUpID = () => {
        setIsDraggingID(false);
      };

      // =========================================================================
      // VERTICAL 3D CYLINDER FOR ESTÁTICOS (3 FILEIRAS 3D COM FORMATOS 4:5 & 9:16)
      // =========================================================================
      const [staticMetrics, setStaticMetrics] = useState({
        cardW: 245,
        colSpacing: 280,
        numCols: 3,
        stepY: 410,
      });

      // Split estáticos into 3 fileiras (columns)
      const staticColumns = useMemo(() => {
        const cols = [[], [], []];
        estaticos.forEach((item, idx) => {
          cols[idx % 3].push({ ...item, origIdx: idx });
        });
        return cols;
      }, [estaticos]);

      const staticCardsRefs = useRef([[], [], []]);
      const staticFrameId = useRef(0);
      const staticProgress = useRef(0);
      const staticTargetProgress = useRef(0);
      const staticIsDragging = useRef(false);
      const staticDragStartY = useRef(0);
      const staticDragStartProgress = useRef(0);
      const staticDragDist = useRef(0);
      const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

      // Resize listener for Estáticos 3 Fileiras
      useEffect(() => {
        const handleResize = () => {
          const w = window.innerWidth;
          const h = window.innerHeight;

          let cardW = 245;
          let colSpacing = 280;

          if (w < 480) {
            // Mobile P: 3 colunas compactas
            cardW = Math.round((w - 28) / 3.15);
            colSpacing = cardW + 8;
          } else if (w < 768) {
            // Mobile M/G: 3 colunas proporcionais
            cardW = Math.round((w - 44) / 3.25);
            colSpacing = cardW + 16;
          } else if (w < 1200) {
            // Tablet / Laptop
            cardW = Math.round(Math.min(220, (w - 72) / 3.4));
            colSpacing = cardW + 28;
          } else {
            // Desktop / Wide Screen
            const heightFactor = Math.min(1.0, Math.max(0.78, h / 880));
            cardW = Math.round(Math.min(265, Math.max(225, w * 0.165)) * heightFactor);
            colSpacing = cardW + 36;
          }

          // Distância vertical entre centros ao longo do cilindro 3D
          const stepY = Math.round(cardW * 1.52 + 20);

          setStaticMetrics({ cardW, colSpacing, numCols: 3, stepY });
        };

        handleResize();
        const handleResizeOnWidth = onWidthResize(handleResize);
        window.addEventListener('resize', handleResizeOnWidth);
        return () => window.removeEventListener('resize', handleResizeOnWidth);
      }, []);

      // Mouse Parallax listener
      useEffect(() => {
        const handleMouseMove = (e) => {
          const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
          const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
          mouse.current.targetX = Math.max(-1, Math.min(1, rx));
          mouse.current.targetY = Math.max(-1, Math.min(1, ry));

          if (staticIsDragging.current) {
            const diffY = e.clientY - staticDragStartY.current;
            staticDragDist.current += Math.abs(diffY);
            const sensitivity = staticMetrics.stepY * 0.9;
            staticTargetProgress.current = staticDragStartProgress.current - (diffY / sensitivity);
          }
        };

        const handleMouseUp = () => {
          staticIsDragging.current = false;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseup', handleMouseUp, { passive: true });
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }, [staticMetrics]);

      // Estáticos na Home: seção fixa (sticky) e a rolagem da página gira o cilindro
      const STATIC_STEP_PX = 150;
      const staticTrackTravel = isFreeMobile() ? 0 : Math.ceil(estaticos.length / 3) * STATIC_STEP_PX;
      const staticAutoLastT = useRef(0);
      const staticScrollProg = useRef(0);
      useEffect(() => {
        if (activeTab !== 'home') return;
        const onScroll = () => {
          const track = document.getElementById('estaticos-track');
          if (!track) return;
          const offset = Math.min(Math.max(-track.getBoundingClientRect().top, 0), staticTrackTravel);
          const prog = offset / STATIC_STEP_PX;
          staticTargetProgress.current += prog - staticScrollProg.current;
          staticScrollProg.current = prog;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
      }, [activeTab, staticTrackTravel]);

      // Vertical Wheel Listener for Estáticos
      const handleStaticWheel = (e) => {
        if (selectedProject) return;

        // If on Home and scrolling UP near top of Estáticos, return up to Carrosséis!
        if (activeTab === 'home' && staticTargetProgress.current <= 0.08 && e.deltaY < -15) {
          const track = document.getElementById('carrosseis-track');
          if (track) {
            const rect = track.getBoundingClientRect();
            const trackTop = rect.top + window.scrollY;
            const stageH = window.innerHeight - HEADER_H;
            const travel = track.offsetHeight - stageH;
            window.scrollTo({ top: trackTop - HEADER_H + travel, behavior: 'smooth' });
            return;
          }
        }

        e.preventDefault();
        const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * 0.0024;
        staticTargetProgress.current += delta;
      };

      useEffect(() => {
        if (activeTab !== 'estaticos') return;

        window.addEventListener('wheel', handleStaticWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleStaticWheel);
      }, [activeTab, selectedProject]);

      // 60FPS Render loop for Estáticos (3 Fileiras 3D em cascata orgânica)
      const renderStaticLoop = () => {
        if (activeTab !== 'estaticos' && activeTab !== 'home') return;
        if (isFreeMobile()) return; // no mobile as colunas andam por CSS

        mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
        mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

        // Suave deslocamento ocioso (idle drift)
        if (!staticIsDragging.current) {
          if (isFreeMobile()) {
            // Mobile: os criativos passam sozinhos numa velocidade de leitura (~1 peça a cada 3 s por coluna)
            const now = performance.now();
            const dt = Math.min(0.05, (now - (staticAutoLastT.current || now)) / 1000);
            staticAutoLastT.current = now;
            staticTargetProgress.current += dt * 0.35;
          } else {
            staticTargetProgress.current += 0.0006;
          }
        }

        staticProgress.current += (staticTargetProgress.current - staticProgress.current) * 0.12;

        const continuousProgress = staticProgress.current;
        const { numCols, stepY } = staticMetrics;

        // Defasagem de fase entre as 3 fileiras para efeito de cascata visual
        const freeMobile = isFreeMobile();
        const colPhases = numCols === 3 ? [0.38, 0, 0.76] : [0];
        const colRotY = numCols === 3 ? [4.5, 0, -4.5] : [0]; // Leve curvatura côncava voltada ao usuário

        for (let c = 0; c < numCols; c++) {
          const colItems = staticColumns[c];
          if (!colItems) continue;
          const count = colItems.length;
          if (count === 0) continue;

          const colProg = continuousProgress + (colPhases[c] || 0);

          for (let k = 0; k < count; k++) {
            const card = staticCardsRefs.current[c] && staticCardsRefs.current[c][k];
            if (!card) continue;

            let offset = k - colProg;
            const halfCount = count / 2;
            while (offset > halfCount) offset -= count;
            while (offset < -halfCount) offset += count;

            const absOffset = Math.abs(offset);
            const sign = Math.sign(offset);

            if (absOffset > 2.5) {
              if (!freeMobile || card._vis !== 0) { card._vis = 0; card.style.visibility = 'hidden'; }
              continue;
            } else if (!freeMobile || card._vis !== 1) {
              card._vis = 1;
              card.style.visibility = 'visible';
            }

            const targetY = stepY;
            let y = 0;
            let z = 0;
            let rotX = 0;

            if (absOffset <= 1) {
              const t = absOffset;
              const easedT = t * t * (3 - 2 * t);
              y = -sign * (easedT * targetY);
              z = 240 + easedT * (70 - 240);
              rotX = -sign * (easedT * 24);
            } else if (absOffset <= 2) {
              const t = absOffset - 1;
              const easedT = t * t * (3 - 2 * t);
              y = -sign * (targetY + easedT * targetY);
              z = 70 + easedT * (-130 - 70);
              rotX = -sign * (24 + easedT * 28);
            } else {
              const t = Math.min(absOffset - 2, 1);
              const easedT = t * t * (3 - 2 * t);
              y = -sign * (targetY * 2 + easedT * targetY);
              z = -130 + easedT * (-260 - -130);
              rotX = -sign * (52 + easedT * 30);
            }

            const centerFactor = Math.max(0, 1 - absOffset * 0.7);
            const activeTiltX = -mouse.current.y * 7 * centerFactor;
            const activeTiltY = mouse.current.x * 9 * centerFactor;

            const totalRotX = rotX + activeTiltX;
            const totalRotY = activeTiltY + (colRotY[c] || 0);
            const opacity = Math.max(0.18, 1 - absOffset * 0.35);

            if (freeMobile) {
              // Mobile: só escreve o que mudou (trocar z-index/opacidade todo quadro força o navegador a reorganizar as camadas)
              const zi = Math.round(z / 20) * 20 + 500;
              if (card._zi !== zi) { card._zi = zi; card.style.zIndex = String(zi); }
              const op = Math.round(opacity * 20) / 20;
              if (card._op !== op) { card._op = op; card.style.opacity = String(op); }
              card.style.transform = `translate3d(0, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${(colRotY[c] || 0)}deg)`;
            } else {
              card.style.zIndex = Math.round(z + 500).toString();
              card.style.opacity = opacity.toString();
              card.style.transform = `translateY(${y.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateX(${totalRotX.toFixed(1)}deg) rotateY(${totalRotY.toFixed(1)}deg)`;
            }
          }
        }
      };

      useEffect(() => {
        if (activeTab !== 'estaticos' && activeTab !== 'home') return;

        // Occlusion culling: pausa cálculos trigonométricos de 36 cards quando Estáticos estiver fora da tela
        const tick = () => {
          let inView = true;
          if (activeTab === 'home') {
            const track = document.getElementById('estaticos-track');
            if (track) {
              const r = track.getBoundingClientRect();
              inView = r.bottom > -150 && r.top < window.innerHeight + 150;
            }
          }
          if (inView) {
            renderStaticLoop();
          }
          staticFrameId.current = requestAnimationFrame(tick);
        };

        staticFrameId.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(staticFrameId.current);
      }, [activeTab, staticMetrics, estaticos]);

      const thicknessLayers = [-1, 0, 1];

      // Reset slide on modal open (ou abre no slide clicado)
      const slideOverride = useRef(null);
      useEffect(() => {
        setCurrentSlideIndex(slideOverride.current ?? 0);
        slideOverride.current = null;
      }, [selectedProject]);

      // Lightbox: navegação entre artes (slides do carrossel ou peças dos Estáticos)
      const lightboxNav = (dir) => {
        if (!selectedProject || selectedProject.category === 'Identidade Visual') return;
        if (selectedProject.category === 'Carrosséis') {
          const n = selectedProject.slides.length;
          setCurrentSlideIndex(i => (i + dir + n) % n);
          return;
        }
        const list = estaticos;
        const idx = list.findIndex(p => p.id === selectedProject.id);
        if (idx < 0) return;
        setSelectedProject(list[(idx + dir + list.length) % list.length]);
      };
      const lightboxTouch = useRef(null);

      // Foco dos modais: leva o foco para dentro ao abrir e devolve ao elemento de origem ao fechar
      const lastFocusRef = useRef(null);
      const modalOpen = !!selectedProject;
      useEffect(() => {
        if (modalOpen) {
          const hoverLabel = document.getElementById('vante-name');
          if (hoverLabel) hoverLabel.style.opacity = '0';
          lastFocusRef.current = document.activeElement;
          requestAnimationFrame(() => {
            const dlg = document.querySelector('[role="dialog"]');
            const target = dlg && dlg.querySelector('[data-autofocus]');
            if (target) target.focus();
          });
          const trap = (e) => {
            if (e.key !== 'Tab') return;
            const dlg = document.querySelector('[role="dialog"]');
            if (!dlg) return;
            const f = [...dlg.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(el => el.offsetParent !== null);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
          };
          document.addEventListener('keydown', trap);
          return () => document.removeEventListener('keydown', trap);
        } else if (lastFocusRef.current && document.contains(lastFocusRef.current)) {
          lastFocusRef.current.focus({ preventScroll: true });
          lastFocusRef.current = null;
        }
      }, [modalOpen]);

      // Navegação flutuante: aparece depois que o visitante começa a rolar
      const [showFloatingNav, setShowFloatingNav] = useState(false);
      useEffect(() => {
        const onScroll = () => setShowFloatingNav(window.scrollY > window.innerHeight * 0.35);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
      }, []);

      const scrollToSection = (key) => {
        if (key === 'identidade') {
          window.scrollTo({ top: ANIM_SCROLL, behavior: 'smooth' });
          return;
        }
        const id = key === 'carrosseis' ? 'carrosseis-track' : key === 'estaticos' ? 'estaticos-track' : key === 'sobre' ? 'sobre-mim-section' : 'contato-section';
        const el = document.getElementById(id);
        if (!el) return;
        const targetY = el.getBoundingClientRect().top + window.scrollY - HEADER_H;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      };

      // WhatsApp Quote Link Generator
      const getWhatsAppLink = (projectTitle = '') => {
        if (!projectTitle) return whatsappHref();
        return whatsappHref(`Olá Marcos! Gostei do projeto "${projectTitle}" do seu portfólio e quero conversar sobre um trabalho parecido.`);
      };

      // Helper to render the Sobre Mim section (acima dos carrosséis)
      const renderSobreMimBlock = () => (
        <section
          id="sobre-mim-section"
          className="relative w-full border-t border-white/[0.08] bg-[#08080a] bg-grain py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden flex items-center justify-center select-none"
        >

          <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* COLUNA DA ESQUERDA: TEXTO EDITORIAL (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              <div className="mb-2 pointer-events-none" aria-hidden="true">
                <span style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-xs tracking-widest uppercase doodle-ink">
                  ARTE &amp; ALMA
                </span>
              </div>

              {/* Título com Stretch Pro e Sublinhado de Risco */}
              <div className="relative inline-block mb-6">
                <h2 className="font-stretch text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] text-white leading-[1.04] tracking-normal uppercase">
                  QUEM É O{' '}<br />
                  <span>MAAAGO?</span>
                </h2>
                {/* Risco de Caneta / Sublinhado Esboçado */}
                <svg className="w-48 sm:w-64 h-4 doodle-ink mt-1 pointer-events-none" viewBox="0 0 200 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                  <path d="M 5,8 Q 50,14 100,7 Q 150,2 195,9" />
                  <path d="M 25,12 Q 80,15 140,11 Q 170,8 185,12" strokeWidth="1.5" opacity="0.6" />
                </svg>
              </div>

              {/* Bloco de Texto Biográfico */}
              <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light max-w-xl">
                <p className="text-zinc-200 font-normal">
                  A arte sempre esteve presente na minha vida, de várias formas. Eu não sabia o que ou quem eu seria, mas uma coisa era certa: <strong className="text-white font-semibold">teria arte!</strong>
                </p>

                <p className="text-zinc-400">
                  Meu nome é <strong className="text-white font-medium">Marcos Gabriel</strong>, tenho 27 anos, sou designer gráfico, fotógrafo e enxergo a criação como uma das partes mais legais da minha vida. Adoro criar, ver tudo tomar forma, refazer e aprender com a minha própria obra.
                </p>

                {/* Destaque / Manifesto */}
                <div className="border-l-[3px] border-[#FF7500] pl-4 py-1.5 my-5">
                  <p className="text-emerald-400 font-medium italic text-base sm:text-lg leading-snug">
                    "Não dá para separar o Marcos do Mago, e isso é genial."
                  </p>
                </div>

                <p className="text-zinc-400">
                  O melhor jeito de me conhecer é pelo que eu crio. As peças estão logo abaixo.
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center gap-3 mt-8 pt-2">
                <a
                  href={whatsappHref('Olá Marcos! Vi a seção Sobre no seu portfólio e quero conversar sobre um projeto.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-[#f4f4f5] hover:bg-white text-zinc-950 text-xs sm:text-sm font-bold tracking-wide transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Conversar no WhatsApp</span>
                  <span aria-hidden="true">↗</span>
                </a>

                <a
                  href="#carrosseis-section"
                  onClick={(e) => {
                    e.preventDefault();
                    const track = document.getElementById('carrosseis-track');
                    if (track) {
                      const rect = track.getBoundingClientRect();
                      const targetY = rect.top + window.scrollY - HEADER_H;
                      window.scrollTo({ top: targetY, behavior: 'smooth' });
                    } else {
                      const el = document.getElementById('carrosseis-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Ver os projetos</span>
                  <span aria-hidden="true">↓</span>
                </a>

                {/* Doodle Arrow de Risco à mão livre */}
                <div className="hidden sm:flex items-center gap-1.5 pointer-events-none doodle-ink -ml-1" aria-hidden="true">
                  <svg className="w-8 h-8 -rotate-12" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8,12 C18,8 36,16 32,38" />
                    <polyline points="24,34 32,38 36,30" />
                  </svg>
                  <span style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-xs text-zinc-300 tracking-wider">comece!</span>
                </div>
              </div>

            </div>

            {/* COLUNA DA DIREITA: RETRATO EMOLDURADO COM RISCOS E DESENHOS (5 cols) */}
            <div className="lg:col-span-5 flex justify-center items-center relative py-6">
              
              {/* Outer relative wrapper allowing sketch doodles to overflow with pointer-events-none */}
              <div className="relative w-full max-w-[400px]">
                
                {/* 1. RAIO 3D EM RISCO/OUTLINE (Topo Esquerdo) */}
                <div aria-hidden="true" className="absolute -top-12 -left-10 z-20 pointer-events-none -rotate-12 doodle">
                  <svg width="90" height="110" viewBox="0 0 90 110" fill="none" stroke="#ff7500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M48,8 L20,52 L42,52 L26,98 L76,46 L48,46 Z" />
                    <path d="M48,8 L58,4 L82,40 L76,46" strokeWidth="2.5" />
                    <path d="M82,40 L56,40 L50,47" strokeWidth="2" strokeDasharray="1 1" />
                    <path d="M58,4 L34,46 L42,52" strokeWidth="2" />
                    <line x1="12" y1="20" x2="6" y2="14" stroke="#ffffff" strokeWidth="2.5" />
                    <line x1="18" y1="12" x2="16" y2="4" stroke="#ffffff" strokeWidth="2.5" />
                    <line x1="8" y1="45" x2="2" y2="46" stroke="#ff7500" strokeWidth="2" />
                  </svg>
                </div>

                {/* 2. BALÃO COMIC RISCADO À MÃO "CRIE SEU CAMINHO" (Topo Direito) */}
                <div aria-hidden="true" className="absolute -top-10 -right-8 z-20 pointer-events-none rotate-6 doodle">
                  <svg width="140" height="95" viewBox="0 0 140 95" fill="none">
                    <path d="M22,35 C18,16 38,10 70,10 C105,10 125,18 125,38 C125,58 102,68 75,68 L55,69 L42,86 L44,68 C28,67 20,55 22,35 Z" fill="rgba(8,8,10,0.85)" />
                    <path d="M22,35 C18,16 38,10 70,10 C105,10 125,18 125,38 C125,58 102,68 75,68 L55,69 L42,86 L44,68 C28,67 20,55 22,35 Z" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M26,36 C23,20 40,14 70,14 C100,14 121,21 121,38" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
                    <text x="73" y="36" fontFamily="'Permanent Marker', cursive" fontSize="13" fill="#ffffff" textAnchor="middle" letterSpacing="1">CRIE SEU</text>
                    <text x="73" y="52" fontFamily="'Permanent Marker', cursive" fontSize="13" fill="#ffffff" textAnchor="middle" letterSpacing="1">CAMINHO</text>
                    <line x1="126" y1="20" x2="134" y2="15" stroke="#ff7500" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="130" y1="28" x2="137" y2="28" stroke="#ff7500" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* 3. NUVEM RABISCO / GIZ "OUSADO!" EM LARANJA (Lateral Direita) */}
                <div aria-hidden="true" className="absolute top-[40%] -right-10 z-20 pointer-events-none rotate-[-6deg] doodle">
                  <svg width="125" height="75" viewBox="0 0 125 75" fill="none">
                    <path d="M22,35 C14,32 14,20 25,18 C28,10 40,10 48,15 C58,8 72,10 78,18 C88,14 98,20 96,30 C106,35 104,48 95,54 C92,62 80,62 72,58 C64,65 48,64 42,57 C32,62 20,58 20,48 C12,45 14,38 22,35 Z" fill="rgba(8,8,10,0.85)" />
                    <path d="M22,35 C14,32 14,20 25,18 C28,10 40,10 48,15 C58,8 72,10 78,18 C88,14 98,20 96,30 C106,35 104,48 95,54 C92,62 80,62 72,58 C64,65 48,64 42,57 C32,62 20,58 20,48 C12,45 14,38 22,35 Z" stroke="#ff7500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="58" y="42" fontFamily="'Permanent Marker', cursive" fontSize="14" fill="#ff7500" textAnchor="middle" letterSpacing="1">OUSADO!</text>
                    <path d="M38,48 Q58,54 78,48" stroke="#ff7500" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* 4. ESPIRAL / MOLA DE RISCO (Abaixo da Nuvem OUSADO!) */}
                <div aria-hidden="true" className="absolute top-[62%] -right-8 z-20 pointer-events-none doodle">
                  <svg width="45" height="55" viewBox="0 0 45 55" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round">
                    <path d="M12,10 C32,6 36,22 18,24 C36,22 38,36 16,38 C34,38 34,50 14,48" />
                  </svg>
                </div>

                {/* 5. ESTRELINHAS FEITAS DE RISCOS DE CANETA (*) */}
                {/* Asterisco de risco dourado (Topo central) */}
                <div aria-hidden="true" className="absolute -top-3 left-[48%] z-20 pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 30 30" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round">
                    <line x1="15" y1="4" x2="15" y2="26" />
                    <line x1="4" y1="15" x2="26" y2="15" />
                    <line x1="7" y1="7" x2="23" y2="23" />
                    <line x1="7" y1="23" x2="23" y2="7" />
                  </svg>
                </div>

                {/* Asterisco de risco laranja (Lateral direita) */}
                <div aria-hidden="true" className="absolute top-[56%] -right-3 z-20 pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 30 30" fill="none" stroke="#ff7500" strokeWidth="3" strokeLinecap="round">
                    <line x1="15" y1="5" x2="15" y2="25" />
                    <line x1="5" y1="15" x2="25" y2="15" />
                    <line x1="8" y1="8" x2="22" y2="22" />
                    <line x1="8" y1="22" x2="22" y2="8" />
                  </svg>
                </div>

                {/* 6. SETA DE RISCO 3D APONTANDO PARA CIMA (Base Esquerda) */}
                <div aria-hidden="true" className="absolute -bottom-8 -left-8 z-20 pointer-events-none -rotate-12 doodle">
                  <svg width="65" height="85" viewBox="0 0 65 85" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M30,10 L54,38 L42,38 L42,72 L18,72 L18,38 L6,38 Z" fill="rgba(8,8,10,0.85)" />
                    <path d="M30,10 L54,38 L42,38 L42,72 L18,72 L18,38 L6,38 Z" />
                    <path d="M30,16 L46,36 L36,36 L36,66" stroke="#ff7500" strokeWidth="2.5" />
                    <line x1="15" y1="78" x2="10" y2="83" stroke="#ff7500" strokeWidth="2.5" />
                    <line x1="30" y1="78" x2="30" y2="85" stroke="#ff7500" strokeWidth="2.5" />
                    <line x1="45" y1="78" x2="50" y2="83" stroke="#ff7500" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* 7. SETA ESPIRAL / CURVA EM RISCO LARANJA (Lateral Esquerda) */}
                <div aria-hidden="true" className="absolute top-[48%] -left-10 z-20 pointer-events-none rotate-[15deg] doodle">
                  <svg width="65" height="65" viewBox="0 0 65 65" fill="none" stroke="#ff7500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M48,18 C28,12 16,24 22,40 C26,48 44,48 46,34 C48,22 32,20 24,28" />
                    <polyline points="18,24 24,28 28,20" />
                  </svg>
                </div>

                {/* 8. ZIGUE-ZAGUE DE RISCO / MINI RAIO (Lateral Esquerda, Acima da Seta) */}
                <div aria-hidden="true" className="absolute top-[32%] -left-7 z-20 pointer-events-none doodle">
                  <svg width="30" height="50" viewBox="0 0 30 50" fill="none" stroke="#ff7500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18,6 8,22 22,24 10,44" />
                    <circle cx="22" cy="10" r="1.5" fill="#ff7500" />
                  </svg>
                </div>

                {/* 9. FAÍSCAS DE CANETA / HACHURAS RADIANTES (Base Direita) */}
                <div aria-hidden="true" className="absolute bottom-6 -right-6 z-20 pointer-events-none rotate-12 doodle">
                  <svg width="45" height="45" viewBox="0 0 45 45" fill="none" stroke="#ff7500" strokeWidth="3" strokeLinecap="round">
                    <line x1="22" y1="8" x2="22" y2="18" />
                    <line x1="10" y1="14" x2="18" y2="20" />
                    <line x1="34" y1="14" x2="26" y2="20" />
                  </svg>
                </div>

                {/* 10. TEXTO DE RISCO "RITMO!" COM SETA DE RAIO (Canto Inferior Direito) */}
                <div aria-hidden="true" className="absolute -bottom-10 -right-8 z-20 pointer-events-none rotate-[14deg] doodle">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1.5 mb-0.5">
                      <span className="w-1 h-2 bg-[#ff7500] rounded-full rotate-[-25deg] inline-block"></span>
                      <span className="w-1 h-2.5 bg-[#ff7500] rounded-full inline-block"></span>
                      <span className="w-1 h-2 bg-[#ff7500] rounded-full rotate-[25deg] inline-block"></span>
                    </div>
                    <span style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-base sm:text-lg text-[#ff7500] tracking-wider leading-none">RITMO!</span>
                    <svg width="35" height="40" viewBox="0 0 35 40" fill="none" stroke="#ff7500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-1">
                      <path d="M22,4 L10,18 L18,18 L8,36 L28,16 L18,16 Z" />
                    </svg>
                  </div>
                </div>

                {/* Card do Retrato */}
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/[0.12] shadow-2xl bg-[#0c0c10] group z-10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none" />
                  <img
                    src="assets/Marcos_.webp"
                    alt="Retrato de Marcos Gabriel, o Mago"
                    width="1000"
                    height="1000"
                    className="w-full h-full object-cover object-center select-none pointer-events-none scale-100 group-hover:scale-[1.03] transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

              </div>
            </div>

          </div>
        </section>
      );

      
      // Fechamento da página: contato (mesmo padrão de título das outras seções)
      const renderContatoBlock = () => (
        <section
          id="contato-section"
          className="relative w-full border-t border-white/[0.08] bg-[#08080a] bg-grain py-24 sm:py-32 px-6 flex flex-col items-center text-center"
        >
          <div className="relative inline-block">
            <div aria-hidden="true" className="absolute -left-12 sm:-left-16 -top-4 pointer-events-none -rotate-12 doodle">
              <svg width="45" height="55" viewBox="0 0 90 110" fill="none" stroke="#ff7500" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M48,8 L20,52 L42,52 L26,98 L76,46 L48,46 Z" />
                <path d="M48,8 L58,4 L82,40 L76,46" strokeWidth="3" />
                <line x1="12" y1="20" x2="6" y2="14" stroke="#ffffff" strokeWidth="3" />
              </svg>
            </div>
            <h2 className="font-stretch text-2xl sm:text-3xl lg:text-4xl xl:text-[44px] text-white leading-[1.08] tracking-normal uppercase">
              BORA CRIAR{' '}<br />
              <span>JUNTOS?</span>
            </h2>
            <svg className="w-40 sm:w-56 h-3 doodle-ink mx-auto mt-1 pointer-events-none" viewBox="0 0 180 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <path d="M 5,6 Q 45,10 90,5 Q 135,1 175,7" />
            </svg>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed mt-5 font-light">
            Direção de arte, social media, identidade visual e fotografia. Me conta o projeto e eu respondo pelo WhatsApp.
          </p>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-7 py-4 rounded-full bg-[#f4f4f5] hover:bg-white text-zinc-950 text-sm font-bold tracking-wide transition-colors flex items-center gap-2.5 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={WA_ICON_PATH} /></svg>
            <span>Conversar no WhatsApp</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            href={PHOTO_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span className="whitespace-nowrap">Ver meu trabalho de fotografia</span>
            <span className="hidden sm:inline text-zinc-400">· Clique &amp; Poesia</span>
            <span aria-hidden="true">↗</span>
          </a>
          <p className="mt-16 text-[11px] text-zinc-400 tracking-widest uppercase">
            Marcos Gabriel • Designer gráfico e fotógrafo • {new Date().getFullYear()}
          </p>
        </section>
      );

      // Helper to render the Carrosséis 3D Cover Flow & Panoramic Viewer
      const renderCarrosseisBlock = (isEmbedded = false) => {
        const content = (
          <div
            id={isEmbedded ? "carrosseis-section" : undefined}
            ref={isEmbedded ? carrosseisSectionRef : undefined}
            className={`w-full ${HEADER_H > 0 ? 'h-[calc(100vh-68px)]' : 'h-[100svh]'} min-h-[580px] bg-[#08080a] flex flex-col select-none overflow-hidden ${
              isEmbedded ? 'border-t border-white/[0.08]' : 'flex-1'
            } animate-fadeIn`}
            style={isEmbedded ? {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              width: '100%',
              zIndex: 20
            } : undefined}
          >
          <div className="relative flex-1 flex flex-col overflow-hidden select-none">
              
              {/* MODE A: 3D COVER FLOW VIEW */}
              {!viewingCarousel && (
                <div className="relative flex-1 flex flex-col justify-between overflow-hidden pt-6 sm:pt-16 pb-1">
                  
                  {/* Ambient Dynamic Glow Tinted by Center Album Colors */}
                  <div id="glow" />

                  {/* CENTERED EDITORIAL HEADER (COMO NA REFERÊNCIA) COM DOODLES */}
                  <div className="relative z-25 flex flex-col items-center justify-center text-center px-4 pt-3 sm:pt-6 pb-1 max-w-3xl mx-auto select-none pointer-events-none">
                    
                    <div className="relative inline-block">
                      {/* Mini Raio 3D em Risco de Caneta (Esquerda) */}
                      <div aria-hidden="true" className="absolute -left-12 sm:-left-16 -top-3 sm:-top-4 pointer-events-none -rotate-12 doodle">
                        <svg width="45" height="55" viewBox="0 0 90 110" fill="none" stroke="#ff7500" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M48,8 L20,52 L42,52 L26,98 L76,46 L48,46 Z" />
                          <path d="M48,8 L58,4 L82,40 L76,46" strokeWidth="3" />
                          <line x1="12" y1="20" x2="6" y2="14" stroke="#ffffff" strokeWidth="3" />
                        </svg>
                      </div>

                      <h2 className="font-stretch text-2xl sm:text-3xl lg:text-4xl xl:text-[44px] text-white leading-[1.08] tracking-normal uppercase text-center">
                        GALERIA DE{' '}<br />
                        <span>CRIAAAÇÃO</span>
                      </h2>

                      {/* Balão Riscado à Mão "FLUXO ⚡" (Direita) */}
                      <div aria-hidden="true" className="absolute -right-16 sm:-right-28 -top-7 sm:-top-8 pointer-events-none rotate-6 doodle">
                        <svg width="85" height="50" viewBox="0 0 110 65" fill="none">
                          <path d="M15,25 C12,12 25,8 55,8 C85,8 98,14 98,28 C98,42 80,48 58,48 L42,49 L30,60 L33,48 C20,47 14,38 15,25 Z" fill="rgba(8,8,10,0.85)" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <text x="55" y="34" fontFamily="'Permanent Marker', cursive" fontSize="14" fill="#ffffff" textAnchor="middle" letterSpacing="1">FLUXO!</text>
                        </svg>
                      </div>

                      {/* Risco de Caneta / Sublinhado Esboçado Embaixo do Título */}
                      <svg className="w-40 sm:w-56 h-3 doodle-ink mx-auto mt-0.5 pointer-events-none" viewBox="0 0 180 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                        <path d="M 5,6 Q 45,10 90,5 Q 135,1 175,7" />
                      </svg>
                    </div>

                    <p className="text-xs sm:text-sm lg:text-[15px] text-zinc-400 max-w-[480px] leading-relaxed mt-2 sm:mt-2.5 font-light text-center mx-auto">
                      Carrosséis para Instagram, do gancho ao último slide. {carrosseis.length} projetos.
                    </p>
                  </div>

                  {/* Lembrete Mobile: visível apenas abaixo de lg com respiro generoso */}
                  <p
                    ref={el => flowHintRefs.current[1] = el}
                    aria-hidden="true"
                    style={{ fontFamily: "'Permanent Marker', cursive" }}
                    className="block lg:hidden relative z-30 text-center text-white text-sm sm:text-base tracking-wide pointer-events-none select-none mt-5 sm:mt-6 mb-7 sm:mb-9 px-4 doodle"
                  >
                    Psiu! Isso é só a capa… <span className="doodle-ink">{isFreeMobile() || IS_TOUCH ? 'toca' : 'clica'}</span> pra ver o resto! <span className="doodle-ink">↓</span>
                  </p>

                  {/* 3D Cover Flow Viewport */}
                  <div 
                    ref={flowViewportRef}
                    onWheel={handleFlowWheel}
                    onPointerDown={handleFlowPointerDown}
                    onPointerMove={handleFlowPointerMove}
                    onPointerUp={handleFlowPointerUp}
                    onPointerCancel={handleFlowPointerUp}
                    className="coverflow-viewport flex-1 flex items-center justify-center relative min-h-[360px]"
                    style={{
                      perspective: `${coverMetrics.w * 3.4}px`,
                      perspectiveOrigin: '50% 45%',
                    }}
                  >
                    {/* Lembrete Desktop: visível apenas em telas amplas (lg+) à esquerda das capas */}
                    <div
                      ref={el => flowHintRefs.current[0] = el}
                      data-centered="1"
                      aria-hidden="true"
                      className="hidden lg:flex absolute top-1/2 z-30 pointer-events-none select-none items-start gap-2"
                      style={{ right: `calc(50% + ${coverMetrics.w / 2 + 36}px)`, width: 280, transform: 'translate(0, -50%)', willChange: 'transform, opacity' }}
                    >
                      <p
                        style={{ fontFamily: "'Permanent Marker', cursive" }}
                        className="text-white text-xl xl:text-2xl leading-snug tracking-wide -rotate-3 doodle"
                      >
                        Psiu! Isso é só a capa… <span className="doodle-ink">{IS_TOUCH ? 'toca' : 'clica'}</span> pra ver o resto!
                      </p>
                      <svg className="doodle-ink doodle flex-shrink-0 mt-8" width="64" height="52" viewBox="0 0 64 52" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4,8 C24,4 48,14 56,40" />
                        <polyline points="46,36 56,42 60,30" />
                      </svg>
                    </div>
                    {carrosseis.map((carousel, idx) => (
                      <div
                        key={carousel.id}
                        ref={el => flowCardsRefs.current[idx] = el}
                        onClick={() => handleCardClick(idx)}
                        {...pressable(() => handleCardClick(idx), `Abrir carrossel: ${carousel.title}`)}
                        className="cv-item"
                        style={{
                          width: `${coverMetrics.w}px`,
                          height: `${coverMetrics.h}px`,
                          marginLeft: `-${coverMetrics.w / 2}px`,
                          marginTop: `-${coverMetrics.h / 2}px`,
                        }}
                      >
                        {/* Front Face: Cover Image */}
                        <div className="cv-front">
                          <img
                            src={carousel.slides[0]}
                            alt={carousel.title}
                            className="w-full h-full object-cover block pointer-events-none select-none"
                            loading={Math.abs(idx - currentFlowIndex) < 4 ? 'eager' : 'lazy'}
                            decoding="async"
                            onError={(e) => {
                              if (e.target.src.includes('/images/')) {
                                e.target.src = e.target.src.replace('/images/', '/');
                              } else if (e.target.src.endsWith('.webp')) {
                                e.target.src = e.target.src.replace('.webp', '.png');
                              }
                            }}
                          />
                          

                          {/* Center Card Click-to-Open Hint Overlay */}
                          {idx === currentFlowIndex && (
                            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <span className="text-xs bg-black/90 text-white px-4 py-2 rounded-full border border-white/20 shadow-2xl backdrop-blur-md font-medium tracking-wide">
                                <span className="font-light text-white/70">VER</span> <span className="font-stretch font-bold text-emerald-400 tracking-wider">COMPLETO</span> ↗
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Floor Reflection: renderizado apenas para capas no campo de visão */}
                        {Math.abs(idx - currentFlowIndex) <= 4 && (
                          <div className="cv-reflection">
                            <img
                              src={carousel.slides[0]}
                              alt=""
                              className="w-full h-full object-cover block pointer-events-none select-none"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                if (e.target.src.includes('/images/')) {
                                  e.target.src = e.target.src.replace('/images/', '/');
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Active Carousel Title (Beneath the 3D Flow) */}
                  {carrosseis[currentFlowIndex] && (
                    <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 mb-3 sm:mb-4 animate-fadeIn">
                      <h3
                        onClick={() => {
                          setRibbonFitMode(defaultRibbonMode());
                          setViewingCarousel(carrosseis[currentFlowIndex]);
                        }}
                        {...pressable(() => { setRibbonFitMode(defaultRibbonMode()); setViewingCarousel(carrosseis[currentFlowIndex]); }, `Abrir carrossel: ${carrosseis[currentFlowIndex].title}`)}
                        className="text-base sm:text-xl font-black text-white tracking-tight cursor-pointer hover:text-emerald-400 transition-colors"
                        title="Abrir o carrossel completo"
                      >
                        {carrosseis[currentFlowIndex].title}
                      </h3>
                    </div>
                  )}

                  {/* Guidance & Controls Footer */}
                  <footer className="px-6 pt-3 pb-16 sm:py-3.5 border-t border-white/[0.08] bg-[#08080a]/80 backdrop-blur-md flex items-center justify-between text-xs text-zinc-400 flex-shrink-0 z-20">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-light tracking-wide text-zinc-400">
                        {isEmbedded ? (
                          <>
                            {isFreeMobile() ? 'ARRASTE AS CAPAS PARA O LADO • TOQUE NA CAPA' : IS_TOUCH ? 'DESLIZE A PÁGINA PARA NAVEGAR • TOQUE NA CAPA' : 'ROLE A PÁGINA PARA NAVEGAR • CLIQUE NA CAPA'} PARA VER O CARROSSEL <span className="font-bold text-zinc-200 tracking-wider">COMPLETO</span>
                          </>
                        ) : (
                          <>
                            USE A RODA DO MOUSE OU AS SETAS • CLIQUE NA CAPA PARA VER O CARROSSEL <span className="font-bold text-zinc-200 tracking-wider">COMPLETO</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-zinc-400 font-light text-[11px]">
                      <button
                        onClick={() => {
                          if (isEmbedded && carrosseisTrackRef.current) {
                            const track = carrosseisTrackRef.current;
                            const rect = track.getBoundingClientRect();
                            const trackTop = rect.top + window.scrollY;
                            const stageH = window.innerHeight - HEADER_H;
                            const travel = track.offsetHeight - stageH;
                            const nextIdx = Math.max(0, currentFlowIndex - 1);
                            window.scrollTo({ top: trackTop - HEADER_H + (nextIdx / Math.max(1, carrosseis.length - 1)) * travel, behavior: 'smooth' });
                          } else {
                            flowTarget.current = Math.max(0, flowTarget.current - 1);
                          }
                        }}
                        className="hover:text-white cursor-pointer px-2 py-0.5 rounded hover:bg-white/5 transition-all"
                      >
                        ← <span className="font-stretch font-bold text-zinc-400">ANTERIOR</span>
                      </button>
                      <span>•</span>
                      <span className="font-mono text-zinc-400">
                        {currentFlowIndex + 1}/{carrosseis.length}
                      </span>
                      <span>•</span>
                      <button
                        onClick={() => {
                          if (isEmbedded && carrosseisTrackRef.current) {
                            if (currentFlowIndex >= carrosseis.length - 1) {
                              const el = document.getElementById('estaticos-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              const track = carrosseisTrackRef.current;
                              const rect = track.getBoundingClientRect();
                              const trackTop = rect.top + window.scrollY;
                              const stageH = window.innerHeight - HEADER_H;
                              const travel = track.offsetHeight - stageH;
                              const nextIdx = Math.min(carrosseis.length - 1, currentFlowIndex + 1);
                              window.scrollTo({ top: trackTop - HEADER_H + (nextIdx / Math.max(1, carrosseis.length - 1)) * travel, behavior: 'smooth' });
                            }
                          } else {
                            flowTarget.current = Math.min(carrosseis.length - 1, flowTarget.current + 1);
                          }
                        }}
                        className="hover:text-white cursor-pointer px-2 py-0.5 rounded hover:bg-white/5 transition-all"
                      >
                        <span className="font-stretch font-bold text-zinc-400">
                          {currentFlowIndex >= carrosseis.length - 1 && isEmbedded ? 'ESTÁTICOS ↓' : 'PRÓXIMO →'}
                        </span>
                      </button>
                    </div>
                  </footer>

                </div>
              )}

              {/* MODE B: ALL SLIDES UNITED SIDE-BY-SIDE WITH ZERO GAP (AS REQUESTED) */}
              {viewingCarousel && (
                <div className="relative flex-1 flex flex-col justify-between overflow-hidden animate-fadeIn">
                  
                  {/* Panoramic Viewer Header */}
                  <div className="px-4 sm:px-8 py-3 border-b border-white/[0.08] bg-[#08080a]/90 backdrop-blur-md flex items-center justify-between z-20 flex-shrink-0 gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <button
                        onClick={() => setViewingCarousel(null)}
                        className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                        title="Voltar à galeria (Esc)"
                      >
                        <span aria-hidden="true">←</span>
                        <span className="hidden sm:inline">Voltar à galeria</span>
                        <span className="sm:hidden">Voltar</span>
                      </button>
                      <span className="text-white/30 hidden sm:inline">|</span>
                      <span className="hidden sm:inline text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex-shrink-0">
                        {viewingCarousel.client}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-[180px] sm:max-w-md">
                        {viewingCarousel.title}
                      </h3>
                      <span className="text-[11px] font-light text-white/50 hidden lg:inline">
                        ({viewingCarousel.slideCount} SLIDES <span className="font-stretch font-bold text-white/80">COMPLETOS</span>)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Toggle: Ver Todos na Tela vs Modo Ampliado */}
                      <button
                        onClick={() => setRibbonFitMode(prev => prev === 'fit' ? 'scroll' : 'fit')}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                          ribbonFitMode === 'fit'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                        title={ribbonFitMode === 'fit' ? 'Alternar para Modo Ampliado com rolagem lateral' : 'Ajustar todos os slides completos à tela'}
                      >
                        {ribbonFitMode === 'fit' ? (
                          <>
                            <span className="font-semibold">Todos na tela</span>
                            <span className="text-emerald-400/60 hidden md:inline text-[10px]">• Ajustado</span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">Ampliado</span>
                            <span className="text-white/50 hidden md:inline text-[10px]">• Rolagem</span>
                          </>
                        )}
                      </button>


                      <button
                        onClick={() => setViewingCarousel(null)}
                        className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer ml-1"
                        title="Fechar (Esc)"
                        aria-label="Fechar carrossel"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Panoramic Seamless Ribbon Track (All slides side-by-side with 0 gap!) */}
                  <div
                    ref={ribbonRef}
                    onWheel={handleRibbonWheel}
                    className="flex-1 flex items-center justify-center overflow-x-auto overflow-y-hidden px-4 sm:px-8 py-3 sm:py-6 cursor-grab active:cursor-grabbing no-scrollbar select-none"
                    style={IS_TOUCH && ribbonFitMode !== 'fit' ? { scrollSnapType: 'x mandatory' } : undefined}
                  >
                    <div
                      className="flex items-center gap-0 p-0 overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black backdrop-blur-md mx-auto transition-all duration-300"
                      style={ribbonFitMode === 'fit' ? {
                        width: `min(calc(100vw - 48px), calc((100vh - 165px) * ${0.8 * (viewingCarousel.slides.length || 1)}))`,
                        maxWidth: '100%',
                        maxHeight: 'min(calc(100vh - 165px), 560px)',
                      } : {
                        width: 'max-content',
                      }}
                    >
                      {viewingCarousel.slides.map((slideImg, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => {
                            slideOverride.current = sIdx;
                            setSelectedProject(viewingCarousel);
                          }}
                          {...pressable(() => { slideOverride.current = sIdx; setSelectedProject(viewingCarousel); }, `Ampliar slide ${sIdx + 1} de ${viewingCarousel.slideCount}`)}
                          className="relative group cursor-pointer overflow-hidden transition-all min-w-[150px] sm:min-w-0"
                          style={ribbonFitMode === 'fit' ? {
                            flex: '1 1 0',
                            aspectRatio: '4/5',
                            maxHeight: 'min(calc(100vh - 165px), 560px)',
                          } : {
                            flexShrink: 0,
                            height: 'min(68vh, 560px, calc((100vw - 32px) * 1.25))',
                            aspectRatio: '4/5',
                            scrollSnapAlign: 'center',
                          }}
                        >
                          <img
                            src={slideImg}
                            alt={`${viewingCarousel.title} - Slide ${sIdx + 1}`}
                            className="w-full h-full object-cover block select-none pointer-events-none"
                            loading="eager"
                            decoding="async"
                          />

                          {/* Slide Number Indicator */}
                          <div className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-white/90 border border-white/10 opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-0.5 shadow-lg">
                            <span className="font-stretch font-bold text-emerald-400">{sIdx + 1}</span>
                            <span className="font-light text-white/50">/{viewingCarousel.slideCount}</span>
                          </div>

                          {/* Hover Zoom Overlay */}
                          <div className="absolute inset-0 bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] sm:text-[11px] bg-black/90 text-white px-3 py-1.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md font-medium tracking-wide">
                              <span className="font-light text-white/70">VER</span> <span className="font-stretch font-bold text-emerald-400 tracking-wider">AMPLIAR</span> ↗
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ribbon Guidance Footer */}
                  <footer className="px-6 py-2.5 border-t border-white/[0.08] bg-[#08080a]/80 backdrop-blur-md flex items-center justify-between text-xs text-zinc-400 flex-shrink-0 z-20">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-light tracking-wide text-zinc-400">
                        {ribbonFitMode === 'fit' ? (
                          <>
                            <span className="font-bold text-emerald-400">{viewingCarousel.slideCount} SLIDES</span> LADO A LADO • {IS_TOUCH ? 'TOQUE' : 'CLIQUE'} EM UM SLIDE PARA AMPLIAR
                          </>
                        ) : (
                          <>
                            {IS_TOUCH ? <>DESLIZE PARA O LADO PARA VER OS SLIDES • TOQUE PARA AMPLIAR</> : <>MODO AMPLIADO • ARRASTE NA HORIZONTAL OU USE A RODA DO MOUSE • CLIQUE EM <span className="font-bold text-emerald-400">TODOS NA TELA</span> PARA AJUSTAR</>}
                          </>
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() => setViewingCarousel(null)}
                      className="hidden sm:inline text-zinc-400 hover:text-white cursor-pointer text-[11px] font-medium transition-colors"
                    >
                      ← Voltar à galeria
                    </button>
                  </footer>

                </div>
              )}

            </div>
          </div>
        );

        if (isEmbedded) {
          const stepPx = 220;
          const stageH = typeof window !== 'undefined' ? (window.innerHeight - HEADER_H) : 832;
          const trackHeight = isFreeMobile() ? stageH : (carrosseis.length - 1) * stepPx + stageH;
          return (
            <div
              id="carrosseis-track"
              ref={carrosseisTrackRef}
              style={{
                height: `${trackHeight}px`,
                position: 'relative',
                width: '100%',
              }}
            >
              {content}
            </div>
          );
        }

        return content;
      };

      // Helper to render Estáticos 3D Cylinder View (3 Fileiras 3D com formatos 4:5 e 9:16)
      const renderEstaticosBlock = (isEmbedded = false) => (
        <div
          id={isEmbedded ? "estaticos-section" : undefined}
          onWheel={isEmbedded ? undefined : handleStaticWheel}
          onMouseDown={(e) => {
            staticIsDragging.current = true;
            staticDragStartY.current = e.clientY;
            staticDragStartProgress.current = staticTargetProgress.current;
            staticDragDist.current = 0;
          }}
          className={`relative w-full ${isEmbedded ? (HEADER_H > 0 ? 'h-[calc(100vh-68px)]' : 'h-[100svh]') + ' min-h-[580px] border-t border-white/[0.08] bg-[#08080a]' : 'flex-1'} flex items-center justify-center overflow-hidden animate-fadeIn select-none cursor-grab active:cursor-grabbing`}
        >
          {/* Cabeçalho da seção (mesmo padrão: título Stretch + risco laranja + um doodle) */}
          <div className="absolute top-6 sm:top-[76px] z-20 flex flex-col items-center text-center pointer-events-none select-none px-4">
            <div className="relative inline-block">
              <div aria-hidden="true" className="absolute -left-10 sm:-left-12 -top-2 pointer-events-none -rotate-12 doodle">
                <svg width="34" height="42" viewBox="0 0 90 110" fill="none" stroke="#ff7500" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M48,8 L20,52 L42,52 L26,98 L76,46 L48,46 Z" />
                </svg>
              </div>
              <h2 className="font-stretch text-xl sm:text-2xl lg:text-3xl text-white leading-none tracking-normal uppercase bg-[#08080a]/70 px-2 rounded">
                FEED &amp; STORIES
              </h2>
              <svg className="w-28 sm:w-40 h-3 doodle-ink mx-auto mt-1 pointer-events-none" viewBox="0 0 180 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                <path d="M 5,6 Q 45,10 90,5 Q 135,1 175,7" />
              </svg>
            </div>

          </div>

          {/* Mobile: colunas passando sozinhas via animação CSS (roda na GPU, sem JavaScript por quadro) */}
          {isFreeMobile() && (
            <div className="static-marquee absolute inset-x-0 bottom-0 top-[84px] overflow-hidden" style={{ perspective: '900px' }}>
              <div className="static-marquee-tilt h-full grid grid-cols-3 gap-2.5 px-3">
                {staticColumns.map((colItems, cIdx) => (
                  <div key={cIdx} className="relative h-full overflow-hidden">
                    <div
                      className="static-marquee-col flex flex-col gap-2.5"
                      style={{
                        animationDuration: `${Math.max(colItems.length, 1) * 3.2}s`,
                        animationDirection: cIdx === 1 ? 'reverse' : 'normal',
                        animationDelay: `${-cIdx * 4}s`,
                      }}
                    >
                      {[0, 1].map(rep => colItems.map((project) => {
                        const fmt = project.aspectRatio === '9/16' ? 'STORY' : project.aspectRatio === '1/1' ? 'POST' : 'FEED';
                        const ratio = project.aspectRatio === '9/16' ? '9:16' : project.aspectRatio === '1/1' ? '1:1' : '4:5';
                        return (
                          <div
                            key={`${rep}-${project.id}`}
                            className="relative w-full rounded-[14px] overflow-hidden border border-white/15 bg-[#0c0c10] cursor-pointer"
                            style={{ aspectRatio: project.aspectRatio || '4/5', boxShadow: '0 10px 24px -10px rgba(0,0,0,0.85)' }}
                            onClick={() => setSelectedProject(project)}
                            {...(rep === 0 ? pressable(() => setSelectedProject(project), `Abrir peça: ${project.title}`) : { 'aria-hidden': true })}
                          >
                            <img
                              src={project.cover}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              draggable="false"
                              className="w-full h-full object-cover block select-none pointer-events-none"
                            />
                            <span className="absolute top-1.5 left-1.5 text-[8px] bg-black/80 px-1.5 py-0.5 rounded-full text-white border border-white/20 flex items-center gap-1 pointer-events-none">
                              <span className="w-1 h-1 rounded-full bg-emerald-400" />
                              <span className="font-stretch font-bold">{fmt}</span>
                              <span className="text-white/70 font-mono">{ratio}</span>
                            </span>
                          </div>
                        );
                      }))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3D Camera Scene */}
          {!isFreeMobile() && (
          <div
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{ perspective: '1400px' }}
          >
            {/* 3 Fileiras (Columns) */}
            {staticColumns.slice(0, staticMetrics.numCols).map((colItems, cIdx) => {
              const colX = staticMetrics.numCols === 3 
                ? (cIdx - 1) * staticMetrics.colSpacing 
                : 0;

              return (
                <div
                  key={cIdx}
                  className="absolute pointer-events-auto"
                  style={{
                    width: `${staticMetrics.cardW}px`,
                    height: '0px',
                    transform: `translateX(${colX}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {colItems.map((project, k) => {
                    const isStory = project.format === '1080x1920';
                    const isSquare = project.format === '1080x1080';
                    const cardH = isStory 
                      ? Math.round(staticMetrics.cardW * (16 / 9)) 
                      : isSquare 
                        ? staticMetrics.cardW 
                        : Math.round(staticMetrics.cardW * 1.25);

                    return (
                      <div
                        key={project.id}
                        ref={(el) => {
                          if (!staticCardsRefs.current[cIdx]) staticCardsRefs.current[cIdx] = [];
                          staticCardsRefs.current[cIdx][k] = el;
                        }}
                        className="absolute cursor-pointer pointer-events-auto group"
                        onClick={() => {
                          if (staticDragDist.current < 8) {
                            setSelectedProject(project);
                          }
                        }}
                        {...pressable(() => setSelectedProject(project), `Abrir peça: ${project.title}`)}
                        style={{
                          width: `${staticMetrics.cardW}px`,
                          height: `${cardH}px`,
                          top: `-${cardH / 2}px`,
                          left: `0px`,
                          transformStyle: 'preserve-3d',
                          backfaceVisibility: 'visible',
                        }}
                      >
                        {thicknessLayers.map((zOffset, layerIdx) => {
                          const isFrontFace = layerIdx === thicknessLayers.length - 1;
                          const isBackFace = layerIdx === 0;

                          if (!isFrontFace && !isBackFace) {
                            return (
                              <div
                                key={layerIdx}
                                data-layer="mid"
                                className="absolute inset-0 rounded-[18px] sm:rounded-[20px] border border-[#232328] pointer-events-none overflow-hidden"
                                style={{
                                  backgroundColor: '#121215',
                                  transform: `translateZ(${zOffset}px)`,
                                }}
                              />
                            );
                          }

                          if (isFrontFace) {
                            return (
                              <div
                                key={layerIdx}
                                data-layer="front"
                                className="absolute inset-0 rounded-[18px] sm:rounded-[20px] border border-white/20 pointer-events-none overflow-hidden shadow-2xl transition-all group-hover:border-emerald-500/50 group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
                                style={{
                                  backgroundColor: '#09090b',
                                  transform: `translateZ(${zOffset}px)`,
                                  backfaceVisibility: 'hidden',
                                  boxShadow: 'inset 0 1px 1.5px rgba(255,255,255,0.25), 0 25px 50px -12px rgba(0,0,0,0.95)',
                                }}
                              >
                                <img
                                  src={project.cover}
                                  alt={project.title}
                                  className="w-full h-full object-cover block filter contrast-[1.03]"
                                  loading="lazy"
                                  decoding="async"
                                />

                                {/* Format Badge (Story 9:16 vs Feed 4:5 vs Post 1:1) */}
                                <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                                  {isStory ? (
                                    <span className="text-[9px] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-white/95 border border-white/20 font-medium flex items-center gap-1 shadow-lg">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                      <span className="font-stretch font-bold text-white">STORY</span>
                                      <span className="text-white/60 text-[8px] font-mono">9:16</span>
                                    </span>
                                  ) : isSquare ? (
                                    <span className="text-[9px] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-white/95 border border-white/20 font-medium flex items-center gap-1 shadow-lg">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                      <span className="font-stretch font-bold text-white">POST</span>
                                      <span className="text-white/60 text-[8px] font-mono">1:1</span>
                                    </span>
                                  ) : (
                                    <span className="text-[9px] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-white/95 border border-white/20 font-medium flex items-center gap-1 shadow-lg">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                      <span className="font-stretch font-bold text-white">FEED</span>
                                      <span className="text-white/60 text-[8px] font-mono">4:5</span>
                                    </span>
                                  )}
                                </div>

                                {/* Subtle hover indicator */}
                                <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <span className="text-[10px] bg-black/90 text-white px-3 py-1.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md font-medium tracking-wide">
                                    <span className="font-light text-white/70">VER</span> <span className="font-stretch font-bold text-emerald-400 tracking-wider">DETALHES</span> ↗
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          if (isBackFace) {
                            return (
                              <div
                                key={layerIdx}
                                data-layer="back"
                                className="absolute inset-0 rounded-[18px] sm:rounded-[20px] border border-white/15 pointer-events-none overflow-hidden p-4 sm:p-5 flex flex-col justify-between text-left"
                                style={{
                                  backgroundColor: '#0c0c10',
                                  transform: `translateZ(${zOffset}px) rotateX(180deg)`,
                                  backfaceVisibility: 'hidden',
                                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)',
                                }}
                              >
                                <div className="absolute inset-0 pointer-events-none" style={{ filter: 'blur(20px)', opacity: 0.35, transform: 'scale(1.2)' }}>
                                  <img src={project.cover} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                </div>
                                <div className="absolute inset-0 bg-black/70 pointer-events-none" />

                                <div className="relative z-10 flex flex-col gap-2">
                                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">
                                      FICHA <span className="font-stretch font-bold text-white">TÉCNICA</span>
                                    </span>
                                    <span className="text-[9px] font-mono text-white/70">{project.format || '1080×1350'}</span>
                                  </div>

                                  <div>
                                    <div className="text-[9px] font-light text-white/70">Cliente</div>
                                    <div className="text-xs font-bold text-white truncate">{project.client}</div>
                                  </div>

                                  <div>
                                    <div className="text-[9px] font-light text-white/70">Finalidade</div>
                                    <div className="text-[11px] font-medium text-white/90 truncate">{project.type}</div>
                                  </div>

                                  <div>
                                    <div className="text-[9px] font-light text-white/70 mb-1">Cores</div>
                                    <div className="flex gap-1.5">
                                      {project.colors.slice(0, 4).map((c, idx) => (
                                        <div
                                          key={idx}
                                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                                          style={{ backgroundColor: c }}
                                          title={c}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="relative z-10 pt-1.5 border-t border-white/10 flex items-center justify-between">
                                  <span className="text-[9px] font-light text-white/70">{IS_TOUCH ? 'TOQUE' : 'CLIQUE'} PARA <span className="font-stretch font-bold text-white">EXPANDIR</span></span>
                                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-[10px]">
                                    ↗
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          )}


        </div>
      );

      return (
        <div className={`relative w-full ${activeTab === 'home' ? 'min-h-screen' : 'h-full overflow-hidden'} bg-[#08080a] text-zinc-100 flex flex-col select-none font-sans`}>
          
          {/* Tactile Obsidian Canvas with Subtle Film Grain */}
          <div className="absolute inset-0 bg-grain pointer-events-none z-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080a]/90 via-transparent to-[#08080a] pointer-events-none z-0" />

          {/* ======================================================== */}
          {/* TOP HEADER: BRAND + 3 CATEGORY MENUS + HIRING CTA       */}
          {/* (Temporariamente desativado conforme solicitado)         */}
          {/* ======================================================== */}
          {HEADER_H > 0 && (
            <header className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-10 py-3.5 border-b border-white/[0.08] bg-[#08080a]/90 backdrop-blur-xl flex-shrink-0">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center p-1.5 shadow-lg backdrop-blur-md overflow-hidden">
                  <img src="https://pub-08de669c0de241f1af8701cc7d228e29.r2.dev/assets/logo.png" alt="Marcos Logo" className="w-full h-full object-contain filter brightness-110 drop-shadow" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-sm font-black tracking-wide text-white">
                    MARCOS <span className="text-white/40 font-light">/ DESIGNER</span>
                  </div>
                  <div className="text-[10px] text-white/50 tracking-wider font-medium flex items-center gap-1.5">
                    <span>DIREÇÃO DE ARTE & BRANDING</span>
                    <span className="text-white/20">•</span>
                    <span className="text-emerald-400/90 font-semibold">2026</span>
                  </div>
                </div>
              </div>

              {/* 4 Main Category Menus (including Início) */}
              <nav className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
                {[
                  { id: 'home', label: 'Início', badge: null },
                  { id: 'carrosseis', label: 'Carrosséis', badge: null },
                  { id: 'estaticos', label: 'Estáticos', badge: null },
                  { id: 'identidade-visual', label: 'Identidade Visual', badge: null }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'home') {
                        if (activeTab === 'home') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          setActiveTab('home');
                          window.scrollTo(0, 0);
                        }
                      } else if (tab.id === 'carrosseis') {
                        const scrollToTrack = () => {
                          const track = document.getElementById('carrosseis-track');
                          if (track) {
                            const rect = track.getBoundingClientRect();
                            const targetY = rect.top + window.scrollY - HEADER_H;
                            window.scrollTo({ top: targetY, behavior: 'smooth' });
                          } else {
                            const el = document.getElementById('carrosseis-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        };
                        if (activeTab === 'home') {
                          scrollToTrack();
                        } else {
                          setActiveTab('home');
                          setTimeout(scrollToTrack, 60);
                        }
                      } else if (tab.id === 'estaticos') {
                        const scrollToEstaticos = () => {
                          const el = document.getElementById('estaticos-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        };
                        if (activeTab === 'home') {
                          scrollToEstaticos();
                        } else {
                          setActiveTab('home');
                          setTimeout(scrollToEstaticos, 60);
                        }
                      } else if (tab.id === 'identidade-visual') {
                        if (activeTab === 'home') {
                          // Scroll to the exposed 3x3 gallery stationary zone
                          window.scrollTo({ top: ANIM_SCROLL, behavior: 'smooth' });
                        } else {
                          setActiveTab('identidade-visual');
                        }
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#f4f4f5] text-zinc-950 font-bold shadow-lg shadow-black/40 scale-100'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] font-medium'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge !== null && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-stretch ${
                        activeTab === tab.id ? 'bg-black/10 text-zinc-900 font-bold' : 'bg-white/10 text-zinc-400 font-semibold'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* WhatsApp Quote CTA */}
              <div className="flex items-center gap-3">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#f4f4f5] hover:bg-white text-zinc-950 text-xs px-4 py-2 rounded-full shadow-md shadow-white/5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                >
                  <span className="hidden sm:inline font-semibold">Solicitar <strong className="font-extrabold text-black">Orçamento</strong></span>
                  <span className="sm:hidden font-bold">Orçamento</span>
                  <span className="text-sm">↗</span>
                </a>
              </div>
            </header>
          )}



          {/* ========================================================================= */}
          {/* CATEGORY 0: INÍCIO / HOME (VANTE 3D RIBBON SCROLL HERO)                   */}
          {/* ========================================================================= */}
          {activeTab === 'home' && (
            <div className="w-full flex flex-col">
              <HomeView
                idVisual={idVisual}
                onSelectProject={setSelectedProject}
                onNavigate={setActiveTab}
                heroVersion={heroVersion}
              />
              {renderSobreMimBlock()}
              {renderCarrosseisBlock(true)}
              <div id="estaticos-track" style={{ position: 'relative', height: `calc(100svh + ${staticTrackTravel}px)` }}>
                <div style={{ position: 'sticky', top: 0 }}>
                  {renderEstaticosBlock(true)}
                </div>
              </div>
              {renderContatoBlock()}
            </div>
          )}

          {/* Navegação flutuante: categorias + WhatsApp sempre à mão */}
          {activeTab === 'home' && !selectedProject && !viewingCarousel && (
            <nav
              aria-label="Navegação do portfólio"
              className={`fixed z-40 bottom-3 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:top-5 sm:right-6 flex items-center gap-1 p-1 rounded-full bg-[#08080a]/90 border border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${
                showFloatingNav ? 'opacity-100' : 'opacity-0 pointer-events-none invisible'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              {[
                { key: 'identidade', label: 'Identidades' },
                { key: 'sobre', label: 'Sobre' },
                { key: 'carrosseis', label: 'Carrosséis' },
                { key: 'estaticos', label: 'Estáticos' },
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => scrollToSection(item.key)}
                  className="px-2 sm:px-3.5 min-h-[44px] sm:min-h-[36px] rounded-full text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chamar no WhatsApp"
                className="ml-0.5 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-2.5 sm:px-3.5 rounded-full bg-[#f4f4f5] hover:bg-white text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={WA_ICON_PATH} /></svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </nav>
          )}

          {/* CATEGORY 1: CARROSSÉIS (DYNAMIC 3D COVER FLOW + UNITED PANORAMIC VIEW)    */}
          {/* ========================================================================= */}
          {activeTab === 'carrosseis' && renderCarrosseisBlock(false)}

          {/* ========================================================================= */}
          {/* CATEGORY 2: ESTÁTICOS (VERTICAL 3D CYLINDER MAINTAINED, CARDS LARGER)    */}
          {/* ========================================================================= */}
          {activeTab === 'estaticos' && renderEstaticosBlock(false)}

          {/* ========================================================================= */}
          {/* CATEGORY 3: IDENTIDADE VISUAL (HORIZONTAL SCROLL SIDE BY SIDE + HOVER SCALE) */}
          {/* ========================================================================= */}
          {activeTab === 'identidade-visual' && (
            <div className="relative flex-1 flex flex-col overflow-hidden animate-fadeIn">
              
              {/* Main Horizontal Scroll Track for all 9 Visual Identities side-by-side */}
              <div
                ref={idVisualContainerRef}
                onWheel={handleIdVisualWheel}
                onMouseDown={handleMouseDownID}
                onMouseMove={handleMouseMoveID}
                onMouseUp={handleMouseUpID}
                onMouseLeave={handleMouseUpID}
                className="flex-1 flex items-center overflow-x-auto overflow-y-hidden px-8 sm:px-14 py-6 gap-10 sm:gap-14 cursor-grab active:cursor-grabbing no-scrollbar select-none"
              >
                {idVisual.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProject(item)}
                    {...pressable(() => setSelectedProject(item), `Abrir identidade visual: ${item.title}`)}
                    className="flex flex-col gap-3 flex-shrink-0 group cursor-pointer"
                    style={{
                      width: 'clamp(320px, 26vw, 420px)',
                    }}
                  >
                    {/* Header above card */}
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-1.5 truncate mr-2">
                        <span className="text-xs sm:text-sm font-black text-white tracking-wide whitespace-nowrap">
                          {shortTitle(item.title)}
                        </span>
                        {/ [—-] /.test(item.title) && (
                          <span className="text-[11px] text-zinc-400 font-medium tracking-wide truncate">
                            — {item.title.split(/ [—-] /)[1]}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(item);
                        }}
                        className="text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 font-medium whitespace-nowrap flex-shrink-0"
                      >
                        <span className="font-light">Ver</span>
                        <strong className="font-bold text-emerald-400">Completa</strong>
                        <span>↗</span>
                      </button>
                    </div>

                    {/* Presentation Board with Subtle Scale on Hover ("passando o mouse ela da um leve scale para ficar em destaque") */}
                    <div
                      className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0d0d11] shadow-2xl transition-all duration-300 ease-out transform group-hover:scale-[1.03] group-hover:border-emerald-500/40 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] flex flex-col"
                      style={{
                        height: 'min(68vh, 560px)',
                      }}
                    >
                      {/* Image Preview with Top Focus */}
                      <div className="w-full h-full overflow-hidden relative">
                        <img
                          src={item.presentationImage}
                          alt={item.title}
                          className="w-full h-full object-cover object-top block transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                          loading="lazy"
                        />

                        {/* Subtle center hover indicator */}
                        <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="text-[11px] bg-black/85 text-white px-3.5 py-1.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md font-medium">
                            <span className="font-light text-white/70">VER</span> <span className="font-stretch font-bold text-emerald-400 tracking-wider">COMPLETA</span> ↗
                          </span>
                        </div>

                        {/* Subtle spotlight on hover */}
                        <div className="absolute inset-0 bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Horizontal Scroll Guidance Footer */}
              <footer className="px-6 py-2.5 border-t border-white/[0.08] bg-[#08080a]/80 backdrop-blur-md flex items-center justify-between text-xs text-zinc-400 flex-shrink-0 z-20">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-light tracking-wide text-zinc-400">
                    DIREÇÃO DE IDENTIDADE VISUAL • ARRASTE NA HORIZONTAL PARA VER TODAS AS <span className="font-stretch font-bold text-zinc-200 tracking-wider">MARCAS</span>
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-zinc-400 font-light text-[11px]">
                  <span>← <span className="font-stretch font-bold text-zinc-400">ESQUERDA</span></span>
                  <span>•</span>
                  <span><span className="font-stretch font-bold text-zinc-400">DIREITA</span> →</span>
                </div>
              </footer>

            </div>
          )}

          {/* ======================================================== */}
          {/* IDENTIDADE VISUAL: APRESENTAÇÃO COMPLETA (SEM PAINEL)    */}
          {/* ROLAGEM VERTICAL COMPLETA, FULL VIEWPORT, ZERO PAINÉIS   */}
          {/* ======================================================== */}
          {selectedProject && selectedProject.category === 'Identidade Visual' && (() => {
            const currentIdIdx = idVisual.findIndex(p => p.id === selectedProject.id);
            const prevIdProject = currentIdIdx > 0 ? idVisual[currentIdIdx - 1] : null;
            const nextIdProject = currentIdIdx >= 0 && currentIdIdx < idVisual.length - 1 ? idVisual[currentIdIdx + 1] : null;

            return (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`Identidade visual: ${selectedProject.title}`}
                className="fixed inset-0 z-50 pointer-events-none animate-fadeIn"
              >
                <div 
                  id="idvisual-modal-scroll"
                  className="absolute inset-0 bg-[#08080a] overflow-y-auto overflow-x-hidden select-auto pointer-events-auto"
                  style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
                >
                {/* Minimal Top Header with Close and Quick Switch */}
                <header className="sticky top-0 z-50 px-3 sm:px-8 py-2.5 sm:py-3.5 bg-[#08080a]/92 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between gap-2 shadow-2xl relative">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="hidden sm:block w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" aria-hidden="true" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-stretch text-xs sm:text-base text-white font-bold tracking-wide uppercase truncate sm:max-w-md">
                        {shortTitle(selectedProject.title)}
                      </span>
                      <span className="hidden sm:block text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                        IDENTIDADE VISUAL • APRESENTAÇÃO COMPLETA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
                    {/* Navigation between visual identities */}
                    <div className="flex items-center gap-0.5 sm:gap-1.5 bg-white/5 border border-white/10 px-1 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                      <button
                        disabled={!prevIdProject}
                        onClick={() => {
                          if (prevIdProject) {
                            setSelectedProject(prevIdProject);
                            if (window.presentationLenis) {
                              window.presentationLenis.scrollTo(0, { immediate: true });
                            } else {
                              const modal = document.getElementById('idvisual-modal-scroll');
                              if (modal) modal.scrollTo(0, 0);
                            }
                          }
                        }}
                        aria-label="Marca anterior"
                        className={`w-9 h-9 sm:w-auto sm:h-auto sm:p-1 flex items-center justify-center rounded-full transition-all ${
                          prevIdProject ? 'text-white hover:bg-white/15 cursor-pointer' : 'text-white/20 cursor-not-allowed'
                        }`}
                        title="Marca Anterior"
                      >
                        ←
                      </button>
                      <span className="text-[11px] font-mono text-zinc-400 px-1">
                        {currentIdIdx >= 0 ? currentIdIdx + 1 : 1}/{idVisual.length}
                      </span>
                      <button
                        disabled={!nextIdProject}
                        onClick={() => {
                          if (nextIdProject) {
                            setSelectedProject(nextIdProject);
                            if (window.presentationLenis) {
                              window.presentationLenis.scrollTo(0, { immediate: true });
                            } else {
                              const modal = document.getElementById('idvisual-modal-scroll');
                              if (modal) modal.scrollTo(0, 0);
                            }
                          }
                        }}
                        aria-label="Próxima marca"
                        className={`w-9 h-9 sm:w-auto sm:h-auto sm:p-1 flex items-center justify-center rounded-full transition-all ${
                          nextIdProject ? 'text-white hover:bg-white/15 cursor-pointer' : 'text-white/20 cursor-not-allowed'
                        }`}
                        title="Próxima Marca"
                      >
                        →
                      </button>
                    </div>

                    <a
                      href={getWhatsAppLink(selectedProject.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Conversar sobre este projeto no WhatsApp"
                      className="flex items-center justify-center gap-2 w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full bg-[#f4f4f5] hover:bg-white text-zinc-950 text-xs font-bold transition-colors cursor-pointer active:scale-95"
                    >
                      <svg className="sm:hidden w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={WA_ICON_PATH} /></svg>
                      <span className="hidden sm:inline">Conversar sobre o projeto</span>
                      <span className="hidden sm:inline" aria-hidden="true">↗</span>
                    </a>

                    <button
                      onClick={() => setSelectedProject(null)}
                      data-autofocus
                      aria-label="Fechar apresentação"
                      className="flex items-center justify-center gap-2 w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-medium tracking-wide transition-colors cursor-pointer active:scale-95"
                      title="Fechar (Esc)"
                    >
                      <span aria-hidden="true">✕</span>
                      <span className="hidden sm:inline">Fechar</span>
                    </button>
                  </div>

                  {/* Fluid Presentation Reading Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/[0.04] overflow-hidden pointer-events-none">
                    <div 
                      id="idvisual-progress-bar"
                      className="h-full bg-emerald-400 will-change-[width] transition-[width] duration-75 ease-out"
                      style={{ width: '0%' }}
                    />
                  </div>
                </header>

                {/* Pure Continuous Presentation Content */}
                <main className="w-full max-w-5xl xl:max-w-6xl mx-auto py-6 sm:py-10 px-2 sm:px-6 flex flex-col items-center">
                  {selectedProject.boardParts && selectedProject.boardParts.length > 0 ? (
                    <div className="w-full max-w-[634px] mx-auto flex flex-col items-center rounded-2xl overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.95)] border border-white/10">
                      {selectedProject.boardParts.map((part, idx) => (
                        part.toLowerCase().endsWith('.gif') ? (
                          <picture key={idx} className="w-full block leading-none">
                            <source srcSet={part.replace(/\.gif$/i, '.webp')} type="image/webp" />
                            <img 
                              src={part} 
                              alt={`${selectedProject.title} animação`}
                              className="w-full h-auto object-contain block"
                              loading={idx < 2 ? 'eager' : 'lazy'}
                              decoding="async"
                            />
                          </picture>
                        ) : (
                          <img 
                            key={idx} 
                            src={part} 
                            alt={`${selectedProject.title} - Parte ${idx + 1}`}
                            className="w-full h-auto object-contain block"
                            loading={idx < 2 ? 'eager' : 'lazy'}
                            decoding="async"
                          />
                        )
                      ))}
                    </div>
                  ) : (
                    <img 
                      key={selectedProject.id}
                      src={selectedProject.presentationImage || selectedProject.cover} 
                      alt={selectedProject.title}
                      style={{ maxWidth: 634 }}
                      className="w-full h-auto object-contain block mx-auto rounded-2xl shadow-[0_25px_100px_rgba(0,0,0,0.95)] border border-white/10"
                      loading="eager"
                      decoding="sync"
                    />
                  )}

                  {/* Bottom Navigation / Close Bar */}
                  <div className="w-full py-16 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-white/10 mt-12">
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                      }}
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>← Voltar para as Marcas</span>
                    </button>

                    {nextIdProject && (
                      <button
                        onClick={() => {
                          setSelectedProject(nextIdProject);
                          if (window.presentationLenis) {
                            window.presentationLenis.scrollTo(0, { immediate: true });
                          } else {
                            const modal = document.getElementById('idvisual-modal-scroll');
                            if (modal) modal.scrollTo(0, 0);
                          }
                        }}
                        className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <span>Próxima: {shortTitle(nextIdProject.title)} →</span>
                      </button>
                    )}

                    <a
                      href={getWhatsAppLink(selectedProject.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 rounded-full bg-[#f4f4f5] hover:bg-white text-zinc-950 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
                    >
                      <span>Conversar sobre este projeto</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </main>
                </div>

              {/* Floating Back to Top Pill for seamless fluid navigation */}
              <button
                id="idvisual-back-to-top"
                onClick={() => {
                  if (window.presentationLenis) {
                    window.presentationLenis.scrollTo(0, { duration: 1.6 });
                  } else {
                    const modal = document.getElementById('idvisual-modal-scroll');
                    if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#121217]/90 hover:bg-black border border-white/20 text-white text-xs font-semibold shadow-2xl backdrop-blur-md opacity-0 pointer-events-none translate-y-4 transition-all duration-300 ease-out hover:border-emerald-500/50 hover:text-emerald-300 cursor-pointer group active:scale-95"
                title="Voltar ao início da apresentação"
              >
                <span className="text-emerald-400 group-hover:-translate-y-0.5 transition-transform font-bold" aria-hidden="true">↑</span>
                <span className="hidden sm:inline">Voltar ao topo</span>
              </button>
            </div>
            );
          })()}

          {/* ======================================================== */}
          {/* SHARED LIGHTBOX / DETAILS MODAL FOR OTHER PROJECTS (ESTÁTICOS) */}
          {/* ======================================================== */}
          {selectedProject && selectedProject.category !== 'Identidade Visual' && (() => {
            const isCarousel = selectedProject.category === 'Carrosséis';
            const total = isCarousel ? selectedProject.slides.length : estaticos.length;
            const position = isCarousel ? currentSlideIndex + 1 : estaticos.findIndex(p => p.id === selectedProject.id) + 1;
            const src = selectedProject.slides[isCarousel ? currentSlideIndex : 0];
            const navBtn = "w-11 h-11 rounded-full bg-black/60 hover:bg-black border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer";
            return (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedProject.title} — arte ${position} de ${total}`}
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col animate-fadeIn select-none"
                onClick={() => setSelectedProject(null)}
                onTouchStart={(e) => { lightboxTouch.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  if (lightboxTouch.current === null) return;
                  const dx = e.changedTouches[0].clientX - lightboxTouch.current;
                  lightboxTouch.current = null;
                  if (Math.abs(dx) > 50) lightboxNav(dx < 0 ? 1 : -1);
                }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }}
                  data-autofocus
                  aria-label="Fechar"
                  title="Fechar (Esc)"
                  className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>

                <div className="relative flex-1 min-h-0 flex items-center justify-center px-3 sm:px-20 pt-16 pb-3">
                  <img
                    key={src}
                    src={src}
                    alt={`${selectedProject.title} — arte ${position} de ${total}`}
                    onClick={(e) => e.stopPropagation()}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.85)] animate-fadeIn"
                  />
                  {total > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); lightboxNav(-1); }}
                        aria-label="Arte anterior"
                        className={`${navBtn} absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 hidden sm:flex`}
                      >
                        <span aria-hidden="true">←</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); lightboxNav(1); }}
                        aria-label="Próxima arte"
                        className={`${navBtn} absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 hidden sm:flex`}
                      >
                        <span aria-hidden="true">→</span>
                      </button>
                    </>
                  )}
                </div>

                <div
                  className="flex-shrink-0 flex items-center justify-center gap-3 px-4 pb-5 sm:pb-6 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="min-w-0 text-xs sm:text-sm text-zinc-300 truncate">
                    <span className="font-semibold text-white">{selectedProject.title}</span>
                    <span className="text-zinc-400"> · {selectedProject.client}</span>
                  </p>
                  {total > 1 && (
                    <span className="flex-shrink-0 text-[11px] text-zinc-400 tabular-nums">{position} / {total}</span>
                  )}
                  <a
                    href={getWhatsAppLink(selectedProject.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Conversar sobre este projeto no WhatsApp"
                    title="Conversar sobre este projeto"
                    className="flex-shrink-0 w-11 h-11 rounded-full bg-[#f4f4f5] hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={WA_ICON_PATH} /></svg>
                  </a>
                </div>
              </div>
            );
          })()}

        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
