(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,499694,(e,t,i)=>{"use strict";var r=e.r(294425),n="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=r.useState,o=r.useEffect,s=r.useLayoutEffect,l=r.useDebugValue;function u(e){var t=e.getSnapshot;e=e.value;try{var i=t();return!n(e,i)}catch(e){return!0}}var d="u"<typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var i=t(),r=a({inst:{value:i,getSnapshot:t}}),n=r[0].inst,d=r[1];return s(function(){n.value=i,n.getSnapshot=t,u(n)&&d({inst:n})},[e,i,t]),o(function(){return u(n)&&d({inst:n}),e(function(){u(n)&&d({inst:n})})},[e]),l(i),i};i.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:d},643117,(e,t,i)=>{"use strict";var r=e.r(294425),n=e.r(791863),a="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},o=n.useSyncExternalStore,s=r.useRef,l=r.useEffect,u=r.useMemo,d=r.useDebugValue;i.useSyncExternalStoreWithSelector=function(e,t,i,r,n){var c=s(null);if(null===c.current){var f={hasValue:!1,value:null};c.current=f}else f=c.current;var h=o(e,(c=u(function(){function e(e){if(!l){if(l=!0,o=e,e=r(e),void 0!==n&&f.hasValue){var t=f.value;if(n(t,e))return s=t}return s=e}if(t=s,a(o,e))return t;var i=r(e);return void 0!==n&&n(t,i)?(o=e,t):(o=e,s=i)}var o,s,l=!1,u=void 0===i?null:i;return[function(){return e(t())},null===u?void 0:function(){return e(u())}]},[t,i,r,n]))[0],c[1]);return l(function(){f.hasValue=!0,f.value=h},[h]),d(h),h}},791863,(e,t,i)=>{"use strict";e.i(432979),t.exports=e.r(499694)},84941,(e,t,i)=>{"use strict";e.i(432979),t.exports=e.r(643117)},783425,e=>{e.v({all:"cgCHVa_all",content:"cgCHVa_content",go:"cgCHVa_go",head:"cgCHVa_head",inner:"cgCHVa_inner",list:"cgCHVa_list",meta:"cgCHVa_meta",motion:"cgCHVa_motion",note:"cgCHVa_note",price:"cgCHVa_price",row:"cgCHVa_row",rows:"cgCHVa_rows",section:"cgCHVa_section",sectionHead:"cgCHVa_sectionHead",sheet:"cgCHVa_sheet",text:"cgCHVa_text",thumb:"cgCHVa_thumb",title:"cgCHVa_title"})},475788,606836,e=>{"use strict";var t=e.i(685476),i=e.i(892991),r=e.i(402349),n=e.i(515332),a=e.i(294425),o=e.i(634416),s=e.i(508446),l=e.i(910492),u=e.i(978589),d=e.i(783425);let c=(0,i.default)(()=>e.A(565294).then(e=>e.MotionLayer),{loadableGenerated:{modules:[680715]},ssr:!1});e.s(["f",0,function({head:e,label:i,sections:f}){let h=(0,n.useRouter)(),m=(0,s.I)(),v="motion"===(0,u.useListStyle)(),p=(0,a.useRef)(new Map),[g,w]=(0,a.useState)(null);(0,a.useEffect)(()=>(0,l.f)(!1),[]);let _=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let e=_.current;if(!e)return;let t=Array.from(e.querySelectorAll("[data-reveal]:not([data-shown])"));if(!t.length)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){for(let e of t)e.dataset.shown="";return}let i=new IntersectionObserver(e=>{e.filter(e=>e.isIntersecting).sort((e,t)=>e.boundingClientRect.top-t.boundingClientRect.top).forEach((e,t)=>{let r=e.target;r.style.setProperty("--reveal-delay",`${55*Math.min(t,8)}ms`),r.dataset.shown="",i.unobserve(r)})},{root:e,rootMargin:"0px 0px -6% 0px",threshold:.12});for(let e of t)i.observe(e);return()=>i.disconnect()},[f]),(0,a.useEffect)(()=>{g&&(!m||"down"===m.phase)&&w(null)},[g,m]),(0,t.jsx)("div",{className:d.default.list,"data-motion":v?"":void 0,ref:_,children:(0,t.jsxs)("div",{className:d.default.content,children:[v?(0,t.jsx)(c,{scroller:_},f.map(e=>e.key).join()):null,(0,t.jsxs)("div",{className:d.default.inner,children:[e?(0,t.jsx)("div",{className:d.default.head,children:e}):null,f.map(e=>(0,t.jsxs)("section",{"aria-label":e.title??i,className:d.default.section,children:[e.title?(0,t.jsxs)("header",{className:d.default.sectionHead,"data-reveal":"",children:[(0,t.jsx)("h2",{"data-gl":"heading",children:e.title}),e.note?(0,t.jsx)("span",{className:d.default.note,children:e.note}):null,e.href?(0,t.jsxs)(r.default,{className:d.default.all,href:e.href,children:[e.link??"View all",(0,t.jsx)("span",{"aria-hidden":"true",children:" →"})]}):null]}):null,(0,t.jsx)("ul",{className:d.default.rows,children:e.rows.map(e=>(0,t.jsx)("li",{"data-reveal":"",children:(0,t.jsxs)(r.default,{className:d.default.row,href:e.href,onClick:t=>((e,t)=>{if(t.onOpen){e.preventDefault(),t.onOpen();return}if(0!==e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;let i=p.current.get(t.key);t.large&&t.landing&&i&&(e.preventDefault(),(0,s.B)(t.large),(0,s.d)({href:t.href,alt:t.title,from:(0,s.q)(i),returnTo:()=>i.isConnected?(0,s.q)(i):null,sheet:i.currentSrc||t.thumb||void 0,src:t.large,to:(0,o.T)(t.landing,t.ratio)})&&w(t.key),h.push(t.href))})(t,e),children:[(0,t.jsxs)("span",{className:d.default.thumb,"data-gl":e.video?"video":e.thumb?"image":void 0,"data-src":e.video??e.thumb??void 0,style:{aspectRatio:e.ratio&&e.ratio>0?`${e.ratio}`:"5 / 7"},children:[e.video?(0,t.jsx)("video",{autoPlay:!0,crossOrigin:"anonymous",loop:!0,muted:!0,playsInline:!0,src:e.video}):null,e.thumb&&!e.video?(0,t.jsx)("img",{alt:"","data-away":g===e.key&&m?.painted&&m?.phase!=="down"?"":void 0,decoding:"async",loading:"lazy",ref:t=>{t?p.current.set(e.key,t):p.current.delete(e.key)},src:e.thumb}):null]}),(0,t.jsxs)("span",{className:d.default.text,children:[(0,t.jsx)("span",{className:d.default.title,"data-gl":"title",children:e.title}),e.meta?(0,t.jsx)("span",{className:d.default.meta,"data-gl":"meta",children:e.meta}):null]}),e.price?(0,t.jsx)("span",{className:d.default.price,"data-gl":"price",children:e.price}):null,(0,t.jsx)("span",{"aria-hidden":"true",className:d.default.go,children:"→"})]})},e.key))})]},e.key))]})]})})}],475788);var f=e.i(891468);let h=[{label:"Gallery",value:"gallery"},{label:"List",value:"list"}];e.s(["f",0,function({ref:e,top:i}={}){let[r,n]=(0,u.useView)();return(0,t.jsx)("div",{className:f.default.switches,ref:e,style:null==i?void 0:{top:i},children:(0,t.jsxs)("fieldset",{className:f.default.switch,children:[(0,t.jsx)("legend",{className:"sr-only",children:"View"}),h.map(e=>(0,t.jsx)("button",{"aria-pressed":r===e.value,className:r===e.value?f.default.on:void 0,onClick:()=>n(e.value),type:"button",children:e.label},e.value))]})})}],606836)},651374,e=>{e.v({add:"_1jiVAW_add",back:"_1jiVAW_back",blurb:"_1jiVAW_blurb",board:"_1jiVAW_board",buy:"_1jiVAW_buy",card:"_1jiVAW_card",cardShot:"_1jiVAW_cardShot",cards:"_1jiVAW_cards",cart:"_1jiVAW_cart",case:"_1jiVAW_case",chip:"_1jiVAW_chip",chips:"_1jiVAW_chips",collection:"_1jiVAW_collection",column:"_1jiVAW_column",corner:"_1jiVAW_corner",count:"_1jiVAW_count",dot:"_1jiVAW_dot",drawerBody:"_1jiVAW_drawerBody",drawerTop:"_1jiVAW_drawerTop",drawers:"_1jiVAW_drawers",edition:"_1jiVAW_edition",empty:"_1jiVAW_empty",field:"_1jiVAW_field",fieldHead:"_1jiVAW_fieldHead",fieldLabel:"_1jiVAW_fieldLabel",fieldValue:"_1jiVAW_fieldValue",fields:"_1jiVAW_fields",frameChip:"_1jiVAW_frameChip",gone:"_1jiVAW_gone",head:"_1jiVAW_head",info:"_1jiVAW_info",main:"_1jiVAW_main",moreBtn:"_1jiVAW_moreBtn",moves:"_1jiVAW_moves",note:"_1jiVAW_note",on:"_1jiVAW_on",pager:"_1jiVAW_pager",pdp:"_1jiVAW_pdp","pdp-show":"_1jiVAW_pdp-show",pdpOverlay:"_1jiVAW_pdpOverlay",pick:"_1jiVAW_pick",price:"_1jiVAW_price",qty:"_1jiVAW_qty",related:"_1jiVAW_related",room:"_1jiVAW_room",roomClose:"_1jiVAW_roomClose",roomCode:"_1jiVAW_roomCode",roomFine:"_1jiVAW_roomFine",roomOut:"_1jiVAW_roomOut",roomPanel:"_1jiVAW_roomPanel",roomVeil:"_1jiVAW_roomVeil",savePin:"_1jiVAW_savePin",scene:"_1jiVAW_scene",sheet:"_1jiVAW_sheet",shelf:"_1jiVAW_shelf",shot:"_1jiVAW_shot",shotBar:"_1jiVAW_shotBar",shots:"_1jiVAW_shots",stage:"_1jiVAW_stage",stageShots:"_1jiVAW_stageShots",switch:"_1jiVAW_switch",taxNote:"_1jiVAW_taxNote",thumbScene:"_1jiVAW_thumbScene",tile:"_1jiVAW_tile",tileCase:"_1jiVAW_tileCase",tileName:"_1jiVAW_tileName",tileShot:"_1jiVAW_tileShot",top:"_1jiVAW_top"})},634416,e=>{"use strict";var t=e.i(26e3),i=e.i(508446),r=e.i(651374);function n(e,i,r){return"jigsaw"===e?(0,t.laidBoardFrame)(i,r,!0):{height:1,left:0,top:0,width:1}}e.s(["n",0,n,"T",0,function(e,t){let a=document.createElement("div");a.className=`${r.default.pdp} ${r.default.pdpOverlay}`,a.setAttribute("aria-hidden","true"),a.style.visibility="hidden",a.style.pointerEvents="none";let o="good"===e?r.default.stage:r.default.shot;a.innerHTML=`<main class="${r.default.main}"><section class="${r.default.top}"><div class="${r.default.sheet}"><div class="${o}"></div></div><div></div></section></main>`,"print"===e&&t&&t>0&&a.querySelector(`.${r.default.sheet}`)?.style.setProperty("--shot-ratio",String(t)),document.body.appendChild(a);let s=a.querySelector("section > div > div"),l=s?(0,i.q)(s):null;if(a.remove(),!l||l.width<=0||l.height<=0)return null;let u=n(e,l.width,l.height);return{height:l.height*u.height,left:l.left+l.width*u.left,top:l.top+l.height*u.top,width:l.width*u.width}}])},891468,e=>{e.v({on:"_7NwgQq_on",switch:"_7NwgQq_switch",switches:"_7NwgQq_switches"})},26e3,e=>{"use strict";var t=e.i(685476),i=e.i(59218),r=e.i(188545),n=e.i(351581),a=e.i(294425),o=e.i(988177),s=e.i(221928),l=e.i(495476),u=e.i(954057),d=e.i(449689);function c(){return new o.Zg({fragmentShader:f,uniforms:{uBuild:{value:1},uGrid:{value:new o.wq(1,1)},uHand:{value:new o.wq(.5,.5)},uH:{value:1},uImg:{value:new o.wq},uLight:{value:new o.cE(0,0,1)},uNear:{value:0},uRoom:{value:0},uTex:{value:null},uW:{value:1}},vertexShader:h})}let f=`
  uniform sampler2D uTex;
  uniform vec2 uImg;
  uniform float uW;
  uniform float uH;
  uniform vec2 uGrid;
  uniform float uBuild;
  uniform vec3 uLight;
  uniform vec2 uHand;
  uniform float uNear;
  uniform float uRoom;

  varying vec2 vUv;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  /* the picture is cropped into the sheet rather than squeezed onto it */
  vec2 cover(vec2 uv) {
    if (uImg.x < 1.0 || uImg.y < 1.0) return uv;
    float ia = uImg.x / uImg.y;
    float ta = uW / uH;
    return ta > ia
      ? vec2(uv.x, (uv.y - 0.5) * (ia / ta) + 0.5)
      : vec2((uv.x - 0.5) * (ta / ia) + 0.5, uv.y);
  }

  /* one cut, running down the board at k, between the pieces either side of it. the
     straight line is the blade; the circle is the tab, given to the piece on one side of
     it and taken out of the other, so the two always answer to each other exactly. */
  float seam(vec2 g, float k, float j, float across, float border) {
    vec2 q = across > 0.5 ? g : g.yx;
    float a = q.x - k;
    if (border > 0.5) return a;

    vec2 id = vec2(k, j) + across * 31.0;
    float dir = hash21(id) < 0.5 ? -1.0 : 1.0;
    /* no two tabs sit at quite the same height, or the board reads as graph paper */
    float slide = (hash21(id + 7.3) - 0.5) * 0.12;
    float r = 0.150 * (0.86 + 0.28 * hash21(id + 19.1));
    vec2 c = vec2(k + dir * 0.050, j + 0.5 + slide);
    float b = length(q - c) - r;
    // the knob is added to the near piece, or bitten out of it
    return dir > 0.0 ? min(a, b) : max(a, -b);
  }

  /** when this piece comes home — a loose wave across the board, not all at once */
  float seatOf(vec2 p) {
    float r = hash21(p + 0.5);
    float t0 = 0.55 * r + 0.45 * (p.x + p.y) / (uGrid.x + uGrid.y);
    // its own turn is short, so a piece drops in rather than fading up
    return smoothstep(0.0, 1.0, clamp((uBuild - t0 * 0.82) / 0.18, 0.0, 1.0));
  }

  /* how far a piece has been picked up by the hand passing over it */
  float liftOf(vec2 p, float seat) {
    vec2 pc = ((p + 0.5) / uGrid - 0.5) * vec2(uW, uH);
    return uNear * seat * smoothstep(1.00, 0.0, length(pc - uHand));
  }

  float field(vec2 g, out vec2 piece, out float seat, out float lift) {
    vec2 ci = floor(g);
    float sL = seam(g, ci.x, ci.y, 1.0, step(ci.x, 0.5));
    float sR = seam(g, ci.x + 1.0, ci.y, 1.0, step(uGrid.x - 0.5, ci.x + 1.0));
    float sB = seam(g, ci.y, ci.x, 0.0, step(ci.y, 0.5));
    float sT = seam(g, ci.y + 1.0, ci.x, 0.0, step(uGrid.y - 0.5, ci.y + 1.0));

    float d = min(min(abs(sL), abs(sR)), min(abs(sB), abs(sT)));

    /* a tab carries the pixel over into the neighbour, so the piece is read off the
       cuts rather than off the cell it happens to land in */
    piece = ci + vec2(
      sL < 0.0 ? -1.0 : (sR > 0.0 ? 1.0 : 0.0),
      sB < 0.0 ? -1.0 : (sT > 0.0 ? 1.0 : 0.0)
    );
    piece = clamp(piece, vec2(0.0), uGrid - 1.0);

    seat = seatOf(piece);
    lift = liftOf(piece, seat);
    // a piece still on its way in is eaten back to nothing; a lifted one only loosens
    return d - (1.0 - seat) * 0.55 - lift * 0.055;
  }

  /** the card's rounded edge, as a height */
  float profile(float d) {
    return smoothstep(0.0, 0.055, d);
  }

  void main() {
    vec2 g = vUv * uGrid;
    vec2 piece;
    float seat;
    float lift;
    float d = field(g, piece, seat, lift);

    /* the slope of the card, read across the cut and along it */
    const float E = 0.012;
    vec2 dummy;
    float s2, l2;
    float hL = profile(field(g - vec2(E, 0.0), dummy, s2, l2));
    float hR = profile(field(g + vec2(E, 0.0), dummy, s2, l2));
    float hB = profile(field(g - vec2(0.0, E), dummy, s2, l2));
    float hT = profile(field(g + vec2(0.0, E), dummy, s2, l2));
    float slope = 0.055 * 92.0 / 100.0;
    vec3 n = normalize(vec3(
      -(hR - hL) / (2.0 * E) * slope,
      -(hT - hB) / (2.0 * E) * slope,
      1.0
    ));

    /* a raised piece shows a little more of its own edge to the eye */
    vec2 par = -(piece + 0.5 - uGrid * 0.5) / uGrid * 0.05 * lift;
    /* the texture is decoded to linear light when it is read, and nothing after this
       shader encodes it back, so it is put back into the file's own sRGB here — the
       painting's colours exactly, with the board's light worked on top of them */
    vec3 art = sRGBTransferOETF(texture2D(uTex, cover(vUv + par))).rgb;

    float diff = max(0.0, dot(n, uLight));
    // board is pressed card, so the sheen off it is broad and weak
    float sheen = pow(max(0.0, dot(reflect(-uLight, n), vec3(0.0, 0.0, 1.0))), 20.0) * 0.2;

    /* every piece is cut from the same sheet but not printed quite alike */
    float tone = 0.985 + 0.03 * hash21(piece + 4.7);
    /* the lamp only shapes the bevels: the flat face of a piece is lit exactly as it was
       printed, neither dimmed nor lifted */
    vec3 card = art * tone * (1.0 + 0.70 * (diff - uLight.z)) + sheen;
    // and the cut itself is a hair of raw board with no light in it at all
    card = mix(card * 0.30, card, smoothstep(0.0, 0.055 * 0.5, d));
    card += lift * 0.07;

    /* where a piece has not dropped in yet, the table shows through */
    vec3 table = mix(vec3(0.055, 0.05, 0.047), vec3(0.30, 0.26, 0.22), uRoom);
    // and the lip of the hole keeps the light off the bottom of it
    table *= 0.55 + 0.45 * smoothstep(0.0, 0.10, -d);
    table += art * 0.03;

    float there = smoothstep(-0.004, 0.006, d);
    gl_FragColor = vec4(mix(table, card, there), 1.0);
  }
`,h=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,m=`
  uniform float uRoom;
  varying vec2 vUv;
  void main() {
    vec2 q = abs(vUv - 0.5) * 2.0;
    float d = max(q.x, q.y);
    float a = smoothstep(1.0, 0.55, d) * (0.42 - uRoom * 0.16);
    gl_FragColor = vec4(0.0, 0.0, 0.0, a);
  }
`;function v({build:e,cut:n,fill:s,image:u,room:d,wide:f}){let p=(0,r.f)(e=>e.viewport),g=(0,a.useRef)(null),w=(0,a.useRef)(null),_=(0,a.useRef)(""),y=(0,a.useMemo)(()=>{let e=Math.min(s*p.height*l.r,p.width*f);return{h:e/l.r,w:e}},[s,f,p.width,p.height]),j=(0,a.useMemo)(()=>c(),[]),x=(0,a.useMemo)(()=>new o.Zg({depthWrite:!1,fragmentShader:m,transparent:!0,uniforms:{uRoom:{value:0}},vertexShader:h}),[]),V=(0,a.useMemo)(()=>new o.cE,[]);return(0,a.useEffect)(()=>()=>{j.uniforms.uTex.value?.dispose(),j.dispose(),x.dispose()},[j,x]),(0,i.f)((t,i)=>{if(!g.current||!w.current)return;let r=Math.min(i,.05),a=e.current;u===_.current&&j.uniforms.uTex.value||(_.current=u,j.uniforms.uTex.value=(0,l.D)({kind:"image",src:u},!0));let o=j.uniforms.uTex.value?.image;o?.width&&o.height&&j.uniforms.uImg.value.set(o.width,o.height),j.uniforms.uW.value=y.w,j.uniforms.uH.value=y.h,j.uniforms.uGrid.value.set(n.cols,n.rows),j.uniforms.uBuild.value=a.p,j.uniforms.uNear.value=a.near,j.uniforms.uRoom.value=d,x.uniforms.uRoom.value=d,j.uniforms.uHand.value.set(a.x*p.width/2,a.y*p.height/2),V.set(-.42+.25*a.x,.58-.2*a.y,.86),j.uniforms.uLight.value.copy(V.normalize());let c=.05*a.x*a.near,f=.05*a.y*a.near;g.current.rotation.y+=(c-g.current.rotation.y)*Math.min(1,4*r),g.current.rotation.x+=(f-g.current.rotation.x)*Math.min(1,4*r);let h=Math.min(1,Math.max(0,(1-s)/.22));w.current.position.set(.03*y.w*h,-(.03*y.h)*h,-.05),w.current.scale.set(y.w*(1+.2*h),y.h*(1+.16*h),1)}),(0,t.jsxs)("group",{ref:g,children:[(0,t.jsx)("mesh",{material:x,ref:w,children:(0,t.jsx)("planeGeometry",{args:[1,1]})}),(0,t.jsx)("mesh",{material:j,children:(0,t.jsx)("planeGeometry",{args:[y.w,y.h]})})]})}e.s(["JigsawScene",0,function({image:e,cols:i,rows:r,state:l,onSettled:c,ink:f="#20201d",className:h,thumb:m=!1,startLaid:p=!1}){let g,w=(0,a.useRef)({near:0,p:p&&"laid"===l?1:0,x:0,y:0}),_=(0,a.useRef)(null);(0,d.f)(_);let y=(0,a.useRef)(c);return y.current=c,(0,a.useEffect)(()=>{let e=n.f.to(w.current,{duration:(0,u.T)()?0:"laid"===l?1.4:.65,ease:"laid"===l?"power2.out":"power2.in",onComplete:()=>y.current?.(),overwrite:!0,p:+("laid"===l)});return()=>{e.kill()}},[l]),(0,a.useEffect)(()=>{let e=_.current;if(!e)return;let t=t=>{let i=e.getBoundingClientRect();w.current.x=(t.clientX-i.left)/i.width*2-1,w.current.y=1-(t.clientY-i.top)/i.height*2,n.f.to(w.current,{duration:.3,near:1,overwrite:"auto"})},i=()=>{n.f.to(w.current,{duration:.5,near:0,overwrite:"auto"})};return e.addEventListener("pointermove",t),e.addEventListener("pointerleave",i),()=>{e.removeEventListener("pointermove",t),e.removeEventListener("pointerleave",i)}},[]),(0,t.jsx)("div",{className:h,ref:_,style:{height:"100%",width:"100%"},children:(0,t.jsx)(s.f,{camera:u.V,dpr:[1,1.75],flat:!0,gl:{alpha:!0,antialias:!0},style:{height:"100%",width:"100%"},children:(0,t.jsx)(v,{build:w,cut:{cols:i,rows:r},fill:m?.98:.56,image:e,room:.299*(g=new o.Es(f)).r+.587*g.g+.114*g.b>.5?0:1,wide:m?.98:.86})})})},"laidBoardFrame",0,function(e,t,i=!1){let r=Math.min((i?.98:.56)*t*l.r,e*(i?.98:.86)),n=r/e,a=r/l.r/t;return{height:a,left:(1-n)/2,top:(1-a)/2,width:n}},"makeJigsawSheet",0,c])},910492,e=>{"use strict";let t="shutabug:home-reveal";e.s(["e",0,t,"U",0,()=>{try{return!!sessionStorage.getItem(t)}catch{return!1}},"g",0,()=>{try{sessionStorage.setItem(t,"1")}catch{}},"f",0,e=>{e?document.documentElement.dataset.booting="":delete document.documentElement.dataset.booting}])},495476,e=>{"use strict";var t=e.i(988177);let i=5/7,r=new Map,n=new Map;function a(e){e.paused&&e.duration&&e.currentTime<.05&&(e.currentTime=Math.min(1.6,.35*e.duration))}function o(e){let t=r.get(e);if(!t){let i;(t=document.createElement("video")).src=e,t.muted=!0,t.loop=!0,t.playsInline=!0,t.crossOrigin="anonymous",t.preload="auto";let n=t;n.addEventListener("loadedmetadata",()=>a(n)),(!(i=document.getElementById("print-video-host"))&&((i=document.createElement("div")).id="print-video-host",i.setAttribute("aria-hidden","true"),i.style.cssText="position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none",document.body.appendChild(i)),i).appendChild(n),n.load(),r.set(e,t)}return t}function s(e,t,r){if(!t||!r)return;let n=t/r>i?r*i:t,a=n/i;e.repeat.set(n/t,a/r),e.offset.set((t-n)/2/t,(r-a)/2/r)}function l(e){return e.colorSpace=t.nj,e.minFilter=t.VV,e.magFilter=t.VV,e}let u=null;e.s(["r",0,i,"D",0,function(e,i=!1,r){let a=i?`${e.src}|whole`:e.src,d=n.get(a);if(d)return n.delete(a),n.set(a,d),r?.(d),d;if("video"===e.kind){let n=o(e.src),a=l(new t.TS(n));i||(n.readyState>=1?s(a,n.videoWidth,n.videoHeight):n.addEventListener("loadedmetadata",()=>s(a,n.videoWidth,n.videoHeight),{once:!0})),n.addEventListener("seeked",()=>{a.needsUpdate=!0}),d=a,r?.(a)}else d=l((!u&&(u=new t.H5).setCrossOrigin("anonymous"),u).load(e.src,e=>{if(!i){let t=e.image;s(e,t.width,t.height),e.needsUpdate=!0}r?.(e)}));return n.set(a,d),!function(){for(let[e,i]of n){if(n.size<=36)return;i instanceof t.TS||(i.dispose(),n.delete(e))}}(),d},"F",0,function(){r.forEach(e=>{e.pause()})},"o",0,function(e,t,i){let r=e.filter(e=>"image"===e.kind).slice(0,t);return r.length?new Promise(e=>{let t=r.length,n=!1,a=()=>{n||(n=!0,e())},o=()=>{--t<=0&&a()};for(let e of r){let t=new Image;t.onload=o,t.onerror=o,t.src=e.src}setTimeout(a,i)}):Promise.resolve()},"c",0,function(e,t){if("video"!==e.kind)return;let i=o(e.src);t?i.play().catch(()=>a(i)):(i.pause(),a(i))}])},219671,e=>{"use strict";var t=e.i(351581),i=e.i(294425);let r="opens";function n(e){if(e.altKey||e.ctrlKey||e.metaKey)return!1;let t=e.target;return!(t instanceof Element)||!t.closest('a[href],button,input,select,textarea,summary,iframe,[contenteditable]:not([contenteditable="false"]),[role="dialog"],[tabindex]:not([tabindex="-1"]):not([data-walk])')}let a=new Set(["ArrowDown","ArrowLeft","ArrowRight","ArrowUp","Enter","PageDown","PageUp"]);function o(e,i){let n={in:!1,x:0,y:0},a=()=>{let t=n.in&&!e.classList.contains("dragging")&&i(n.x,n.y);e.classList.contains(r)!==t&&e.classList.toggle(r,t)},o=e=>{n.in=!0,n.x=e.clientX,n.y=e.clientY,a()},s=()=>{n.in=!1,a()};return e.addEventListener("pointermove",o),e.addEventListener("pointerleave",s),t.f.ticker.add(a),()=>{e.removeEventListener("pointermove",o),e.removeEventListener("pointerleave",s),t.f.ticker.remove(a),e.classList.remove(r)}}e.s(["e",0,function({perPx:e=1/240,fling:r=7,ease:a=.1,snap:s=.2,onOpen:l}={}){let u=(0,i.useRef)({pos:0,vel:0}),d=(0,i.useRef)(0),c=(0,i.useRef)(null),[f,h]=(0,i.useState)(null),[m]=(0,i.useState)(()=>{let e=null;return{get current(){return e},set current(t){e=t,h(t)}}}),v=(0,i.useRef)(l);v.current=l;let p=(0,i.useRef)(!1);return(0,i.useEffect)(()=>{let e=(e,t)=>{let i=u.current,r=p.current?Math.min(.3,1.8*a):a,n=1-(1-r)**Math.min(t/16.667,4),o=i.pos+(d.current-i.pos)*n;i.vel=o-i.pos,i.pos=o,p.current&&.04>Math.abs(d.current-i.pos)&&(p.current=!1,v.current?.())};return t.f.ticker.add(e),()=>t.f.ticker.remove(e)},[a]),(0,i.useEffect)(()=>{if(!f)return;let i=t.f.delayedCall(s,()=>{d.current=Math.round(d.current)}).pause(),a={on:!1,x:0,v:0,moved:0,id:-1},o=e=>{i.pause(),p.current=!1,a.on=!0,a.x=e.clientX,a.v=0,a.moved=0,a.id=e.pointerId,f.setPointerCapture(e.pointerId),f.classList.add("dragging")},l=t=>{if(!a.on)return;let i=t.clientX-a.x;a.x=t.clientX,a.v=i,a.moved+=Math.abs(i),d.current-=i*e},u=t=>{if(a.on){if(a.on=!1,f.releasePointerCapture(a.id),f.classList.remove("dragging"),a.moved<6){let e=c.current?.under(t.clientX/window.innerWidth*2-1);return null==e?void 0:0===e?void v.current?.():(d.current=Math.round(d.current)+e,void(p.current=!!v.current))}d.current-=a.v*e*r,i.restart(!0)}},h=t=>{t.preventDefault(),p.current=!1;let r=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;d.current+=r*e*.8,i.restart(!0)},m=e=>{if(!e.defaultPrevented&&n(e)){if("Enter"===e.key)return v.current?.();("ArrowLeft"===e.key||"ArrowRight"===e.key)&&(e.preventDefault(),p.current=!1,d.current=Math.round(d.current)+("ArrowRight"===e.key?1:-1))}};return f.addEventListener("pointerdown",o),f.addEventListener("pointermove",l),f.addEventListener("pointerup",u),f.addEventListener("pointercancel",u),f.addEventListener("wheel",h,{passive:!1}),window.addEventListener("keydown",m),()=>{i.kill(),f.removeEventListener("pointerdown",o),f.removeEventListener("pointermove",l),f.removeEventListener("pointerup",u),f.removeEventListener("pointercancel",u),f.removeEventListener("wheel",h),window.removeEventListener("keydown",m)}},[f,e,r,s]),(0,i.useEffect)(()=>{if(f)return o(f,(e,t)=>{if(!v.current)return!1;let i=c.current?.under(e/window.innerWidth*2-1);if(null==i)return!1;let r=0===i?c.current?.centre?.():null;return!r||!(r.width>0)||!(r.height>0)||e>=r.left&&e<=r.left+r.width&&t>=r.top&&t<=r.top+r.height})},[f]),{run:u,target:d,api:c,stage:m}},"S",0,function(e){let t=(0,i.useRef)(!1),[r,o]=(0,i.useState)("");return(0,i.useEffect)(()=>{let e=e=>{a.has(e.key)&&n(e)&&(t.current=!0)},i=()=>{t.current=!1};return window.addEventListener("keydown",e),window.addEventListener("pointerdown",i),window.addEventListener("wheel",i,{passive:!0}),()=>{window.removeEventListener("keydown",e),window.removeEventListener("pointerdown",i),window.removeEventListener("wheel",i)}},[]),(0,i.useEffect)(()=>{t.current&&o(e)},[e]),r},"F",0,n,"w",0,o])},954057,e=>{"use strict";let t;e.i(294425);var i=e.i(988177);e.i(703889);let r=new Set(["uWeave","uBump"]);new i.cE,e.s(["M",0,"#26221e","F",0,"#1b1815","V",0,{far:60,fov:42,near:.1,position:[0,0,10]},"O",0,(e,t,i)=>Math.min(i,Math.max(t,e)),"G",0,function(e){e.geometry.dispose(),e.material.dispose()},"Q",0,function(e){if(e instanceof i.p$)e.map?.dispose();else if(e instanceof i.Zg)for(let[t,n]of Object.entries(e.uniforms))n.value instanceof i.Sk&&!r.has(t)&&n.value.dispose();e.dispose()},"R",0,function(e){let t=43758.5453*Math.sin(127.1*e);return t-Math.floor(t)},"q",0,function(e){return void 0===t&&(t=window.matchMedia?.("(prefers-reduced-motion: reduce)")??null),t?.matches?0:e},"P",0,function(){return new i.p$({color:"#ffffff",toneMapped:!1,transparent:!0})},"d",0,function(e,t,r=.45){let n=[],a=e/2;for(let r=0;r<=60;r++){let o=-a+e*r/60,s=o/a;n.push(new i.cE(o,-t*(1-s*s),0))}return new i.DL(new i.ld().setFromPoints(n),new i.NQ({opacity:r,transparent:!0}))},"T",0,function(){return!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches},"$",0,function(e,t){return e-Math.round(e/t)*t},"n",0,function(e,t){return t>0?(e%t+t)%t:0}])},449689,e=>{"use strict";var t=e.i(294425);e.s(["f",0,function(e){(0,t.useEffect)(()=>{let t=e.current;if(!t)return;let i=performance.now(),r=0,n=()=>{if(performance.now()-i>8e3)return;let e=t.querySelector("canvas");if(e&&300===e.width&&150===e.height){let{height:e,width:i}=t.getBoundingClientRect();i>300&&e>150&&window.dispatchEvent(new Event("resize"))}r=window.setTimeout(n,100)};return r=window.setTimeout(n,0),()=>clearTimeout(r)},[e])}])}]);