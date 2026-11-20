#!/usr/bin/env python3
"""
deploy_360_vr_camera.py
Implements 360° Spherical VR Free-Look (Pitch & Yaw) with Hookian spring damping,
Smooth Spatial Gliding (Corridor Navigation with Wall Clearance Clamping [7.7m - 11.5m]),
Mobile Gyroscope DeviceOrientation, and subtle interaction hint.
"""

import os
import re

CHUNK_PATH = "public/shutabug/_next/static/immutable/chunks/0mb466wcheden.js"
HTML_PATH = "public/shutabug/index.html"

def update_chunk():
    print(f"[1/3] Reading {CHUNK_PATH}...")
    with open(CHUNK_PATH, "r", encoding="utf-8") as f:
        code = f.read()

    # 1. Update Camera Position & Spherical Free-Look in (0, r.f)((e, t) => ...)
    # Find original camera calculation
    orig_cam = "let a=n.at;ei.set(9.7*Math.sin(a),1.55+(q?0:.012*Math.sin(1.4*e.clock.elapsedTime)),9.7*Math.cos(a));let c=a+.32+.25*U.x;if(er.set(9.7*Math.sin(c),1.5+.25*U.y,9.7*Math.cos(c))"
    
    if orig_cam not in code:
        raise ValueError("Could not find original camera snippet in chunk!")

    new_cam = """let vr=(window.__vrCamera=window.__vrCamera||{targetYaw:0,currentYaw:0,targetPitch:0,currentPitch:0,vx:0,vy:0,targetRadius:9.7,currentRadius:9.7,gyroYaw:0,gyroPitch:0,userInteracted:!1});if(!f.current&&(Math.abs(vr.vx)>1e-5||Math.abs(vr.vy)>1e-5)){vr.targetYaw+=vr.vx,vr.targetPitch+=vr.vy,vr.targetPitch=Math.max(-1.04719,Math.min(.95993,vr.targetPitch)),vr.vx*=.9,vr.vy*=.9}if(window.__vrActiveKeys){(window.__vrActiveKeys.has("KeyW")||window.__vrActiveKeys.has("ArrowUp"))&&(n.target+=.04*60*r,n.moved=o);(window.__vrActiveKeys.has("KeyS")||window.__vrActiveKeys.has("ArrowDown"))&&(n.target-=.04*60*r,n.moved=o);(window.__vrActiveKeys.has("KeyA")||window.__vrActiveKeys.has("ArrowLeft"))&&(vr.targetRadius=Math.max(7.7,vr.targetRadius-.05*60*r));(window.__vrActiveKeys.has("KeyD")||window.__vrActiveKeys.has("ArrowRight"))&&(vr.targetRadius=Math.min(11.5,vr.targetRadius+.05*60*r))}let _lf=Math.min(1,.08*60*r);vr.currentYaw+=(vr.targetYaw-vr.currentYaw)*_lf,vr.currentPitch+=(vr.targetPitch-vr.currentPitch)*_lf,vr.currentRadius+=(vr.targetRadius-vr.currentRadius)*_lf,vr.currentRadius=Math.max(7.7,Math.min(11.5,vr.currentRadius));let a=n.at,_cx=vr.currentRadius*Math.sin(a),_cz=vr.currentRadius*Math.cos(a),_cy=1.55+(q?0:.012*Math.sin(1.4*e.clock.elapsedTime));ei.set(_cx,_cy,_cz);let _ty=a+Math.PI/2+vr.currentYaw+(vr.gyroYaw||0)+.15*U.x,_tp=vr.currentPitch+(vr.gyroPitch||0)+.12*U.y,_cp=Math.cos(_tp);er.set(_cx+_cp*Math.sin(_ty)*6,_cy+Math.sin(_tp)*6,_cz+_cp*Math.cos(_ty)*6);let c=a+.32;if(1"""

    code = code.replace(orig_cam, new_cam)
    print("  ✓ Spliced 360° spherical free-look & corridor wall clamping into camera frame loop.")

    # 2. Update onPointerMove to rotate Pitch & Yaw instead of only walking tangent
    orig_pm = "Math.abs(l)>3&&(u.current=!0),c.current.target-=.0022*l,Math.abs(l)>3&&(c.current.moved=performance.now());let a=Math.max(1,e.timeStamp-r.t);r.v=.6*r.v+l/a*.4,r.t=e.timeStamp,r.x=e.clientX,r.y=e.clientY}"
    if orig_pm not in code:
        raise ValueError("Could not find onPointerMove snippet in chunk!")

    new_pm = """let _dx=e.clientX-r.x,_dy=e.clientY-r.y,_dist=Math.hypot(_dx,_dy);if(_dist>3){u.current=!0;let vr=(window.__vrCamera=window.__vrCamera||{targetYaw:0,currentYaw:0,targetPitch:0,currentPitch:0,vx:0,vy:0,targetRadius:9.7,currentRadius:9.7,gyroYaw:0,gyroPitch:0,userInteracted:!1});vr.userInteracted=!0;let _h=document.querySelector('[class*="walkHint"]');_h&&_h.classList.add("fade-hint");vr.targetYaw-=_dx*.0032;vr.targetPitch-=_dy*.0032;vr.targetPitch=Math.max(-1.04719,Math.min(.95993,vr.targetPitch))}let a=Math.max(1,e.timeStamp-r.t);r.vx=.6*(r.vx||0)+_dx/a*.4;r.vy=.6*(r.vy||0)+_dy/a*.4;r.v=.6*r.v+l/a*.4;r.t=e.timeStamp;r.x=e.clientX;r.y=e.clientY}"""

    code = code.replace(orig_pm, new_pm)
    print("  ✓ Spliced free-look pointer drag with pitch/yaw accumulation into onPointerMove.")

    # 3. Update onPointerUp to release momentum
    orig_pu = "u.current&&!(e.timeStamp-t.t>80)&&(c.current.target-=220*Math.max(-3,Math.min(3,t.v))*.0022,c.current.moved=performance.now())"
    if orig_pu not in code:
        raise ValueError("Could not find onPointerUp snippet in chunk!")

    new_pu = """u.current&&!(e.timeStamp-t.t>80)&&(window.__vrCamera&&(window.__vrCamera.vx=-Math.max(-3,Math.min(3,t.vx||0))*.0032,window.__vrCamera.vy=-Math.max(-3,Math.min(3,t.vy||0))*.0032),c.current.moved=performance.now())"""

    code = code.replace(orig_pu, new_pu)
    print("  ✓ Spliced inertia momentum release into onPointerUp.")

    # 4. Update Interaction Hint Text
    orig_hint = '["Scroll or drag to walk round","Click a painting to look closer"]'
    new_hint = '["DRAG TO EXPLORE 360° · SCROLL OR ARROWS TO WALK"]'
    if orig_hint in code:
        code = code.replace(orig_hint, new_hint)
        print("  ✓ Replaced interaction hint with luxury 360° museum prompt.")

    # Also mobile touch hint
    orig_mobile_hint = '["Swipe to walk round","Tap a painting to look closer"]'
    new_mobile_hint = '["DRAG TO EXPLORE 360° · SWIPE TO WALK"]'
    if orig_mobile_hint in code:
        code = code.replace(orig_mobile_hint, new_mobile_hint)
        print("  ✓ Replaced mobile touch hint.")

    # 5. Inject Global Listeners (WASD + Arrows + Gyroscope + Fade Hint) at module boot
    boot_inject = """
if(typeof window!=="undefined"){
  window.__vrActiveKeys=window.__vrActiveKeys||new Set();
  function _fadeHint(){
    if(typeof document!=="undefined"){
      document.body.classList.add("user-has-interacted");
      document.querySelectorAll('[class*="walkHint"]').forEach(function(el){el.classList.add("fade-hint")});
    }
  }
  if(!window.__vrListenersAdded){
    window.__vrListenersAdded=!0;
    window.addEventListener("pointerdown",_fadeHint,{passive:!0});
    window.addEventListener("wheel",_fadeHint,{passive:!0});
    window.addEventListener("keydown",function(e){
      _fadeHint();
      let c=e.code;
      if(["KeyW","KeyS","KeyA","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(c)!==-1){
        window.__vrActiveKeys.add(c);
        if(window.__vrCamera) window.__vrCamera.userInteracted=!0;
      }
    });
    window.addEventListener("keyup",function(e){
      window.__vrActiveKeys.delete(e.code);
    });
    if(window.DeviceOrientationEvent){
      window.addEventListener("deviceorientation",function(e){
        if(e.gamma!==null&&e.beta!==null){
          let vr=window.__vrCamera;
          if(vr){
            vr.gyroYaw=Math.max(-.35,Math.min(.35,(e.gamma*Math.PI)/180*.25));
            vr.gyroPitch=Math.max(-.3,Math.min(.3,((e.beta-45)*Math.PI)/180*.25));
          }
        }
      },{passive:!0});
    }
  }
}
"""
    code = boot_inject + code

    with open(CHUNK_PATH, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"  ✓ Written updated chunk ({len(code)} bytes) to {CHUNK_PATH}.")

def update_html():
    print(f"[2/3] Reading {HTML_PATH}...")
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    hint_css = """
/* =========================================================
   LUXURY INTERACTION HINT (Apple Vision Pro style)
   ========================================================= */
.eqSSUG_walkHint, [class*="walkHint"] {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace !important;
  font-size: 11px !important;
  color: rgba(148, 163, 184, 0.65) !important;
  letter-spacing: 0.16em !important;
  text-transform: uppercase !important;
  background: rgba(4, 19, 41, 0.45) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  padding: 8px 18px !important;
  border-radius: 9999px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.eqSSUG_walkHint.fade-hint, [class*="walkHint"].fade-hint,
body.user-has-interacted .eqSSUG_walkHint, body.user-has-interacted [class*="walkHint"] {
  opacity: 0 !important;
  transform: translateY(12px) scale(0.96) !important;
  pointer-events: none !important;
}
"""
    if "/* LUXURY INTERACTION HINT" not in html:
        style_end = html.find("</style>")
        if style_end != -1:
            html = html[:style_end] + hint_css + html[style_end:]
            with open(HTML_PATH, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"  ✓ Injected luxury interaction hint CSS into {HTML_PATH}.")

def main():
    update_chunk()
    update_html()
    print("[3/3] VR 360° Free-Look & Invisible Gliding successfully deployed!")

if __name__ == "__main__":
    main()
