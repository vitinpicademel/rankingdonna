"use client";

import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";

// URL do som de caixa registradora (pode ser um arquivo local ou URL)
const CASH_REGISTER_SOUND = "/sounds/cash-register.mp3";

export function useCashRegisterSound(trigger: boolean = false) {
  const soundRef = useRef<Howl | null>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Inicializa o som apenas se o arquivo existir
    try {
      soundRef.current = new Howl({
        src: [CASH_REGISTER_SOUND],
        volume: 0.5,
        preload: false, // Não preload para evitar 404 no console
        onload: () => {
          isLoadedRef.current = true;
        },
        onloaderror: (id, error) => {
          // Silenciosamente ignora erro de carregamento
          isLoadedRef.current = false;
        },
      });
    } catch (error) {
      // Silenciosamente ignora erro de inicialização
      isLoadedRef.current = false;
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const play = useCallback(() => {
    if (soundRef.current && isLoadedRef.current) {
      try {
        soundRef.current.play();
      } catch (error) {
        console.warn("Erro ao tocar som:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (trigger) {
      play();
    }
  }, [trigger, play]);

  return { play };
}

