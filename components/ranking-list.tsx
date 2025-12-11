"use client";

import { BrokerRanking } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface RankingListProps {
  ranking: BrokerRanking[];
  startIndex?: number;
}

export function RankingList({ ranking, startIndex = 3 }: RankingListProps) {
  const listItems = ranking.slice(startIndex);

  if (listItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {listItems.map((item, index) => (
        <motion.div
          key={item.broker.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className={`hover:bg-accent transition-colors ${
              index % 2 === 0 ? "bg-card" : "bg-muted/30"
            }`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-shrink-0 w-12 text-center">
                <span className="text-2xl font-bold text-muted-foreground">
                  #{item.posicao}
                </span>
              </div>

              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0 bg-primary/20">
                {item.broker.foto ? (
                  <Image
                    src={item.broker.foto}
                    alt={item.broker.nome}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                    {item.broker.nome.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {item.broker.nome}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.quantidadeVendas} {item.quantidadeVendas === 1 ? "venda" : "vendas"}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-bold text-success text-lg">
                  {formatCurrency(item.valorTotal)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

