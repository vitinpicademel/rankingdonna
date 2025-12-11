"use client";

import { BrokerRanking } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface PodiumProps {
  top3: BrokerRanking[];
}

export function Podium({ top3 }: PodiumProps) {
  const [first, second, third] = top3;

  const podiumItems = [
    { 
      rank: second, 
      position: "left", 
      medal: "silver", 
      height: "h-[360px]",
      delay: 0.1,
      floatDelay: 0,
    },
    { 
      rank: first, 
      position: "center", 
      medal: "gold", 
      height: "h-[420px]",
      delay: 0,
      floatDelay: 0.3,
      scale: 1.1,
      zIndex: 20,
    },
    { 
      rank: third, 
      position: "right", 
      medal: "bronze", 
      height: "h-[320px]",
      delay: 0.2,
      floatDelay: 0.6,
    },
  ].filter((item) => item.rank);

  return (
    <div className="w-full h-full flex items-end justify-center relative py-10">
      {podiumItems.map((item, index) => {
        const isGold = item.medal === "gold";
        
        // Estilos premium por medalha
        const medalStyles = {
          gold: {
            border: "border-4 border-yellow-400",
            shadow: "shadow-[0_0_40px_-5px_rgba(234,179,8,0.6)]",
            gradient: "bg-gradient-to-b from-yellow-500/20 via-yellow-600/30 to-yellow-900/40",
            glow: "shadow-[0_0_50px_-5px_rgba(234,179,8,0.8)]",
          },
          silver: {
            border: "border-4 border-slate-300",
            shadow: "shadow-[0_0_25px_rgba(203,213,225,0.5)]",
            gradient: "bg-gradient-to-b from-slate-200/20 via-slate-300/30 to-slate-500/40",
            glow: "shadow-[0_0_30px_rgba(203,213,225,0.6)]",
          },
          bronze: {
            border: "border-4 border-orange-700",
            shadow: "shadow-[0_0_25px_rgba(194,65,12,0.5)]",
            gradient: "bg-gradient-to-b from-orange-600/20 via-orange-700/30 to-orange-900/40",
            glow: "shadow-[0_0_30px_rgba(194,65,12,0.6)]",
          },
        };

        const styles = medalStyles[item.medal as keyof typeof medalStyles];

        return (
          <motion.div
            key={item.rank.broker.id}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: item.scale || 1,
            }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: item.delay,
            }}
            // Animação de flutuação contínua
            whileHover={{ scale: (item.scale || 1) * 1.02 }}
            className={cn(
              "flex flex-col items-center flex-1 relative max-w-[33.333%]",
              item.position === "center" ? "order-2" : item.position === "left" ? "order-1" : "order-3"
            )}
            style={{
              zIndex: item.zIndex || 10,
            }}
          >
            {/* Animação de flutuação */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2.5 + item.floatDelay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full"
            >
              {/* Card do Pódio */}
              <div
                className={cn(
                  "relative w-full max-w-full rounded-t-3xl flex flex-col items-center justify-end p-4 md:p-6 transition-all",
                  item.height,
                  styles.border,
                  styles.shadow,
                  styles.gradient,
                  "backdrop-blur-sm",
                  isGold && "ring-2 ring-yellow-400/50"
                )}
              >
                {/* Glow effect no hover */}
                <div className={cn(
                  "absolute inset-0 rounded-t-3xl opacity-0 hover:opacity-100 transition-opacity duration-300",
                  styles.glow
                )} />

                {/* Coroa para o 1º lugar */}
                {isGold && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: item.delay + 0.3, type: "spring", stiffness: 200 }}
                    className="absolute -top-12 md:-top-16"
                  >
                    <Crown className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 drop-shadow-2xl" fill="currentColor" />
                  </motion.div>
                )}

                {/* Badge de posição para 2º e 3º */}
                {!isGold && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: item.delay + 0.2, type: "spring" }}
                    className={cn(
                      "absolute -top-8 md:-top-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl shadow-xl",
                      item.medal === "silver" 
                        ? "bg-slate-300 text-slate-800 border-2 border-slate-400" 
                        : "bg-orange-700 text-white border-2 border-orange-800"
                    )}
                  >
                    {item.medal === "silver" ? "2" : "3"}
                  </motion.div>
                )}

                {/* Avatar */}
                <div className="mb-4 md:mb-6 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar
                      src={item.rank.broker.foto}
                      alt={item.rank.broker.nome}
                      size="lg"
                      borderColor="strong"
                      className={cn(
                        "w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28",
                        isGold && "ring-4 ring-yellow-400/50"
                      )}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Informações abaixo do card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: item.delay + 0.4 }}
              className="mt-8 md:mt-10 text-center space-y-3 md:space-y-4 w-full px-2"
            >
              <p className={cn(
                "font-bold text-foreground truncate",
                isGold ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
              )}>
                {item.rank.broker.nome}
              </p>
              <p className={cn(
                "text-success font-bold",
                isGold ? "text-xl md:text-2xl lg:text-3xl" : "text-lg md:text-xl"
              )}>
                {formatCurrency(item.rank.valorTotal)}
              </p>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                {item.rank.quantidadeVendas} {item.rank.quantidadeVendas === 1 ? "venda" : "vendas"}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
