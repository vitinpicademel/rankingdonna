"use client";

import { BrokerRanking, Venda } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarPanelProps {
  ranking: BrokerRanking[];
  vendas?: Venda[];
  currentBrokerId?: string; // ID do corretor logado (simulado)
}

export function SidebarPanel({ ranking, vendas = [], currentBrokerId }: SidebarPanelProps) {
  // Simula dados do corretor logado (ou pega o primeiro do ranking)
  const currentBroker = currentBrokerId
    ? ranking.find((r) => r.broker.id === currentBrokerId)
    : ranking[0];

  // Meta mensal simulada
  const metaMensal = 2000000; // R$ 2.000.000
  const valorAtual = currentBroker?.valorTotal || 0;
  const percentualMeta = Math.min((valorAtual / metaMensal) * 100, 100);

  // Últimas vendas (ordena por data mais recente)
  const ultimasVendas = [...vendas]
    .sort((a, b) => b.dataVenda.getTime() - a.dataVenda.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* Seção 1: Minhas Metas */}
      {currentBroker && (
        <Card className="w-full max-w-full bg-gradient-to-br from-card to-primary/10 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Minhas Metas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Meta Mensal</span>
                <span className="text-sm font-semibold text-foreground">
                  {percentualMeta.toFixed(1)}%
                </span>
              </div>
              <Progress value={percentualMeta} className="h-3 mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(valorAtual)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(metaMensal)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Minha Posição</span>
                <span className="text-2xl font-bold text-primary">
                  #{currentBroker.posicao}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Vendas</span>
                <span className="text-sm font-semibold">
                  {currentBroker.quantidadeVendas}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seção 2: Últimas Vendas */}
      <Card className="w-full max-w-full bg-gradient-to-br from-card to-emerald-500/10 border-emerald-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-lg">Últimas Vendas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {ultimasVendas.length > 0 ? (
                ultimasVendas.map((venda, index) => {
                  const corretor = ranking.find((r) => r.broker.id === venda.corretorId);
                  if (!corretor) return null;

                  return (
                    <motion.div
                      key={venda.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-background/50 border border-emerald-500/20 hover:bg-emerald-500/5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {corretor.broker.nome}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            fechou {formatCurrency(venda.valor)}
                          </p>
                          <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Parabenize!
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(venda.dataVenda).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma venda recente
                </p>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

