"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Users } from "lucide-react";
import { Periodo } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const teams = [
  { value: "todos", label: "Todos os Times", icon: Users },
  { value: "alto-padrao", label: "Time Alto Padrão", icon: Users },
  { value: "economico", label: "Time Econômico", icon: Users },
  { value: "mcmv", label: "Time MCMV", icon: Users },
];

const periods: { value: Periodo; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "vencidos", label: "Vencidos" }, // default
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

interface TeamFilterProps {
  selectedTeam: string;
  selectedPeriod: Periodo;
  onTeamChange: (team: string) => void;
  onPeriodChange: (period: Periodo) => void;
}

export function TeamFilter({
  selectedTeam,
  selectedPeriod,
  onTeamChange,
  onPeriodChange,
}: TeamFilterProps) {
  const selectedTeamLabel = teams.find((t) => t.value === selectedTeam)?.label || "Todos";
  const selectedPeriodLabel = periods.find((p) => p.value === selectedPeriod)?.label || "Vencidos";

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-2 flex-1">
        <Users className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filtrar por:</span>
        <div className="flex gap-2">
          {teams.map((team) => {
            const Icon = team.icon;
            return (
              <Button
                key={team.value}
                variant={selectedTeam === team.value ? "default" : "outline"}
                size="sm"
                onClick={() => onTeamChange(team.value)}
                className={cn(
                  "gap-2",
                  selectedTeam === team.value &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Icon className="w-4 h-4" />
                {team.label}
              </Button>
            );
          })}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            {selectedPeriodLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {periods.map((period) => (
            <DropdownMenuItem
              key={period.value}
              onClick={() => onPeriodChange(period.value)}
              className={selectedPeriod === period.value ? "bg-accent" : ""}
            >
              {period.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

