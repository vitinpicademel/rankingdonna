"use client";

import { useState, useEffect, useMemo } from "react";
import { Periodo } from "@/lib/types";
import { useRanking } from "@/lib/hooks/use-ranking";
import { useCashRegisterSound } from "@/lib/hooks/use-sound";
import { DashboardHeader } from "@/components/dashboard-header";
import { KPIPanel } from "@/components/kpi-panel";
import { TeamFilter } from "@/components/team-filter";
import { Podium } from "@/components/podium";
import { DetailedRankingList } from "@/components/detailed-ranking-list";
import { SidebarPanel } from "@/components/sidebar-panel";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { imoviewService } from "@/lib/services/imoview";
import { getPeriodDates } from "@/lib/utils";
import { filterRankingByTeam } from "@/lib/config/teams";

export default function Home() {
  const [periodo, setPeriodo] = useState<Periodo>("vencidos");
  const [selectedTeam, setSelectedTeam] = useState<string>("todos");
  const { play } = useCashRegisterSound();
  const { ranking, isLoading } = useRanking(periodo, play);

  // Busca vendas para o sidebar
  const { start, end } = getPeriodDates(periodo);
  const { data: vendas } = useQuery({
    queryKey: ["vendas", periodo, start.toISOString(), end.toISOString()],
    queryFn: () => imoviewService.fetchVendas({ start, end }),
    refetchInterval: 60 * 1000,
  });

  // Toca som ao carregar a página (apenas uma vez)
  useEffect(() => {
    const timer = setTimeout(() => {
      play();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtra o ranking por time selecionado
  const filteredRanking = useMemo(() => {
    return filterRankingByTeam(ranking, selectedTeam);
  }, [ranking, selectedTeam]);

  const top3 = filteredRanking.slice(0, 3);
  const rest = filteredRanking.slice(3);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden min-h-screen bg-background">
      <Toaster />
      <DashboardHeader />

      <main className="w-full max-w-[100vw] min-h-screen px-4 md:px-6 lg:px-8 pr-6 py-6 md:py-8">
        {/* KPIs Panel */}
        <KPIPanel ranking={filteredRanking} top3={top3} />

        {/* Filtros */}
        <TeamFilter
          selectedTeam={selectedTeam}
          selectedPeriod={periodo}
          onTeamChange={setSelectedTeam}
          onPeriodChange={setPeriodo}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando ranking...</span>
          </div>
        ) : ranking.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                Nenhuma venda encontrada no período selecionado.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Layout de 3 Colunas - Full Width com Grid Flexível */
          <div className="grid grid-cols-1 lg:grid-cols-[4fr_3fr_3fr] gap-6 w-full max-w-[100vw] overflow-x-hidden px-6">
            {/* Coluna 1: Pódio (Top 3) - Mais Evidente */}
            <div className="w-full min-w-0">
              <Card className="h-full bg-gradient-to-br from-card to-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent">
                    🏆 Top 3
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-4 lg:px-6 py-6 md:py-8">
                  {top3.length > 0 ? (
                    <Podium top3={top3} />
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Insuficiente para formar pódio
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Coluna 2: Classificação Geral - Compacta */}
            <div className="w-full min-w-0 max-w-full overflow-hidden">
              <Card className="h-full w-full max-w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg md:text-xl font-bold">Classificação Geral</CardTitle>
                </CardHeader>
                <CardContent className="w-full max-w-full overflow-x-hidden px-2 md:px-3">
                  {rest.length > 0 ? (
                    <DetailedRankingList ranking={filteredRanking} startIndex={3} />
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum corretor nesta posição
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Coluna 3: Sidebar (Metas & Últimas Vendas) */}
            <div className="w-full min-w-0 max-w-full overflow-hidden">
              <SidebarPanel
                ranking={filteredRanking}
                vendas={vendas || []}
                currentBrokerId={filteredRanking[0]?.broker.id}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
