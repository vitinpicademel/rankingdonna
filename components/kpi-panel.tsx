"use client";

import { BrokerRanking } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Trophy } from "lucide-react";

interface KPIPanelProps {
  ranking: BrokerRanking[];
  top3: BrokerRanking[];
}

export function KPIPanel({ ranking, top3 }: KPIPanelProps) {
  // Calcula totais do time
  const totalVendasTime = ranking.reduce((sum, item) => sum + item.quantidadeVendas, 0);
  const totalValorTime = ranking.reduce((sum, item) => sum + item.valorTotal, 0);

  // Calcula totais do pódio (Top 3)
  const totalVendasPodio = top3.reduce((sum, item) => sum + item.quantidadeVendas, 0);
  const totalValorPodio = top3.reduce((sum, item) => sum + item.valorTotal, 0);

  // Percentual do pódio em relação ao total
  const percentualPodio = totalValorTime > 0 
    ? ((totalValorPodio / totalValorTime) * 100).toFixed(1)
    : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* KPI 1: Vendas Totais do Time */}
      <Card className="bg-gradient-to-br from-card to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">TOTAL DO TIME</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
              {formatCurrency(totalValorTime)}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalVendasTime} {totalVendasTime === 1 ? "venda" : "vendas"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI 2: Performance do Pódio */}
      <Card className="bg-gradient-to-br from-card to-gold/10 border-gold/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-gold/20">
              <Trophy className="w-6 h-6 text-gold" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">TOP 3</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
              {formatCurrency(totalValorPodio)}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalVendasPodio} {totalVendasPodio === 1 ? "venda" : "vendas"} • {percentualPodio}% do total
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI 3: Média por Venda */}
      <Card className="bg-gradient-to-br from-card to-emerald-500/10 border-emerald-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">TICKET MÉDIO</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
              {formatCurrency(totalVendasTime > 0 ? totalValorTime / totalVendasTime : 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              Por venda
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

