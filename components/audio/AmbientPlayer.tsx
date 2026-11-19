"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import { soundEngine } from "./soundManager";

interface AmbientPlayerProps {
  title?: string;
  location?: string;
}

export default function AmbientPlayer({
  title = "Tadoba Dawn Chorus & Alarm Calls",
  location = "20.246° N, 79.312° E",
}: AmbientPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine?.getMuted?.() ?? false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Atmospheric field drone simulation (136.1 Hz om / forest resonance)
      osc.type = "sine";
      osc.frequency.setValueAtTime(136.1, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      osc.start();

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      oscRef.current = osc;
      gainNodeRef.current = gain;
    }
  };

  const togglePlay = () => {
    if (!isPlaying) {
      initAudio();
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(isMuted ? 0 : 0.05, audioContextRef.current.currentTime, 0.2);
      }
      setIsPlaying(true);
    } else {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.2);
      }
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    const muted = soundEngine?.toggleMute?.() ?? false;
    setIsMuted(muted);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        muted || !isPlaying ? 0 : 0.05,
        audioContextRef.current.currentTime,
        0.1
      );
    }
  };

  // Dynamic canvas audio visualizer wave
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const bufferLength = analyserRef.current?.frequencyBinCount || 32;
      const dataArray = new Uint8Array(bufferLength);
      if (isPlaying && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isPlaying ? "#e5a93c" : "rgba(255, 255, 255, 0.2)";

      const sliceWidth = width / 40;
      let x = 0;

      for (let i = 0; i < 40; i++) {
        const freq = isPlaying ? (dataArray[i % bufferLength] / 255) * 16 : 0;
        const wave = Math.sin(phase + i * 0.3) * (isPlaying ? 6 + freq : 2);
        const y = height / 2 + wave;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
      phase += isPlaying ? 0.08 : 0.02;
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying]);

  // Cleanup AudioContext and oscillator on unmount to prevent Web Audio resource leaks
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      try {
        oscRef.current?.stop();
      } catch {
        // osc may already be stopped
      }
      audioContextRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10 my-6 shadow-xl">
      <div className="flex items-center gap-3.5">
        <button
          onClick={togglePlay}
          type="button"
          aria-label={isPlaying ? "Pause dispatch audio" : "Play dispatch audio"}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <h4 className="font-mono text-xs md:text-sm font-medium text-slate-100">
              {title}
            </h4>
          </div>
          <p className="font-mono text-[11px] text-slate-400 mt-0.5">
            LOCATION: {location} // ARCHIVED HYDROPHONE & FIELD MIC
          </p>
        </div>
      </div>

      {/* Visualizer Wave + Mute Toggle */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <canvas
          ref={canvasRef}
          width={180}
          height={36}
          className="w-[140px] md:w-[180px] h-[36px] rounded opacity-90"
        />

        <button
          onClick={handleMuteToggle}
          type="button"
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          className="p-2 rounded-full glass-pill border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-400 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>
    </div>
  );
}
