(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,838121,e=>{"use strict";var t=e.i(685476),n=e.i(59218),r=e.i(188545),a=e.i(294425),i=e.i(988177),o=e.i(221928),l=e.i(495476),s=e.i(449689);let u=[[1,.255,.028],[1,.185,.052],[1,.115,.052],[-1,.16,.075]];function f(e,t,n,r,a=0,i=0){let o=t/2,l=n/2,s=Math.min(r,o,l);return e.moveTo(a-o+s,i-l),e.lineTo(a+o-s,i-l),e.quadraticCurveTo(a+o,i-l,a+o,i-l+s),e.lineTo(a+o,i+l-s),e.quadraticCurveTo(a+o,i+l,a+o-s,i+l),e.lineTo(a-o+s,i+l),e.quadraticCurveTo(a-o,i+l,a-o,i+l-s),e.lineTo(a-o,i-l+s),e.quadraticCurveTo(a-o,i-l,a-o+s,i-l),e}let c=(e,t,n)=>f(new i.Ow,e,t,n);function m(e,t,n){let r=new i.pY(c(e,t,n),24),a=r.attributes.uv,o=r.attributes.position;for(let n=0;n<a.count;n++)a.setXY(n,o.getX(n)/e+.5,o.getY(n)/t+.5);return a.needsUpdate=!0,r}function d(e,t,n,r){let a=e.attributes.position,o=e.attributes.normal,l=e.attributes.uv,s=e=>i.rB.clamp(e,0,1);for(let e=0;e<l.count;e++){let u=i.rB.clamp(r-a.getZ(e),0,2*r);l.setXY(e,s((a.getX(e)+o.getX(e)*u)/t+.5),s((a.getY(e)+o.getY(e)*u)/n+.5))}return l.needsUpdate=!0,e}let h=new Map;function v(e,t){let n=h.get(e.src);if(!n){let t=(0,l.D)(e);if(!t.image)return null;(n=t.clone()).needsUpdate=!0,h.set(e.src,n)}let r=n.image;if(r?.width&&r.height){let e=r.width/r.height>t?r.height*t:r.width,a=e/t;n.repeat.set(e/r.width,a/r.height),n.offset.set((r.width-e)/2/r.width,(r.height-a)/2/r.height)}return n}let p=`
  uniform float uRoom;
  varying vec2 vUv;
  void main() {
    float d = length((vUv - 0.5) * 2.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, smoothstep(1.0, 0.1, d) * (0.5 - uRoom * 0.2));
  }
`,g=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,w=`
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
`;function y(e){let t={w:e,h:e/.478,d:.13*e},n={w:t.w+2*t.d,h:t.h+2*t.d},r={x:-.275*t.w,y:.383*t.h,w:.3*t.w},a=.018*t.w,o=c(t.w-2*t.w*.018,t.h-2*t.w*.018,.155*t.w);o.holes.push(f(new i.pB,r.w+2*a,r.w+2*a,(r.w+2*a)*.3,r.x,r.y));let l=new i.Jy(o,{depth:t.d-2*a,bevelEnabled:!0,bevelThickness:a,bevelSize:a,bevelSegments:4,curveSegments:24});l.translate(0,0,-t.d/2+a);let s=d(l,n.w,n.h,t.d/2),h=u.map(([e,r,a])=>{var o,l,s,u,f;let m;return d((o=t.h*a,l=.44*t.d,s=.019*t.w,u=e*(t.w/2-.015*t.w),f=t.h*r,(m=new i.Jy(c(l,o,l/2),{depth:s,bevelEnabled:!0,bevelThickness:.6*s,bevelSize:.6*s,bevelSegments:4,curveSegments:14})).rotateY(e*Math.PI/2),m.translate(u,f,0),m),n.w,n.h,t.d/2)}),v=new i.Jy(c(.17*t.w,.42*t.d,.2*t.d),{depth:.02*t.h,bevelEnabled:!1,curveSegments:14});v.rotateX(Math.PI/2),v.translate(0,-t.h/2+.016*t.h,0);let p=c(.955*t.w,.978*t.h,.143*t.w);p.holes.push(f(new i.pB,r.w,r.w,.3*r.w,r.x,r.y));let y=new i.pY(p,24);{let e=y.attributes.uv,t=y.attributes.position;for(let r=0;r<e.count;r++)e.setXY(r,t.getX(r)/n.w+.5,t.getY(r)/n.h+.5);e.needsUpdate=!0}let b=m(.9*t.w,.955*t.h,.135*t.w),M=r.w+2*t.w*.019,S=.008*t.w,T=c(M,M,.3*M),j=r.w+2*S;T.holes.push(f(new i.pB,j,j,.3*j));let k=new i.Jy(T,{depth:.026*t.w-S,bevelEnabled:!0,bevelThickness:S,bevelSize:S,bevelSegments:5,curveSegments:28});{let e=k.attributes.uv,t=k.attributes.position;for(let a=0;a<e.count;a++)e.setXY(a,(t.getX(a)+r.x)/n.w+.5,(t.getY(a)+r.y)/n.h+.5);e.needsUpdate=!0}let E=m(1.35*r.w,1.35*r.w,.45*r.w),R=new i.aV({color:"#15161a",roughness:.36,metalness:.04}),A=new i.aV({color:"#0c0d0f",roughness:.42,metalness:.55}),C=new i.aV({color:"#08090b",roughness:.12,metalness:.5}),U=new i.Zg({vertexShader:g,fragmentShader:w,uniforms:{uHalf:{value:new i.wq(M/2,M/2)},uRadius:{value:.3*M},uSpread:{value:.018*t.w},uPlane:{value:1.4*r.w}},transparent:!0,depthWrite:!1}),z=new i.Zg({vertexShader:g,fragmentShader:x,uniforms:{uRoom:{value:0}},transparent:!0,depthWrite:!1,blending:i.tq}),B=new i.CQ(1.4*r.w,1.4*r.w),F=new i.C9;for(let e of(F.add(new i.kE(s,R)),h))F.add(new i.kE(e,R));F.add(new i.kE(v,A));let P=new i.kE(y,R);P.position.z=t.d/2+.001,F.add(P);let q=new i.C9;q.position.set(r.x,r.y,t.d/2);let Y=new i.kE(B,U);Y.position.z=.0015,q.add(Y);let O=new i.kE(k,R);O.position.z=.002,q.add(O);let W=new i.kE(E,A);W.position.z=-(.085*t.w),q.add(W),F.add(q);let X=new i.kE(b,C);X.position.z=-t.d/2-.001,X.rotation.y=Math.PI,F.add(X);let L=new i.kE(b,z);L.position.z=-t.d/2-.003,L.rotation.y=Math.PI,F.add(L);let Z=[s,...h,v,y,b,k,E,B],D=[R,A,C,U,z];return{group:F,size:t,sheet:n,print:R,rooms:[z],free:()=>{for(let e of Z)e.dispose();for(let e of D)e instanceof i.aV&&e.map?.dispose(),e.dispose()}}}function b({dark:e}){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:e?.5:.85}),(0,t.jsx)("directionalLight",{position:[4,6,8],intensity:2.4}),(0,t.jsx)("directionalLight",{position:[-6,-1,4],intensity:.7,color:"#8fa8ff"}),(0,t.jsx)("directionalLight",{position:[0,2,-8],intensity:1.1,color:"#ffd9b0"})]})}function M({pose:e,art:o,dark:l,fill:s,wide:u,hold:f,onReady:c}){let m=(0,a.useRef)(c);m.current=c;let d=(0,a.useRef)(!1),h=(0,r.f)(e=>e.viewport),w=(0,a.useRef)(null),x=(0,a.useRef)(null),S=(0,a.useMemo)(()=>Math.min(s*h.height*.478,h.width*u),[s,u,h.width,h.height]),T=(0,a.useMemo)(()=>y(S),[S]);(0,a.useEffect)(()=>()=>T.free(),[T]);let{size:j,sheet:k,print:E}=T,R=(0,a.useMemo)(()=>new i.Zg({vertexShader:g,fragmentShader:p,uniforms:{uRoom:{value:0}},transparent:!0,depthWrite:!1}),[]);return(0,a.useEffect)(()=>()=>R.dispose(),[R]),(0,n.f)((t,n)=>{let r=Math.min(n,.05),a=e.current,i=w.current,s=x.current;if(!a||!i||!s)return;let u=v(o,k.w/k.h);for(let e of(u&&E.map!==u&&(E.map=u,E.color.set("#ffffff"),E.needsUpdate=!0),E.map&&!d.current&&(d.current=!0,requestAnimationFrame(()=>m.current?.())),i.rotation.y=a.spin+a.flip*Math.PI,i.rotation.x=a.tilt,i.position.y=Math.sin(a.flip*Math.PI)*j.h*.05,R.uniforms.uRoom.value=+!l,T.rooms))e.uniforms.uRoom.value=+!l;s.position.set(.1*j.w,-(.62*j.h),-(2*j.d));let c=1+.5*Math.abs(Math.sin(i.rotation.y));if(s.scale.set(2.2*j.w*c,.5*j.h,1),f)return;let h=.05*Math.sin(35e-5*performance.now());a.spin+=(h-a.spin)*Math.min(1,.6*r),a.tilt+=(-(.5*h)-a.tilt)*Math.min(1,.6*r)}),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(b,{dark:l}),(0,t.jsx)("mesh",{ref:x,material:R,children:(0,t.jsx)("planeGeometry",{args:[1,1]})}),(0,t.jsx)("group",{ref:w,children:(0,t.jsx)("primitive",{object:T.group})})]})}e.s(["CASE_REST",0,{flip:0,spin:-.5,tilt:.06},"CaseLight",0,b,"caseHeightIn",0,function(e,t){return Math.min(.76*t*.478,.5*e)/.478/t},"caseTexture",0,v,"default",0,function(e){let n=(0,a.useRef)(null);return(0,s.f)(n),(0,t.jsx)("div",{className:e.className,ref:n,children:(0,t.jsx)(o.f,{dpr:[1,2],gl:{antialias:!0,alpha:!0},camera:{fov:38,position:[0,0,10],near:.1,far:60},resize:{offsetSize:!0,scroll:!0},children:(0,t.jsx)(M,{art:e.art,dark:e.dark,fill:e.thumb?.84:.76,hold:e.hold??!1,onReady:e.onReady,pose:e.pose,wide:e.thumb?.78:.5})})})},"makeCase",0,y])},763856,e=>{"use strict";var t=e.i(685476),n=e.i(59218),r=e.i(188545),a=e.i(294425),i=e.i(988177),o=e.i(838121),l=e.i(221928),s=e.i(859290),u=e.i(954057),f=e.i(26e3);let c={far:60,fov:32,near:.1,position:[0,.6,9]},m="#26262a";function d(e,t,n){let r=new i.Ow,a=e/2,o=t/2;return r.moveTo(-a+n,-o),r.lineTo(a-n,-o),r.quadraticCurveTo(a,-o,a,-o+n),r.lineTo(a,o-n),r.quadraticCurveTo(a,o,a-n,o),r.lineTo(-a+n,o),r.quadraticCurveTo(-a,o,-a,o-n),r.lineTo(-a,-o+n),r.quadraticCurveTo(-a,-o,-a+n,-o),r}let h=()=>new i.p$({color:"#000000",depthWrite:!1,opacity:0,toneMapped:!1,transparent:!0});function v({wares:e,room:l,run:c,swap:p,apiRef:g,onActive:w}){let x=e.length,y=(0,r.f)(e=>e.viewport),b=(0,r.f)(e=>e.size),M=(0,r.f)(e=>e.camera),S=(0,r.f)(e=>e.gl),T=(0,a.useRef)([]),j=(0,a.useRef)(-1),k=y.height/b.height,E=Math.max(160,b.height-l.head-l.foot),R=E*k,A=Math.min(.4*y.height,.2*y.width,9*R/(10.35+.95*R)),C=l.head>0||l.foot>0?.2*A:0,U=y.height/2-(l.head+E/2)*k-C,z=e.find(e=>"tee"===e.kind&&e.model)?.model??null,[B,F]=(0,a.useState)(null);(0,a.useEffect)(()=>{if(!z)return;let e=!0;return(0,s.u)(z).then(t=>{e&&F(t)},()=>{}),()=>{e=!1}},[z]);let P=(0,a.useMemo)(()=>{let t=new i.H5;return t.setCrossOrigin("anonymous"),e.map(e=>{var n;if("tee"===e.kind){if(!B)return null;let n=(0,s.g)(B,m);return t.load(e.face,e=>{e.colorSpace=i.nj,(0,s.c)(n,e)}),{base:new i.Es(m),borrowed:!0,cast:h(),geometry:B.geometry,h:A,materials:[n],scale:A,w:B.wide*A}}if("case"===e.kind){let e=(0,o.makeCase)(.478*A);return{base:new i.Es("#ffffff"),cast:h(),free:e.free,geometry:null,group:e.group,h:e.size.h,kit:e,lit:!0,materials:[e.print],w:e.size.w}}let{shape:r,w:a,h:l,deep:c}=(n=e.kind,"box"===n?{deep:.055*A,h:A,shape:d(.72*A,A,.02*A),w:.72*A}:{deep:.008*A,h:A,shape:d(.72*A,A,.004*A),w:.72*A}),v=new i.Jy(r,{bevelEnabled:!0,bevelSegments:2,bevelSize:.006*Math.min(a,l),bevelThickness:.18*c,curveSegments:12,depth:c});if(v.center(),"box"===e.kind){let e=v.attributes.uv,t=v.attributes.position;for(let n=0;n<e.count;n++)e.setXY(n,t.getX(n)/a+.5,t.getY(n)/l+.5);e.needsUpdate=!0}let p="box"===e.kind?(0,f.makeJigsawSheet)():new i.p$({toneMapped:!1,transparent:!0}),g=new i.p$({color:u.M,toneMapped:!1});return t.load(e.face,e=>{if(e.colorSpace=i.nj,p instanceof i.Zg){let t=e.image;p.uniforms.uTex.value=e,p.uniforms.uImg.value.set(t.width,t.height),p.uniforms.uW.value=a,p.uniforms.uH.value=l,p.uniforms.uGrid.value.set(12,Math.round(12*l/a)),g.color.set(u.F);return}let t=e.image,n=a/l,r=t.width/t.height;e.repeat.set((n>r?1:n/r)/a,(n>r?r/n:1)/l),e.offset.set(.5,.5),p.map=e,p.needsUpdate=!0,g.color.set(u.F)}),{base:new i.Es("#ffffff"),borrowed:!1,cast:h(),geometry:v,h:l,materials:[p,g],scale:1,w:a}})},[e,A,B]);(0,a.useEffect)(()=>()=>{for(let e of P)if(e){if(e.free){e.free(),e.cast.dispose();continue}e.borrowed||e.geometry?.dispose(),e.cast.dispose(),e.materials.forEach(u.Q)}},[P]);let q=(0,a.useRef)(new Float32Array(0)),Y=(0,a.useRef)(new Float32Array(0));return q.current.length!==x&&(q.current=new Float32Array(x),Y.current=new Float32Array(x)),g.current={centre:()=>{let e=T.current[j.current],t=e?.children[0],n=S.domElement.getBoundingClientRect();if(!t)return{height:0,left:0,top:0,width:0};e.updateWorldMatrix(!0,!0);let r=new i.VQ().setFromObject(t),a=1/0,o=1/0,l=-1/0,s=-1/0,u=new i.cE;for(let e=0;e<8;e++){u.set(1&e?r.max.x:r.min.x,2&e?r.max.y:r.min.y,4&e?r.max.z:r.min.z).project(M);let t=n.left+(u.x+1)/2*n.width,i=n.top+(1-u.y)/2*n.height;a=Math.min(a,t),l=Math.max(l,t),o=Math.min(o,i),s=Math.max(s,i)}return{height:s-o,left:a,top:o,width:l-a}},turn:()=>{let e=T.current[j.current];return e?{x:e.rotation.x,y:e.rotation.y}:{x:0,y:0}},under:e=>{let t=e*(y.width/2),n=null,r=1/0;for(let e=0;e<x;e++){let a=Math.abs(q.current[e]-t);a>.7*Y.current[e]||a>=r||(r=a,n=e-Math.round(c.current.pos))}return n}},(0,n.f)(t=>{let n=(0,u.q)(t.clock.elapsedTime),r=1/0,a=0;for(let t=0;t<x;t++){var l,s,f;let m=T.current[t],d=P[t];if(!m||!d)continue;let h=t-c.current.pos,v=Math.exp(-((h/.85)**2)),g=(0,u.R)(t+2);m.position.set(h*A*1.5*.92,U+(g-.5)*A*.16+v*A*.2,-(1.9*Math.abs(h)*.45)+(g-.5)*A*.5+v*A*.9),m.rotation.set(-.34+.3*v+.02*Math.sin(.5*n+6.3*g),(-.85+.5*g+.16*Math.sin(.32*(l=n)+6.28*(s=g)))*(1-(f=v))+.05*Math.sin(.5*l+s)*f,(g-.5)*.14*(1-v));let w=m.getObjectByName("cast");w&&(w.visible=!1),m.scale.setScalar(1+.08*v),q.current[t]=m.position.x,Y.current[t]=d.w;let x=p?.current;m.visible=!(x?.middle==="clear"&&x.at>0&&v>.5);let y=(0,u.O)(1.5-.34*Math.abs(h),0,1)*(e[t].open?1:.55);for(let e of d.materials)e.opacity=y,e.transparent=!0,e instanceof i.Zg&&e.uniforms.uAlpha&&(e.uniforms.uAlpha.value=y);let b=d.kit;if(b&&!b.print.map){let n=(0,o.caseTexture)({kind:"image",src:e[t].face},b.sheet.w/b.sheet.h);n&&(b.print.map=n,b.print.color.set("#ffffff"),b.print.needsUpdate=!0)}let M=d.materials[0],S=.66+.34*v;d.lit||(M instanceof i.p$?M.color.copy(d.base).multiplyScalar(S):M instanceof i.Zg&&M.uniforms.uBuild?(M.uniforms.uBuild.value=.97+.03*v,M.uniforms.uNear.value=.5*v,M.uniforms.uLight.value.set(-.42,.58,.86).normalize()):M instanceof i.Zg&&M.uniforms.uTint&&(M.uniforms.uTint.value=S)),Math.abs(h)<r&&(r=Math.abs(h),a=t)}a!==j.current&&(j.current=a,w(a))}),(0,t.jsxs)(t.Fragment,{children:[e.some(e=>"case"===e.kind)?(0,t.jsx)(o.CaseLight,{dark:!1}):null,P.map((n,r)=>n?(0,t.jsxs)("group",{ref:e=>{T.current[r]=e},children:[n.group?(0,t.jsx)("primitive",{object:n.group}):(0,t.jsx)("mesh",{geometry:n.geometry,material:n.materials.length>1?n.materials:n.materials[0],scale:n.scale}),(0,t.jsx)("mesh",{material:n.cast,name:"cast",rotation:[-.02,0,0],children:(0,t.jsx)("planeGeometry",{args:[1,1]})})]},e[r].face+e[r].kind):null)]})}e.s(["WaresScene",0,function({room:e={foot:0,head:0},...n}){return(0,t.jsx)(l.f,{camera:c,dpr:[1,2],flat:!0,gl:{alpha:!0,antialias:!0},style:{height:"100%",width:"100%"},children:(0,t.jsx)(v,{room:e,...n})})}])},401968,function(e){e.n(e.i(763856))},859290,e=>{"use strict";var t=e.i(988177),n=e.i(585582),r=e.i(344420);let a=new Map;function i(){let e=new t.U7(new Uint8Array([128,128,255,255]),1,1);return e.needsUpdate=!0,e}let o=`
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
`;e.s(["u",0,function(e){let o=a.get(e);return o||(o=new Promise((a,o)=>{let l=new r.f().setMeshoptDecoder(n.f);l.setCrossOrigin("anonymous"),l.load(e,e=>{let n=null;if(e.scene.traverse(e=>{!n&&e.isMesh&&(n=e)}),!n)return o(Error("no mesh in the garment"));let r=n,l=r.geometry;(function(e){for(let n of["position","normal","uv"]){let r=e.getAttribute(n);if(!r)continue;let a=r.itemSize,i=new Float32Array(r.count*a);for(let e=0;e<r.count;e++)for(let t=0;t<a;t++)i[e*a+t]=r.getComponent(e,t);e.setAttribute(n,new t.f5(i,a))}})(l),r.updateWorldMatrix(!0,!1),l.applyMatrix4(r.matrixWorld),l.computeBoundingBox();let s=l.boundingBox,u=s.max.y-s.min.y,f=s.getCenter(new t.cE);l.translate(-f.x,-f.y,-f.z),l.scale(1/u,1/u,1/u),l.computeBoundingBox();let c=l.boundingBox,m=r.material;for(let e of[m.map,m.normalMap])e&&(e.wrapS=e.wrapT=t.FP,e.needsUpdate=!0);m.map&&(m.map.colorSpace=t.nj),a({geometry:l,weave:m.map??i(),bump:m.normalMap??i(),wide:c.max.x-c.min.x})},void 0,o)}),a.set(e,o),o.catch(()=>a.delete(e))),o},"g",0,function(e,n){return new t.Zg({vertexShader:o,fragmentShader:l,transparent:!0,side:t.Vs,uniforms:{uCloth:{value:new t.Es(n)},uTint:{value:1},uAlpha:{value:1},uWeave:{value:e.weave},uBump:{value:e.bump},uArt:{value:null},uArtOn:{value:0},uArtBox:{value:new t.$i(0,.07,.3,.3)},uLight:{value:new t.cE(-.42,.62,.86)}}})},"c",0,function(e,t){let n=t.image,r=.3*(n.height/n.width);e.uniforms.uArt.value=t,e.uniforms.uArtOn.value=1,e.uniforms.uArtBox.value.set(0,.07,.3,r)}])}]);