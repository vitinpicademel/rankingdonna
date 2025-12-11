"use client";

import { BrokerRanking } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface DetailedRankingListProps {
  ranking: BrokerRanking[];
  startIndex?: number;
}

export function DetailedRankingList({ ranking, startIndex = 3 }: DetailedRankingListProps) {
  const listItems = ranking.slice(startIndex);

  if (listItems.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Nenhum corretor nesta posição.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {listItems.map((item, index) => {
        // Simula metas (3/5 vendas, por exemplo)
        const metaVendas = 5;
        const progresso = Math.min((item.quantidadeVendas / metaVendas) * 100, 100);

        return (
          <motion.div
            key={item.broker.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`hover:bg-accent/50 transition-all duration-200 border-l-2 ${
                index % 2 === 0 ? "bg-card" : "bg-muted/20"
              } ${
                item.posicao === 4
                  ? "border-l-primary"
                  : item.posicao === 5
                  ? "border-l-gold"
                  : "border-l-muted"
              }`}
            >
              <CardContent className="py-2.5 px-2 md:py-3 md:px-2.5">
                <div className="flex items-center gap-2 md:gap-2.5">
                  {/* Posição */}
                  <div className="flex-shrink-0 w-8 md:w-9 text-center">
                    <span className="text-lg md:text-xl font-bold text-muted-foreground">
                      #{item.posicao}
                    </span>
                  </div>

                  {/* Foto */}
                  <Avatar
                    src={item.broker.foto}
                    alt={item.broker.nome}
                    size="sm"
                    borderColor="primary"
                    className="w-12 h-12 md:w-14 md:h-14"
                  />

                  {/* Informações principais */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm md:text-base text-foreground truncate">
                        {item.broker.nome}
                      </p>
                      <p className="font-bold text-success text-sm md:text-base flex-shrink-0 ml-2">
                        {formatCurrency(item.valorTotal)}
                      </p>
                    </div>

                    {/* Métricas adicionais */}
                    <div className="text-[11px] md:text-xs text-muted-foreground mb-1 flex flex-wrap gap-2">
                      <span className="bg-muted/50 px-2 py-0.5 rounded-full">
                        📊 {item.quantidadeVendas} {item.quantidadeVendas === 1 ? "venda" : "vendas"}
                      </span>
                      <span className="bg-muted/50 px-2 py-0.5 rounded-full">
                        👣 {item.visitsCount || 0} visitas
                      </span>
                      <span className="bg-muted/50 px-2 py-0.5 rounded-full">
                        📝 {item.proposalsCount || 0} propostas
                      </span>
                    </div>

                    {/* Metas e Progresso - Compacto */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                        {item.quantidadeVendas} {item.quantidadeVendas === 1 ? "venda" : "vendas"}
                      </span>
                      <Progress value={progresso} className="h-1.5 flex-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

