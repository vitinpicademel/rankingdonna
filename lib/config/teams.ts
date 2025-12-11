/**
 * Mapeamento de Times por Nome do Corretor
 * 
 * Adicione os nomes exatos dos corretores em cada time.
 * Os nomes devem corresponder exatamente ao campo `nome` do Broker.
 */

export const TEAMS_MAPPING = {
  "alto-padrao": [
    "Alcino da Silva",
    "Jaqueline Rodrigues Vasconcelos",
    "Lauanda Azara",
    "Lilian Bruna Alves Lemes",
    "Lorena Fernandes",
    "Marcio Adriano",
    "Rafael Melo Pereira",
  ],
  "economico": [
    "Cinara de Freitas",
    "Hugo Said Tocantins",
    "Leticia Aparecida Valu Cardoso",
    "Morena Rojas",
    "Nayara Santiago",
    "Paula Ressurreição da Rosa",
    "Pedro Tito Prata",
    "Ricardo Augusto de Souza",
    "Rubismar Almeida Costa",
    "Vanessa Freitas",
    "Wellington Antonio dos Reis",
  ],
  "mcmv": [
    "Carla Cardinale",
    "Gabrielle Cristina dos Santos",
    "Giovanna Ferreira Miranda",
    "Jefferson Silva de Sousa",
    "João Pablo Telles Ribeiro",
    "Levi José Ávila da Silva",
    "Mariane Soares Rodrigues",
    "Matheus Santiago Marques De Almeida",
    "Tainara Cristina Portela",
    "Victor Hugo Rocha Menezes Rodrigues",
    "Willen Marcus Marins Santiago",
  ],
} as const;

export type TeamKey = keyof typeof TEAMS_MAPPING;

/**
 * Retorna os nomes dos corretores de um time específico
 */
export function getTeamMembers(team: TeamKey): string[] {
  return [...TEAMS_MAPPING[team]];
}

/**
 * Verifica se um corretor pertence a um time específico
 */
export function isCorretorInTeam(corretorNome: string, team: TeamKey): boolean {
  const members = getTeamMembers(team);
  return members.includes(corretorNome);
}

/**
 * Retorna o time de um corretor (ou null se não pertencer a nenhum)
 */
export function getCorretorTeam(corretorNome: string): TeamKey | null {
  for (const team of Object.keys(TEAMS_MAPPING) as TeamKey[]) {
    if (getTeamMembers(team).includes(corretorNome)) {
      return team;
    }
  }
  return null;
}

/**
 * Filtra um ranking por time específico
 */
export function filterRankingByTeam<T extends { broker: { nome: string } }>(
  ranking: T[],
  team: string
): T[] {
  if (team === "todos") {
    return ranking;
  }

  const teamKey = team as TeamKey;
  const teamMembers = getTeamMembers(teamKey);

  if (teamMembers.length === 0) {
    // Se o time não tem membros definidos, retorna todos
    return ranking;
  }

  return ranking.filter((item) => teamMembers.includes(item.broker.nome));
}

