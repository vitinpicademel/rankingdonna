import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useEffect, useCallback } from "react";
import { imoviewService } from "@/lib/services/imoview";
import { BROKER_AVATARS } from "@/lib/config/broker-photos";
import { BrokerRanking, Periodo } from "@/lib/types";
import { getPeriodDates } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function useRanking(periodo: Periodo, onNewSale?: () => void) {
  const { toast } = useToast();
  const previousDataHash = useRef<string>("");

  const { start, end } = getPeriodDates(periodo);

  const { data: corretores, isLoading: isLoadingCorretores } = useQuery({
    queryKey: ["corretores"],
    queryFn: () => imoviewService.fetchCorretores(),
  });

  const { data: vendas, isLoading: isLoadingVendas } = useQuery({
    queryKey: ["vendas", periodo, start.toISOString(), end.toISOString()],
    queryFn: () => imoviewService.fetchVendas({ start, end }),
    refetchInterval: 60 * 1000, // Polling a cada 60s
  });

  // Calcula o ranking
  const ranking = useMemo<BrokerRanking[]>(() => {
    if (!corretores || !vendas) return [];

    // Agrupa vendas por corretor (left join: todos corretores entram, mesmo com 0)
    const vendasPorCorretor = new Map<
      string,
      { valorTotal: number; quantidade: number; visitas: number; propostas: number }
    >();

    vendas.forEach((venda) => {
      const atual =
        vendasPorCorretor.get(venda.corretorId) || {
          valorTotal: 0,
          quantidade: 0,
          visitas: 0,
          propostas: 0,
        };
      const volume = venda.volume ?? 1;
      const visitas = venda.visitsCount ?? 0;
      const propostas = venda.proposalsCount ?? 0;

      vendasPorCorretor.set(venda.corretorId, {
        valorTotal: atual.valorTotal + venda.valor,
        quantidade: atual.quantidade + volume,
        visitas: atual.visitas + visitas,
        propostas: atual.propostas + propostas,
      });
    });

    // Cria ranking ordenado por valor total, mantendo quem tem 0
    const normalize = (name: string) => name.trim().toLowerCase();

    // Aplica fotos configuradas localmente quando houver
    const corretoresComFoto = corretores.map((broker) => {
      const norm = normalize(broker.nome);
      const foto = BROKER_AVATARS[norm];
      if (foto) {
        return { ...broker, foto };
      }
      return broker;
    });

    const rankingArray: BrokerRanking[] = corretoresComFoto
      .map((broker) => {
        const stats =
          vendasPorCorretor.get(broker.id) || {
            valorTotal: 0,
            quantidade: 0,
            visitas: 0,
            propostas: 0,
          };
        return {
          broker,
          valorTotal: stats.valorTotal,
          quantidadeVendas: stats.quantidade,
          visitsCount: stats.visitas,
          proposalsCount: stats.propostas,
          posicao: 0, // Será calculado depois
        };
      })
      .sort((a, b) => b.valorTotal - a.valorTotal);

    // Atribui posições
    rankingArray.forEach((item, index) => {
      item.posicao = index + 1;
    });

    return rankingArray;
  }, [corretores, vendas]);

  // Detecta mudanças nos dados (nova venda)
  useEffect(() => {
    if (!vendas || vendas.length === 0) {
      // Inicializa o hash na primeira carga
      if (!previousDataHash.current) {
        previousDataHash.current = "[]";
      }
      return;
    }

    // Cria hash simples dos IDs das vendas ordenadas
    const vendasIds = vendas.map((v) => v.id).sort().join(",");
    const dataHash = vendasIds;

    if (previousDataHash.current && previousDataHash.current !== dataHash) {
      // Nova venda detectada!
      const idsAnteriores = previousDataHash.current.split(",").filter(Boolean);
      const idsAtuais = dataHash.split(",").filter(Boolean);
      
      // Encontra o ID da nova venda
      const novaVendaId = idsAtuais.find((id) => !idsAnteriores.includes(id));

      if (novaVendaId) {
        const novaVenda = vendas.find((v) => v.id === novaVendaId);
        const corretor = novaVenda ? corretores?.find((c) => c.id === novaVenda.corretorId) : null;
        
        if (corretor) {
          // Toca o som
          onNewSale?.();
          
          toast({
            title: "🎉 Nova Venda Detectada!",
            description: `Parabéns ${corretor.nome}!`,
            variant: "success",
          });
        }
      }
    }

    previousDataHash.current = dataHash;
  }, [vendas, corretores, toast, onNewSale]);

  return {
    ranking,
    isLoading: isLoadingCorretores || isLoadingVendas,
  };
}

