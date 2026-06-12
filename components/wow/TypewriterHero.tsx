"use client";

import { useEffect, useRef, useState } from "react";

const PHRASES = [
  "es el lenguaje del futuro.",
  "es el lenguaje del presente.",
  "es el lenguaje del ahora.",
  "**********",
];

/**
 * TypewriterHero — WOW element v2
 *
 * Reemplaza el marquee. El efecto de escritura corre sobre la segunda
 * línea del H1. El contenedor tiene altura fija (typewriter-container)
 * para que el layout NO se redimensione mientras cambia el texto.
 *
 * Fases: typing → pause → deleting → next phrase
 */
export default function TypewriterHero() {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const phraseIdx = useRef(0);
  const charIdx   = useRef(0);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx.current];

    if (phase === "typing") {
      if (charIdx.current < phrase.length) {
        const t = setTimeout(() => {
          charIdx.current++;
          setDisplayed(phrase.slice(0, charIdx.current));
        }, 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pausing"), 300);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 777);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (charIdx.current > 0) {
        const t = setTimeout(() => {
          charIdx.current--;
          setDisplayed(phrase.slice(0, charIdx.current));
        }, 60);
        return () => clearTimeout(t);
      } else {
        phraseIdx.current = (phraseIdx.current + 1) % PHRASES.length;
        const t = setTimeout(() => setPhase("typing"), 120);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, phase]);

  return (
    <h1 className="font-display font-bold text-display-2xl text-carbon typewriter-container bg-surface">
      <div className="block">
      <span>La </span>
      <span className="text-sky">programacion </span>
      </div>
      <span className="block">
        <span>{displayed}</span>
        <span className="typewriter-cursor" aria-hidden />
      </span>
    </h1>
  );
}
