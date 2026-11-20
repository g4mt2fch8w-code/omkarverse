(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,994110,e=>{"use strict";var t=e.i(685476),r=e.i(59218),i=e.i(188545),a=e.i(294425),o=e.i(988177),l=e.i(221928),n=e.i(783425);let u={heading:{after:0,takes:.75},image:{after:0,takes:.9},meta:{after:.2,takes:.6},price:{after:.15,takes:.6},title:{after:.08,takes:.65},video:{after:0,takes:.9}},s=`
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float outExpo(float t) { return t >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t); }
`,c=`
  uniform float uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    /* the scroll's speed bows the picture along its width */
    p.y += sin(uv.x * 3.14159265) * uVelocity * 0.09;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,f=`
  uniform sampler2D uTex;
  uniform float uProgress;
  uniform float uHover;
  uniform float uVelocity;
  uniform float uReady;
  uniform float uTime;
  uniform float uParallax;
  uniform vec2 uSize;
  uniform vec2 uImage;
  varying vec2 vUv;
  ${s}
  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    float e = outExpo(p);
    /* uncovered upwards, along an edge that drifts as it climbs */
    float edge = p * 1.4 - 0.2;
    float n = (noise(vUv * vec2(5.0, 3.0) + vec2(0.0, uTime * 0.35)) - 0.5) * 0.24;
    float shown = smoothstep(0.0, 0.12, edge + n - vUv.y);
    /* the picture fills its box, as the list's own does, and settles out of a close zoom */
    float rs = uSize.x / uSize.y;
    float ri = uImage.x / max(uImage.y, 1.0);
    vec2 fit = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
    float zoom = mix(1.4, 1.1, e) + uHover * 0.08;
    vec2 uv = (vUv - 0.5) * fit / zoom + 0.5;
    uv.y += uParallax * 0.03;
    /* and parts its colours with the scroll */
    float split = uVelocity * 0.028 + uHover * 0.0025;
    vec3 c = vec3(
      texture2D(uTex, uv + vec2(0.0, split)).r,
      texture2D(uTex, uv).g,
      texture2D(uTex, uv - vec2(0.0, split)).b
    );
    gl_FragColor = vec4(c, shown * uReady);
    #include <colorspace_fragment>
  }
`,v=`
  uniform float uVelocity;
  uniform float uHover;
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    /* the scroll leans the line; the pointer steps the name along */
    p.x += p.y * uVelocity * 0.3 * (uSize.y / uSize.x);
    p.x += uHover * 10.0 / uSize.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,d=`
  uniform sampler2D uTex;
  uniform float uProgress;
  uniform float uVelocity;
  uniform float uReady;
  uniform vec2 uSize;
  varying vec2 vUv;
  ${s}
  void main() {
    float e = outExpo(clamp(uProgress, 0.0, 1.0));
    /* the words rise out from under their line */
    vec2 uv = vUv;
    uv.y += (1.0 - e) * 1.05;
    if (uv.y > 1.0) discard;
    float split = uVelocity * 4.0 / uSize.x;
    vec4 a = texture2D(uTex, uv + vec2(split, 0.0));
    vec4 b = texture2D(uTex, uv);
    vec4 d = texture2D(uTex, uv - vec2(split, 0.0));
    vec4 c = vec4(a.r, b.g, d.b, max(max(a.a, b.a), d.a));
    c.a *= uReady * smoothstep(0.0, 0.3, e);
    gl_FragColor = c;
    #include <colorspace_fragment>
  }
`,m=(e,t,r)=>e+(t-e)*r;function p(e){let t=e.texture;if(!(t instanceof o.Nk))return;let r=t.image,i=[r.width,r.height];if(g(e,r),r.width===i[0]&&r.height===i[1]){t.needsUpdate=!0;return}let a=h(r);e.mesh.material.uniforms.uTex.value=a,e.texture=a,t.dispose()}function h(e){let t=new o.Nk(e);return t.colorSpace=o.nj,t.minFilter=o.VV,t.generateMipmaps=!1,t}function g(e,t){let r=getComputedStyle(e.el),i=getComputedStyle(document.documentElement),a=("meta"===e.kind?i.getPropertyValue("--dim"):i.getPropertyValue("--ink")).trim(),o=Math.min(window.devicePixelRatio||1,2),l=Math.max(1,e.w),n=Math.max(1,e.h+2*e.pad);t.width=Math.ceil(l*o),t.height=Math.ceil(n*o);let u=t.getContext("2d");if(!u)return;u.setTransform(o,0,0,o,0,0),u.clearRect(0,0,l,n),u.font=`${r.fontStyle} ${r.fontWeight} ${r.fontSize} ${r.fontFamily}`,"letterSpacing"in u&&"normal"!==r.letterSpacing&&(u.letterSpacing=r.letterSpacing),u.fillStyle=a||"#111",u.textBaseline="middle";let s=(e.el.textContent??"").replace(/\s+/g," ").trim();"uppercase"===r.textTransform&&(s=s.toUpperCase());let c=e=>u.measureText(e).width<=l,f="nowrap"!==r.whiteSpace&&"pre"!==r.whiteSpace?Number.parseInt(r.getPropertyValue("-webkit-line-clamp"),10)||99:1,v=[];if(1===f)v.push(s);else{let e="";for(let t of s.split(" ")){let r=e?`${e} ${t}`:t;!e||c(r)?e=r:(v.push(e),e=t)}e&&v.push(e),v.length>f&&v.splice(f-1,v.length,v.slice(f-1).join(" "))}v[v.length-1]=(e=>{if(c(e))return e;let t=e;for(;t.length>1&&!c(`${t}…`);)t=t.slice(0,-1);return`${t.trimEnd()}…`})(v[v.length-1]??"");let d=Number.parseFloat(r.fontSize)||16,m=Number.parseFloat(r.lineHeight)||1.2*d,p=e.pad+e.h/2-(v.length-1)*m/2;v.forEach((e,t)=>{u.fillText(e,0,p+t*m)})}function x({scroller:e,sheet:l}){let n=(0,a.useRef)(null),s=(0,a.useRef)([]),w=(0,a.useRef)(new Map),y=(0,a.useRef)(new Map),S=(0,a.useRef)(-1/0),T=(0,a.useRef)({trail:[],velocity:0}),b=(0,a.useRef)(null),M=(0,a.useRef)(!1),R=(0,a.useRef)(!1),k=(0,i.f)(e=>e.size),z=(0,a.useRef)(0);(0,a.useEffect)(()=>{let t=e.current,r=n.current;if(!t||!r)return;M.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let i=new o.CQ(1,1,24,10),a=[];for(let e of Array.from(t.querySelectorAll("[data-gl]"))){let t=e.dataset.gl,l=e.closest("[data-reveal]")??e,n="image"===t||"video"===t,u=new o.Zg({depthTest:!1,depthWrite:!1,fragmentShader:n?f:d,transparent:!0,uniforms:{uHover:{value:0},uImage:{value:new o.wq(1,1)},uParallax:{value:0},uProgress:{value:0},uReady:{value:0},uSize:{value:new o.wq(1,1)},uTex:{value:null},uTime:{value:0},uVelocity:{value:0}},vertexShader:n?c:v}),s=new o.kE(i,u);s.visible=!1,s.frustumCulled=!1,r.add(s),a.push({el:e,h:0,hover:0,kind:t,left:0,loading:!1,mesh:s,pad:0,row:l,texture:null,top:0,w:0})}s.current=a;let u=()=>{let e=t.scrollTop,r=l.current?.parentElement;for(let t of(r&&(z.current=r.getBoundingClientRect().top+e),a)){let r=t.el.getBoundingClientRect();t.top=r.top+e,t.left=r.left,t.w=r.width,t.h=r.height,t.pad="image"===t.kind||"video"===t.kind?0:Math.ceil(.35*Number.parseFloat(getComputedStyle(t.el).fontSize))}};u();let m=new ResizeObserver(()=>{for(let e of(u(),a))p(e)});m.observe(t.firstElementChild??t),window.addEventListener("resize",u);let h=!0;document.fonts.ready.then(()=>{h&&(R.current=!0)});let g=new MutationObserver(()=>{for(let e of a)p(e)});g.observe(document.documentElement,{attributeFilter:["data-theme"]});let x=e=>{b.current=e.target?.closest("[data-reveal]")??null},S=()=>{b.current=null};return t.addEventListener("pointerover",x),t.addEventListener("pointerleave",S),T.current.trail=[],()=>{for(let e of(h=!1,m.disconnect(),g.disconnect(),window.removeEventListener("resize",u),t.removeEventListener("pointerover",x),t.removeEventListener("pointerleave",S),a))r.remove(e.mesh),e.mesh.material.dispose(),e.texture?.dispose();i.dispose(),s.current=[],w.current.clear(),y.current.clear()}},[e,l]);let E=e=>{e.loading=!0;let t=e.mesh.material.uniforms;if("image"===e.kind){let r=e.el.dataset.src;if(!r)return;let i=new o.H5;i.setCrossOrigin("anonymous"),i.load(r,r=>{r.colorSpace=o.nj;let i=r.image;t.uImage.value.set(i.width,i.height),t.uTex.value=r,e.texture=r});return}if("video"===e.kind){let r=e.el.querySelector("video");if(!r)return;let i=new o.TS(r);i.colorSpace=o.nj;let a=()=>t.uImage.value.set(r.videoWidth||16,r.videoHeight||9);a(),r.addEventListener("loadedmetadata",a,{once:!0}),t.uTex.value=i,e.texture=i;return}let r=document.createElement("canvas");g(e,r);let i=h(r);t.uTex.value=i,e.texture=i};return(0,r.f)((t,r)=>{let i=e.current;if(!i)return;let a=t.clock.elapsedTime,o=k.width,n=i.clientHeight,c=k.height,f=(c-n)/2,v=i.scrollTop;l.current&&(l.current.style.transform=`translate3d(0, ${v-f-z.current}px, 0)`);let d=T.current.trail,p=performance.now();for(d.push({at:p,top:v});d.length>2&&p-d[0].at>100;)d.shift();let h=Math.max(p-d[0].at,16),g=(v-d[0].top)/h*1e3,x=M.current?0:Math.max(-1,Math.min(1,g/2e3)),P=T.current.velocity;T.current.velocity=m(P,x,Math.min(1,r*(Math.abs(x)>Math.abs(P)?14:4)));let V=T.current.velocity,C=new Map;for(let e of s.current){if(w.current.has(e.row))continue;let t=e.top-v,r=t<.94*n&&t+e.h>0,i=C.get(e.row);(r||i)&&C.set(e.row,{at:Math.min(i?.at??t,t),ready:(i?.ready??!0)&&!!e.texture})}for(let[e,{ready:t}]of[...C].sort((e,t)=>e[1].at-t[1].at)){y.current.has(e)||y.current.set(e,a);let r=a-(y.current.get(e)??a)<1.2;if(!t&&r)break;let i=Math.max(a+.02,S.current+.13);S.current=i,w.current.set(e,i)}for(let e of s.current){let{mesh:t}=e,r=t.material.uniforms,i=e.top-v;i+e.h>-n&&i<2*n&&!e.loading&&(R.current||"image"===e.kind||"video"===e.kind)&&E(e);let l=("image"===e.kind||"video"===e.kind)&&e.el.querySelector("[data-away]");if(t.visible=!!e.texture&&i+e.h+e.pad>-f&&i-e.pad<n+f&&!l,!t.visible)continue;let s=e.h+2*e.pad;t.position.set(e.left+e.w/2-o/2,c/2-(i+f+e.h/2),0),t.scale.set(e.w,s,1),r.uSize.value.set(e.w,s);let d=w.current.get(e.row),{after:p,takes:h}=u[e.kind];r.uProgress.value=M.current?1:void 0===d?0:Math.max(0,Math.min(1,(a-d-p)/h)),r.uReady.value=m(r.uReady.value,+!!e.texture,.18),e.hover=m(e.hover,+(b.current===e.row&&!M.current),.1),r.uHover.value="meta"===e.kind?0:e.hover,r.uVelocity.value=V,r.uTime.value=a,r.uParallax.value=M.current?0:((i+e.h/2)/n-.5)*2}}),(0,t.jsx)("group",{ref:n})}e.s(["MotionLayer",0,function({scroller:e}){let r=(0,a.useRef)(null);return(0,t.jsx)("div",{"aria-hidden":"true",className:n.default.motion,children:(0,t.jsx)("div",{className:n.default.sheet,ref:r,children:(0,t.jsx)(l.f,{camera:{far:1e3,near:.1,position:[0,0,100],zoom:1},dpr:[1,2],gl:{alpha:!0,antialias:!0},orthographic:!0,style:{pointerEvents:"none"},children:(0,t.jsx)(x,{scroller:e,sheet:r})})})})}])},680715,function(e){e.n(e.i(994110))}]);