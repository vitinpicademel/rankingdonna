"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export function DashboardHeader() {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full max-w-[100vw] overflow-x-hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Card className="border-0 rounded-none bg-gradient-to-r from-background via-background to-primary/5">
        <div className="w-full max-w-full px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="Donna Negociações Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                  priority
                  unoptimized
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                  <span className="text-2xl font-bold text-primary">I</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-gold bg-clip-text text-transparent">
                Ranking de Vendas Donna Negociações Imobiliárias
              </h1>
              <p className="text-sm text-muted-foreground">Dashboard de Performance</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span>Atualização em tempo real</span>
          </div>
        </div>
      </Card>
    </header>
  );
}

