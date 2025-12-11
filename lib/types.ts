// Tipos internos limpos (após adapter)
export interface Broker {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  // Métricas agregadas (preenchidas no ranking)
  salesValue?: number; // VGV
  salesVolume?: number;
  visitsCount?: number;
  proposalsCount?: number;
}

export interface Venda {
  id: string;
  corretorId: string;
  valor: number;
  volume?: number; // quantidade de imóveis no negócio
  visitsCount?: number;
  proposalsCount?: number;
  dataVenda: Date;
  imovelId?: string;
  imovelEndereco?: string;
}

export interface BrokerRanking {
  broker: Broker;
  valorTotal: number; // VGV
  quantidadeVendas: number; // volume
  visitsCount: number;
  proposalsCount: number;
  posicao: number;
}

// Novos períodos alinhados ao dropdown solicitado
export type Periodo =
  | "todos"
  | "vencidos"
  | "mes-anterior"
  | "ontem"
  | "hoje"
  | "amanha"
  | "esta-semana"
  | "proxima-semana"
  | "este-mes"
  | "proximo-mes"
  | "selecionar-periodo";

// Tipos da API Imoview (formato bruto)
export interface ImoviewCorretorRaw {
  Id?: string;
  id?: string;
  Nome?: string;
  nome?: string;
  Email?: string;
  email?: string;
  Foto?: string;
  foto?: string;
  FotoUrl?: string;
  fotoUrl?: string;
}

export interface ImoviewVendaRaw {
  Id?: string;
  id?: string;
  CorretorId?: string;
  corretorId?: string;
  Valor?: number;
  valor?: number;
  DataVenda?: string;
  dataVenda?: string;
  ImovelId?: string;
  imovelId?: string;
  ImovelEndereco?: string;
  imovelEndereco?: string;
  Status?: string;
  status?: string;
}


