"use client";

import { Periodo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const periods: { value: Periodo; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "vencidos", label: "Vencidos" },
  { value: "mes-anterior", label: "Mês anterior" },
  { value: "ontem", label: "Ontem" },
  { value: "hoje", label: "Hoje" },
  { value: "amanha", label: "Amanhã" },
  { value: "esta-semana", label: "Esta semana" },
  { value: "proxima-semana", label: "Próxima semana" },
  { value: "este-mes", label: "Este mês" },
  { value: "proximo-mes", label: "Próximo mês" },
  { value: "selecionar-periodo", label: "Selecionar período" },
];

interface PeriodFilterProps {
  selectedPeriod: Periodo;
  onPeriodChange: (period: Periodo) => void;
}

export function PeriodFilter({ selectedPeriod, onPeriodChange }: PeriodFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={selectedPeriod === period.value ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(period.value)}
          className={cn(
            selectedPeriod === period.value &&
              "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
}


