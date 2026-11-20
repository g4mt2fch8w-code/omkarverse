(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,499694,(e,t,n)=>{"use strict";var r=e.r(294425),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},o=r.useState,a=r.useEffect,l=r.useLayoutEffect,u=r.useDebugValue;function s(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!i(e,n)}catch(e){return!0}}var c="u"<typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=o({inst:{value:n,getSnapshot:t}}),i=r[0].inst,c=r[1];return l(function(){i.value=n,i.getSnapshot=t,s(i)&&c({inst:i})},[e,n,t]),a(function(){return s(i)&&c({inst:i}),e(function(){s(i)&&c({inst:i})})},[e]),u(n),n};n.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:c},643117,(e,t,n)=>{"use strict";var r=e.r(294425),i=e.r(791863),o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=i.useSyncExternalStore,l=r.useRef,u=r.useEffect,s=r.useMemo,c=r.useDebugValue;n.useSyncExternalStoreWithSelector=function(e,t,n,r,i){var d=l(null);if(null===d.current){var f={hasValue:!1,value:null};d.current=f}else f=d.current;var v=a(e,(d=s(function(){function e(e){if(!u){if(u=!0,a=e,e=r(e),void 0!==i&&f.hasValue){var t=f.value;if(i(t,e))return l=t}return l=e}if(t=l,o(a,e))return t;var n=r(e);return void 0!==i&&i(t,n)?(a=e,t):(a=e,l=n)}var a,l,u=!1,s=void 0===n?null:n;return[function(){return e(t())},null===s?void 0:function(){return e(s())}]},[t,n,r,i]))[0],d[1]);return u(function(){f.hasValue=!0,f.value=v},[v]),c(v),v}},791863,(e,t,n)=>{"use strict";e.i(432979),t.exports=e.r(499694)},84941,(e,t,n)=>{"use strict";e.i(432979),t.exports=e.r(643117)},568180,e=>{e.v({scene:"_077niW_scene"})},573640,e=>{"use strict";var t=e.i(685476),n=e.i(935335),r=e.i(838121),i=e.i(703889),o=e.i(568180);let a={case:{heightIn:r.caseHeightIn,rest:{x:r.CASE_REST.tilt,y:r.CASE_REST.spin}},tee:{heightIn:n.teeHeightIn,rest:{x:.04*Math.sin(.5*n.TEE_REST),y:n.TEE_REST}}};e.s(["default",0,function({model:e,pose:l,turn:u,onReady:s}){let[c]=(0,i.useTheme)(),d=()=>s(a[e.kind]);return"case"===e.kind?(0,t.jsx)(r.default,{art:{kind:"image",src:e.art},className:o.default.scene,dark:c,hold:!0,onReady:d,pose:l}):e.url?(0,t.jsx)(n.default,{art:e.art,className:o.default.scene,hold:!0,modelUrl:e.url,onReady:d,turn:u}):null}])},935335,e=>{"use strict";var t=e.i(685476),n=e.i(59218),r=e.i(188545),i=e.i(294425),o=e.i(988177),a=e.i(221928),l=e.i(859290),u=e.i(449689);function s({art:e,fill:a,modelUrl:u,turn:c,wide:d,hold:f,onReady:v}){let m=(0,r.f)(e=>e.viewport),h=(0,i.useRef)(v);h.current=v;let[p,w]=(0,i.useState)(!1),[g,x]=(0,i.useState)(null);(0,i.useEffect)(()=>{let e=!0;return(0,l.u)(u).then(t=>{e&&x(t)}).catch(e=>console.error("Could not load the shirt",e)),()=>{e=!1}},[u]);let y=Math.min(m.height*a,m.width*d),E=(0,i.useMemo)(()=>{if(!g)return null;let e=(0,l.g)(g,"#26262a"),t=new o.kE(g.geometry,e);t.scale.setScalar(y);let n=new o.C9;return n.add(t),{cloth:e,group:n}},[g,y]);return((0,i.useEffect)(()=>{if(!E)return;let t=new o.H5;t.setCrossOrigin("anonymous");let n=!0;return t.load(e,e=>{if(!n)return e.dispose();e.colorSpace=o.nj,(0,l.c)(E.cloth,e),w(!0)}),()=>{n=!1}},[e,E]),(0,i.useEffect)(()=>()=>{E?.cloth.dispose()},[E]),(0,i.useEffect)(()=>{if(!p)return;let e=requestAnimationFrame(()=>h.current?.());return()=>cancelAnimationFrame(e)},[p]),(0,n.f)((e,t)=>{let n=E?.group;if(!n)return;let r=Math.min(t,1/30),i=c.current;f||(i.vel*=.94,i.at+=(i.vel+.12*r)%(2*Math.PI)),n.rotation.y=i.at,n.rotation.x=.04*Math.sin(.5*i.at)}),E)?(0,t.jsx)("primitive",{object:E.group}):null}e.s(["TEE_REST",0,-.35,"default",0,function({art:e,className:n,modelUrl:r,thumb:o=!1,turn:l,hold:c=!1,onReady:d}){let f=(0,i.useRef)(null);return(0,u.f)(f),(0,t.jsx)("div",{className:n,ref:f,children:(0,t.jsx)(a.f,{camera:{far:40,fov:30,near:.1,position:[0,0,7]},dpr:[1,2],flat:!0,gl:{alpha:!0,antialias:!0},resize:{offsetSize:!0,scroll:!0},children:(0,t.jsx)(s,{art:e,fill:o?.98:.94,hold:c,modelUrl:r,onReady:d,turn:l,wide:.86})})})},"teeHeightIn",0,function(e,t){return Math.min(.94*t,.86*e)/t}])},838121,e=>{"use strict";var t=e.i(685476),n=e.i(59218),r=e.i(188545),i=e.i(294425),o=e.i(988177),a=e.i(221928),l=e.i(495476),u=e.i(449689);let s=[[1,.255,.028],[1,.185,.052],[1,.115,.052],[-1,.16,.075]];function c(e,t,n,r,i=0,o=0){let a=t/2,l=n/2,u=Math.min(r,a,l);return e.moveTo(i-a+u,o-l),e.lineTo(i+a-u,o-l),e.quadraticCurveTo(i+a,o-l,i+a,o-l+u),e.lineTo(i+a,o+l-u),e.quadraticCurveTo(i+a,o+l,i+a-u,o+l),e.lineTo(i-a+u,o+l),e.quadraticCurveTo(i-a,o+l,i-a,o+l-u),e.lineTo(i-a,o-l+u),e.quadraticCurveTo(i-a,o-l,i-a+u,o-l),e}let d=(e,t,n)=>c(new o.Ow,e,t,n);function f(e,t,n){let r=new o.pY(d(e,t,n),24),i=r.attributes.uv,a=r.attributes.position;for(let n=0;n<i.count;n++)i.setXY(n,a.getX(n)/e+.5,a.getY(n)/t+.5);return i.needsUpdate=!0,r}function v(e,t,n,r){let i=e.attributes.position,a=e.attributes.normal,l=e.attributes.uv,u=e=>o.rB.clamp(e,0,1);for(let e=0;e<l.count;e++){let s=o.rB.clamp(r-i.getZ(e),0,2*r);l.setXY(e,u((i.getX(e)+a.getX(e)*s)/t+.5),u((i.getY(e)+a.getY(e)*s)/n+.5))}return l.needsUpdate=!0,e}let m=new Map;function h(e,t){let n=m.get(e.src);if(!n){let t=(0,l.D)(e);if(!t.image)return null;(n=t.clone()).needsUpdate=!0,m.set(e.src,n)}let r=n.image;if(r?.width&&r.height){let e=r.width/r.height>t?r.height*t:r.width,i=e/t;n.repeat.set(e/r.width,i/r.height),n.offset.set((r.width-e)/2/r.width,(r.height-i)/2/r.height)}return n}let p=`
  uniform float uRoom;
  varying vec2 vUv;
  void main() {
    float d = length((vUv - 0.5) * 2.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, smoothstep(1.0, 0.1, d) * (0.5 - uRoom * 0.2));
  }
`,w=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,g=`
  uniform vec2 uHalf;
  uniform float uRadius;
  uniform float uSpread;
  uniform float uPlane;
  varying vec2 vUv;

  float rbox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * uPlane;
    float d = rbox(p, uHalf, uRadius);
    float a = smoothstep(uSpread, 0.0, d) * 0.6 * step(0.0, d);
    gl_FragColor = vec4(0.0, 0.0, 0.0, a);
  }
`,x=`
  uniform float uRoom;
  varying vec2 vUv;
  void main() {
    float band = smoothstep(0.42, 0.0, abs((vUv.x - vUv.y * 0.55) - 0.28));
    float fall = smoothstep(0.0, 0.55, vUv.y);
    gl_FragColor = vec4(vec3(0.62, 0.68, 0.82), band * fall * (0.16 + uRoom * 0.14));
  }
`;function y(e){let t={w:e,h:e/.478,d:.13*e},n={w:t.w+2*t.d,h:t.h+2*t.d},r={x:-.275*t.w,y:.383*t.h,w:.3*t.w},i=.018*t.w,a=d(t.w-2*t.w*.018,t.h-2*t.w*.018,.155*t.w);a.holes.push(c(new o.pB,r.w+2*i,r.w+2*i,(r.w+2*i)*.3,r.x,r.y));let l=new o.Jy(a,{depth:t.d-2*i,bevelEnabled:!0,bevelThickness:i,bevelSize:i,bevelSegments:4,curveSegments:24});l.translate(0,0,-t.d/2+i);let u=v(l,n.w,n.h,t.d/2),m=s.map(([e,r,i])=>{var a,l,u,s,c;let f;return v((a=t.h*i,l=.44*t.d,u=.019*t.w,s=e*(t.w/2-.015*t.w),c=t.h*r,(f=new o.Jy(d(l,a,l/2),{depth:u,bevelEnabled:!0,bevelThickness:.6*u,bevelSize:.6*u,bevelSegments:4,curveSegments:14})).rotateY(e*Math.PI/2),f.translate(s,c,0),f),n.w,n.h,t.d/2)}),h=new o.Jy(d(.17*t.w,.42*t.d,.2*t.d),{depth:.02*t.h,bevelEnabled:!1,curveSegments:14});h.rotateX(Math.PI/2),h.translate(0,-t.h/2+.016*t.h,0);let p=d(.955*t.w,.978*t.h,.143*t.w);p.holes.push(c(new o.pB,r.w,r.w,.3*r.w,r.x,r.y));let y=new o.pY(p,24);{let e=y.attributes.uv,t=y.attributes.position;for(let r=0;r<e.count;r++)e.setXY(r,t.getX(r)/n.w+.5,t.getY(r)/n.h+.5);e.needsUpdate=!0}let E=f(.9*t.w,.955*t.h,.135*t.w),b=r.w+2*t.w*.019,S=.008*t.w,M=d(b,b,.3*b),T=r.w+2*S;M.holes.push(c(new o.pB,T,T,.3*T));let R=new o.Jy(M,{depth:.026*t.w-S,bevelEnabled:!0,bevelThickness:S,bevelSize:S,bevelSegments:5,curveSegments:28});{let e=R.attributes.uv,t=R.attributes.position;for(let i=0;i<e.count;i++)e.setXY(i,(t.getX(i)+r.x)/n.w+.5,(t.getY(i)+r.y)/n.h+.5);e.needsUpdate=!0}let j=f(1.35*r.w,1.35*r.w,.45*r.w),C=new o.aV({color:"#15161a",roughness:.36,metalness:.04}),U=new o.aV({color:"#0c0d0f",roughness:.42,metalness:.55}),A=new o.aV({color:"#08090b",roughness:.12,metalness:.5}),k=new o.Zg({vertexShader:w,fragmentShader:g,uniforms:{uHalf:{value:new o.wq(b/2,b/2)},uRadius:{value:.3*b},uSpread:{value:.018*t.w},uPlane:{value:1.4*r.w}},transparent:!0,depthWrite:!1}),z=new o.Zg({vertexShader:w,fragmentShader:x,uniforms:{uRoom:{value:0}},transparent:!0,depthWrite:!1,blending:o.tq}),B=new o.CQ(1.4*r.w,1.4*r.w),P=new o.C9;for(let e of(P.add(new o.kE(u,C)),m))P.add(new o.kE(e,C));P.add(new o.kE(h,U));let F=new o.kE(y,C);F.position.z=t.d/2+.001,P.add(F);let I=new o.C9;I.position.set(r.x,r.y,t.d/2);let V=new o.kE(B,k);V.position.z=.0015,I.add(V);let O=new o.kE(R,C);O.position.z=.002,I.add(O);let _=new o.kE(j,U);_.position.z=-(.085*t.w),I.add(_),P.add(I);let q=new o.kE(E,A);q.position.z=-t.d/2-.001,q.rotation.y=Math.PI,P.add(q);let L=new o.kE(E,z);L.position.z=-t.d/2-.003,L.rotation.y=Math.PI,P.add(L);let W=[u,...m,h,y,E,R,j,B],Y=[C,U,A,k,z];return{group:P,size:t,sheet:n,print:C,rooms:[z],free:()=>{for(let e of W)e.dispose();for(let e of Y)e instanceof o.aV&&e.map?.dispose(),e.dispose()}}}function E({dark:e}){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:e?.5:.85}),(0,t.jsx)("directionalLight",{position:[4,6,8],intensity:2.4}),(0,t.jsx)("directionalLight",{position:[-6,-1,4],intensity:.7,color:"#8fa8ff"}),(0,t.jsx)("directionalLight",{position:[0,2,-8],intensity:1.1,color:"#ffd9b0"})]})}function b({pose:e,art:a,dark:l,fill:u,wide:s,hold:c,onReady:d}){let f=(0,i.useRef)(d);f.current=d;let v=(0,i.useRef)(!1),m=(0,r.f)(e=>e.viewport),g=(0,i.useRef)(null),x=(0,i.useRef)(null),S=(0,i.useMemo)(()=>Math.min(u*m.height*.478,m.width*s),[u,s,m.width,m.height]),M=(0,i.useMemo)(()=>y(S),[S]);(0,i.useEffect)(()=>()=>M.free(),[M]);let{size:T,sheet:R,print:j}=M,C=(0,i.useMemo)(()=>new o.Zg({vertexShader:w,fragmentShader:p,uniforms:{uRoom:{value:0}},transparent:!0,depthWrite:!1}),[]);return(0,i.useEffect)(()=>()=>C.dispose(),[C]),(0,n.f)((t,n)=>{let r=Math.min(n,.05),i=e.current,o=g.current,u=x.current;if(!i||!o||!u)return;let s=h(a,R.w/R.h);for(let e of(s&&j.map!==s&&(j.map=s,j.color.set("#ffffff"),j.needsUpdate=!0),j.map&&!v.current&&(v.current=!0,requestAnimationFrame(()=>f.current?.())),o.rotation.y=i.spin+i.flip*Math.PI,o.rotation.x=i.tilt,o.position.y=Math.sin(i.flip*Math.PI)*T.h*.05,C.uniforms.uRoom.value=+!l,M.rooms))e.uniforms.uRoom.value=+!l;u.position.set(.1*T.w,-(.62*T.h),-(2*T.d));let d=1+.5*Math.abs(Math.sin(o.rotation.y));if(u.scale.set(2.2*T.w*d,.5*T.h,1),c)return;let m=.05*Math.sin(35e-5*performance.now());i.spin+=(m-i.spin)*Math.min(1,.6*r),i.tilt+=(-(.5*m)-i.tilt)*Math.min(1,.6*r)}),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(E,{dark:l}),(0,t.jsx)("mesh",{ref:x,material:C,children:(0,t.jsx)("planeGeometry",{args:[1,1]})}),(0,t.jsx)("group",{ref:g,children:(0,t.jsx)("primitive",{object:M.group})})]})}e.s(["CASE_REST",0,{flip:0,spin:-.5,tilt:.06},"CaseLight",0,E,"caseHeightIn",0,function(e,t){return Math.min(.76*t*.478,.5*e)/.478/t},"caseTexture",0,h,"default",0,function(e){let n=(0,i.useRef)(null);return(0,u.f)(n),(0,t.jsx)("div",{className:e.className,ref:n,children:(0,t.jsx)(a.f,{dpr:[1,2],gl:{antialias:!0,alpha:!0},camera:{fov:38,position:[0,0,10],near:.1,far:60},resize:{offsetSize:!0,scroll:!0},children:(0,t.jsx)(b,{art:e.art,dark:e.dark,fill:e.thumb?.84:.76,hold:e.hold??!1,onReady:e.onReady,pose:e.pose,wide:e.thumb?.78:.5})})})},"makeCase",0,y])},859290,e=>{"use strict";var t=e.i(988177),n=e.i(585582),r=e.i(344420);let i=new Map;function o(){let e=new t.U7(new Uint8Array([128,128,255,255]),1,1);return e.needsUpdate=!0,e}let a=`
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNrm;
  varying vec3 vRaw;
  varying vec3 vEye;

  void main() {
    vUv = uv;
    vPos = position;
    vRaw = normal;
    vNrm = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vEye = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,l=`
  uniform vec3 uCloth;
  uniform float uTint;
  uniform float uAlpha;
  uniform sampler2D uWeave;
  uniform sampler2D uBump;
  uniform sampler2D uArt;
  uniform float uArtOn;
  uniform vec4 uArtBox;
  uniform vec3 uLight;

  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNrm;
  varying vec3 vRaw;
  varying vec3 vEye;

  void main() {
    vec3 lean = texture2D(uBump, vUv).xyz * 2.0 - 1.0;
    vec3 n = normalize(vNrm + vec3(lean.xy, 0.0) * 0.6);
    if (!gl_FrontFacing) n = -n;

    vec3 lamp = normalize(uLight);
    float lam = dot(n, lamp) * 0.5 + 0.5;
    float lit = 0.46 + 1.15 * lam * lam;
    float sheen = pow(1.0 - max(dot(n, vEye), 0.0), 2.2) * 0.3;

    float grain = texture2D(uWeave, vUv * 3.0).r;
    vec3 c = uCloth * lit * mix(0.9, 1.12, grain) + sheen;

    if (uArtOn > 0.5) {
      vec2 a = (vPos.xy - uArtBox.xy) / uArtBox.zw + 0.5;
      float inside = step(0.0, a.x) * step(a.x, 1.0) * step(0.0, a.y) * step(a.y, 1.0);
      float facing = smoothstep(0.25, 0.7, vRaw.z);
      vec4 ink = texture2D(uArt, a);
      vec3 printed = ink.rgb * lit * mix(0.94, 1.06, grain);
      c = mix(c, printed, inside * facing * ink.a);
    }

    gl_FragColor = vec4(c * uTint, uAlpha);
  }
`;e.s(["u",0,function(e){let a=i.get(e);return a||(a=new Promise((i,a)=>{let l=new r.f().setMeshoptDecoder(n.f);l.setCrossOrigin("anonymous"),l.load(e,e=>{let n=null;if(e.scene.traverse(e=>{!n&&e.isMesh&&(n=e)}),!n)return a(Error("no mesh in the garment"));let r=n,l=r.geometry;(function(e){for(let n of["position","normal","uv"]){let r=e.getAttribute(n);if(!r)continue;let i=r.itemSize,o=new Float32Array(r.count*i);for(let e=0;e<r.count;e++)for(let t=0;t<i;t++)o[e*i+t]=r.getComponent(e,t);e.setAttribute(n,new t.f5(o,i))}})(l),r.updateWorldMatrix(!0,!1),l.applyMatrix4(r.matrixWorld),l.computeBoundingBox();let u=l.boundingBox,s=u.max.y-u.min.y,c=u.getCenter(new t.cE);l.translate(-c.x,-c.y,-c.z),l.scale(1/s,1/s,1/s),l.computeBoundingBox();let d=l.boundingBox,f=r.material;for(let e of[f.map,f.normalMap])e&&(e.wrapS=e.wrapT=t.FP,e.needsUpdate=!0);f.map&&(f.map.colorSpace=t.nj),i({geometry:l,weave:f.map??o(),bump:f.normalMap??o(),wide:d.max.x-d.min.x})},void 0,a)}),i.set(e,a),a.catch(()=>i.delete(e))),a},"g",0,function(e,n){return new t.Zg({vertexShader:a,fragmentShader:l,transparent:!0,side:t.Vs,uniforms:{uCloth:{value:new t.Es(n)},uTint:{value:1},uAlpha:{value:1},uWeave:{value:e.weave},uBump:{value:e.bump},uArt:{value:null},uArtOn:{value:0},uArtBox:{value:new t.$i(0,.07,.3,.3)},uLight:{value:new t.cE(-.42,.62,.86)}}})},"c",0,function(e,t){let n=t.image,r=.3*(n.height/n.width);e.uniforms.uArt.value=t,e.uniforms.uArtOn.value=1,e.uniforms.uArtBox.value.set(0,.07,.3,r)}])},495476,e=>{"use strict";var t=e.i(988177);let n=5/7,r=new Map,i=new Map;function o(e){e.paused&&e.duration&&e.currentTime<.05&&(e.currentTime=Math.min(1.6,.35*e.duration))}function a(e){let t=r.get(e);if(!t){let n;(t=document.createElement("video")).src=e,t.muted=!0,t.loop=!0,t.playsInline=!0,t.crossOrigin="anonymous",t.preload="auto";let i=t;i.addEventListener("loadedmetadata",()=>o(i)),(!(n=document.getElementById("print-video-host"))&&((n=document.createElement("div")).id="print-video-host",n.setAttribute("aria-hidden","true"),n.style.cssText="position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none",document.body.appendChild(n)),n).appendChild(i),i.load(),r.set(e,t)}return t}function l(e,t,r){if(!t||!r)return;let i=t/r>n?r*n:t,o=i/n;e.repeat.set(i/t,o/r),e.offset.set((t-i)/2/t,(r-o)/2/r)}function u(e){return e.colorSpace=t.nj,e.minFilter=t.VV,e.magFilter=t.VV,e}let s=null;e.s(["r",0,n,"D",0,function(e,n=!1,r){let o=n?`${e.src}|whole`:e.src,c=i.get(o);if(c)return i.delete(o),i.set(o,c),r?.(c),c;if("video"===e.kind){let i=a(e.src),o=u(new t.TS(i));n||(i.readyState>=1?l(o,i.videoWidth,i.videoHeight):i.addEventListener("loadedmetadata",()=>l(o,i.videoWidth,i.videoHeight),{once:!0})),i.addEventListener("seeked",()=>{o.needsUpdate=!0}),c=o,r?.(o)}else c=u((!s&&(s=new t.H5).setCrossOrigin("anonymous"),s).load(e.src,e=>{if(!n){let t=e.image;l(e,t.width,t.height),e.needsUpdate=!0}r?.(e)}));return i.set(o,c),!function(){for(let[e,n]of i){if(i.size<=36)return;n instanceof t.TS||(n.dispose(),i.delete(e))}}(),c},"F",0,function(){r.forEach(e=>{e.pause()})},"o",0,function(e,t,n){let r=e.filter(e=>"image"===e.kind).slice(0,t);return r.length?new Promise(e=>{let t=r.length,i=!1,o=()=>{i||(i=!0,e())},a=()=>{--t<=0&&o()};for(let e of r){let t=new Image;t.onload=a,t.onerror=a,t.src=e.src}setTimeout(o,n)}):Promise.resolve()},"c",0,function(e,t){if("video"!==e.kind)return;let n=a(e.src);t?n.play().catch(()=>o(n)):(n.pause(),o(n))}])},449689,e=>{"use strict";var t=e.i(294425);e.s(["f",0,function(e){(0,t.useEffect)(()=>{let t=e.current;if(!t)return;let n=performance.now(),r=0,i=()=>{if(performance.now()-n>8e3)return;let e=t.querySelector("canvas");if(e&&300===e.width&&150===e.height){let{height:e,width:n}=t.getBoundingClientRect();n>300&&e>150&&window.dispatchEvent(new Event("resize"))}r=window.setTimeout(i,100)};return r=window.setTimeout(i,0),()=>clearTimeout(r)},[e])}])}]);