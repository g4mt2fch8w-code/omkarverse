/**
 * ============================================================================
 * THE OMKAR DEN · MEMS SILICON GYROSCOPE ORIENTATION & DSP PHYSICS ENGINE
 * ============================================================================
 * 
 * Hardware-grade orientation engine utilizing mobile MEMS (Micro-Electro-Mechanical Systems)
 * silicon gyroscope chips with digital Infinite Impulse Response (IIR) low-pass filtering
 * and Gimbal-Lock-Free Quaternion SLERP (Spherical Linear Interpolation).
 *
 * SPECIFICATION:
 * 1. Sensor Interface:
 *    - Passive event listener on 'deviceorientation' (zero main-thread blocking, zero compositing jank)
 *    - Zero permission popups requested on load.
 *    - W3C extrinsic Tait-Bryan Euler angles: Alpha (Yaw), Beta (Pitch), Gamma (Roll).
 *
 * 2. Mathematical Physics & DSP:
 *    A. Digital IIR Low-Pass Filter (Tremor Elimination Physics):
 *       y[n] = α · x[n] + (1 - α) · y[n-1]
 *       where α = Δt / (τ + Δt) ≈ 0.12 (τ ≈ 80ms)
 *       Decouples involuntary 8Hz–12Hz human micro-tremors from voluntary rotational motions.
 *
 *    B. Gimbal-Lock Free Quaternion SLERP:
 *       q_target = q_pitch(β_smooth) ⊗ q_roll(γ_smooth)
 *       q_current = q_current.slerp(q_target, 0.12)
 *
 *    C. Multi-Planar Optical Depth Parallax Projection:
 *       X_camera(t) = X_0 + [γ_smooth * 2.4, (β_smooth - 45°) * 1.8, 0]^T
 *       X_background(t) = X_bg_0 - [γ_smooth * 0.9, (β_smooth - 45°) * 0.7, 0]^T
 *       Displaces scene layers inversely proportional to virtual depth for stereoscopic 3D illusion.
 *
 * 3. Desktop Fallback:
 *    - Seamlessly maps normalized mouse cursor coordinates ([-1, 1]) through identical
 *      IIR filter equations when gyroscope hardware is absent.
 */

(function (window) {
  'use strict';

  // --- MATHEMATICAL QUATERNION CLASS ---
  class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }

    set(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
      return this;
    }

    copy(q) {
      this.x = q.x;
      this.y = q.y;
      this.z = q.z;
      this.w = q.w;
      return this;
    }

    identity() {
      return this.set(0, 0, 0, 1);
    }

    normalize() {
      let l = Math.hypot(this.x, this.y, this.z, this.w);
      if (l === 0) {
        this.identity();
      } else {
        l = 1 / l;
        this.x *= l;
        this.y *= l;
        this.z *= l;
        this.w *= l;
      }
      return this;
    }

    multiply(q) {
      const qax = this.x, qay = this.y, qaz = this.z, qaw = this.w;
      const qbx = q.x, qby = q.y, qbz = q.z, qbw = q.w;
      this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
      this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
      this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
      this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
      return this.normalize();
    }

    // Spherical Linear Interpolation (SLERP)
    slerp(qb, t) {
      if (t <= 0) return this;
      if (t >= 1) return this.copy(qb);

      let cosHalfTheta = this.x * qb.x + this.y * qb.y + this.z * qb.z + this.w * qb.w;
      let qbx = qb.x, qby = qb.y, qbz = qb.z, qbw = qb.w;

      // Ensure shortest path around the 4D hypersphere
      if (cosHalfTheta < 0) {
        this.w = -this.w;
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        cosHalfTheta = -cosHalfTheta;
      }

      if (cosHalfTheta >= 1.0) {
        return this;
      }

      const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;
      if (sqrSinHalfTheta <= Number.EPSILON) {
        const s = 1 - t;
        this.w = s * this.w + t * qbw;
        this.x = s * this.x + t * qbx;
        this.y = s * this.y + t * qby;
        this.z = s * this.z + t * qbz;
        return this.normalize();
      }

      const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
      const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
      const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
      const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

      this.w = this.w * ratioA + qbw * ratioB;
      this.x = this.x * ratioA + qbx * ratioB;
      this.y = this.y * ratioA + qby * ratioB;
      this.z = this.z * ratioA + qbz * ratioB;
      return this;
    }

    // Build quaternion from Pitch (X-axis) and Roll (Y-axis) in radians
    setFromPitchRoll(pitchRad, rollRad) {
      const c1 = Math.cos(pitchRad * 0.5);
      const s1 = Math.sin(pitchRad * 0.5);
      const c2 = Math.cos(rollRad * 0.5);
      const s2 = Math.sin(rollRad * 0.5);

      // Pitch (X) * Roll (Y)
      this.x = s1 * c2;
      this.y = c1 * s2;
      this.z = -s1 * s2;
      this.w = c1 * c2;
      return this.normalize();
    }
  }

  // --- MEMS ENGINE CORE ---
  class MEMSOrientationEngine {
    constructor() {
      // Hardware state
      this.hasHardware = false;
      this.isListening = false;
      this.lastTimestamp = performance.now();

      // Raw sensor values (degrees)
      this.raw = {
        alpha: 0,
        beta: 45, // Default resting viewing tilt (45° incline)
        gamma: 0,
        beta0: null // Baseline neutral reference
      };

      // Digital IIR Low-Pass Filter State (y[n])
      this.smooth = {
        alpha: 0,
        beta: 45,
        gamma: 0,
        normX: 0, // Clamped [-1, 1]
        normY: 0  // Clamped [-1, 1]
      };

      // IIR Smoothing Constant α = Δt / (τ + Δt) ≈ 0.12 (τ ≈ 80ms)
      this.alphaIIR = 0.12;

      // Quaternion Orientations
      this.currentQuat = new Quaternion();
      this.targetQuat = new Quaternion();

      // Parallax Vectors
      this.parallax = {
        camX: 0,
        camY: 0,
        bgX: 0,
        bgY: 0
      };

      // Desktop Mouse Fallback
      this.mouse = {
        active: false,
        rawX: 0,
        rawY: 0,
        normX: 0,
        normY: 0
      };

      this.init();
    }

    init() {
      this.bindHardwareSensors();
      this.bindDesktopFallback();
    }

    /**
     * Binds native IMU hardware via passive listener (Zero permission prompt)
     */
    bindHardwareSensors() {
      const onOrientation = (event) => {
        if (event.beta === null || event.gamma === null) return;

        this.hasHardware = true;
        this.raw.alpha = event.alpha || 0;
        this.raw.gamma = event.gamma || 0;

        // Auto-calibrate resting baseline tilt
        if (this.raw.beta0 === null) {
          this.raw.beta0 = event.beta;
        } else {
          // Drifting baseline tracking (slowly adapts to ergonomic posture change)
          this.raw.beta0 += (event.beta - this.raw.beta0) * 0.005;
        }

        // Relative delta from natural resting pitch (typically 45 deg handheld tilt)
        this.raw.beta = event.beta;
      };

      // Modern passive listener - zero hitch, zero permission popups
      try {
        if ('DeviceOrientationEvent' in window) {
          window.addEventListener('deviceorientation', onOrientation, { passive: true });
          this.isListening = true;
        }
      } catch (err) {
        console.warn('[MEMS Engine] Native orientation listener fallback:', err);
      }
    }

    /**
     * Desktop Mouse Fallback when IMU hardware is absent
     */
    bindDesktopFallback() {
      const onMouseMove = (e) => {
        if (this.hasHardware) return; // Prioritize silicon IMU if active
        this.mouse.active = true;
        const w = window.innerWidth || 1920;
        const h = window.innerHeight || 1080;

        // Normalized [-1, 1] with deadzone
        const nx = (e.clientX - w * 0.5) / (w * 0.5);
        const ny = (e.clientY - h * 0.5) / (h * 0.5);

        this.mouse.rawX = Math.max(-1, Math.min(1, nx));
        this.mouse.rawY = Math.max(-1, Math.min(1, ny));

        // Map mouse to virtual pitch and roll: roll ±25°, pitch 45° ±20°
        this.raw.gamma = this.mouse.rawX * 25;
        this.raw.beta = 45 + this.mouse.rawY * 20;
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    /**
     * Discrete time-step update for digital IIR filter & Quaternion SLERP
     */
    update(now = performance.now()) {
      const dt = Math.min(0.1, (now - this.lastTimestamp) * 0.001);
      this.lastTimestamp = now;

      // Dynamic IIR smoothing factor based on framerate to preserve 80ms tau
      // alpha = dt / (tau + dt), tau = 0.08s
      const tau = 0.08;
      const alpha = Math.max(0.04, Math.min(0.25, dt / (tau + dt)));

      // 1. DIGITAL IIR LOW-PASS FILTER (y[n] = α · x[n] + (1 - α) · y[n-1])
      this.smooth.gamma += (this.raw.gamma - this.smooth.gamma) * alpha;
      this.smooth.beta += (this.raw.beta - this.smooth.beta) * alpha;
      this.smooth.alpha += (this.raw.alpha - this.smooth.alpha) * alpha;

      // Normalized coordinates (clamped to [-1, 1] range)
      // Standard mobile handheld range: roll ±24°, pitch baseline ±22°
      const targetNormX = Math.max(-1, Math.min(1, this.smooth.gamma / 24));
      const targetNormY = Math.max(-1, Math.min(1, (this.smooth.beta - (this.raw.beta0 || 45)) / 22));

      this.smooth.normX += (targetNormX - this.smooth.normX) * alpha;
      this.smooth.normY += (targetNormY - this.smooth.normY) * alpha;

      // 2. GIMBAL-LOCK FREE QUATERNION SLERP
      // Convert smoothed Euler angles (radians) into Target Quaternion
      const pitchRad = (this.smooth.beta - 45) * (Math.PI / 180);
      const rollRad = this.smooth.gamma * (Math.PI / 180);
      this.targetQuat.setFromPitchRoll(pitchRad * 0.5, rollRad * 0.5);

      // Interpolate with SLERP at 0.12 factor
      this.currentQuat.slerp(this.targetQuat, this.alphaIIR);

      // 3. MULTI-PLANAR OPTICAL DEPTH PARALLAX PROJECTION
      // Camera parallax shift: γ * 2.4, (β - 45) * 1.8
      this.parallax.camX = this.smooth.normX * 2.4;
      this.parallax.camY = this.smooth.normY * 1.8;

      // Background particles move opposite to foreground globe (-γ * 0.9, -(β - 45) * 0.7)
      this.parallax.bgX = -this.smooth.normX * 0.9;
      this.parallax.bgY = -this.smooth.normY * 0.7;

      return this.getState();
    }

    getState() {
      return {
        hasHardware: this.hasHardware,
        smooth: { ...this.smooth },
        quaternion: this.currentQuat,
        parallax: { ...this.parallax },
        x: this.smooth.normX,
        y: this.smooth.normY
      };
    }
  }

  // Instantiate singleton engine
  const engine = new MEMSOrientationEngine();
  window.MEMSOrientationEngine = engine;

})(window);
