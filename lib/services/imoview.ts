import axios, { AxiosInstance } from "axios";
import { Broker, Venda, ImoviewCorretorRaw, ImoviewVendaRaw } from "@/lib/types";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { TEAMS_MAPPING } from "@/lib/config/teams";

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true" || process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
const API_KEY = process.env.NEXT_PUBLIC_IMOVIEW_API_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_IMOVIEW_BASE_URL || "https://api.imoview.com.br/";
const API_USER = process.env.NEXT_PUBLIC_IMOVIEW_API_USER || "";
const API_PASSWORD = process.env.NEXT_PUBLIC_IMOVIEW_API_PASSWORD || "";
const IS_BROWSER = typeof window !== "undefined";

// Helpers de normalização
const normalizeName = (name: string) => name.trim().toLowerCase();
const slugifyName = (name: string) => normalizeName(name).replace(/\s+/g, "-");

// Helper: converte strings pt-BR de moeda em número (R$ 1.200.000,50 -> 1200000.50)
const parseCurrencyString = (value: any): number => {
  if (value == null) return 0;
  if (typeof value === "number") return value;

  const stringVal = String(value);
  // Remove tudo que não for dígito ou vírgula (milhar/pontuação, símbolos, espaços)
  const cleaned = stringVal
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "") // remove separadores de milhar
    .replace(/,/g, ".")
    .trim();

  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Helper: converte datas do Imoview (DD/MM/YYYY ou DD/MM/YYYY HH:mm) em Date
const parseImoviewDate = (dateLike: any): Date | null => {
  if (!dateLike) return null;
  if (dateLike instanceof Date && !isNaN(dateLike.getTime())) return dateLike;

  const str = String(dateLike).trim();
  // Tenta formato DD/MM/YYYY
  const [datePart] = str.split(" ");
  const parts = datePart.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts.map((p) => Number(p));
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const d = new Date(year, month - 1, day);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // Fallback para Date parser
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

// Cria esqueletos de corretores a partir do mapeamento estático
const buildBrokersFromTeams = (): Broker[] => {
  const brokersMap = new Map<string, Broker>();
  Object.values(TEAMS_MAPPING).forEach((teamList) => {
    teamList.forEach((name) => {
      const id = slugifyName(name);
      if (!brokersMap.has(id)) {
        brokersMap.set(id, {
          id,
          nome: name,
          email: "",
          foto: DEFAULT_AVATAR_URL,
        });
      }
    });
  });
  return Array.from(brokersMap.values());
};

// Tenta extrair o valor de venda percorrendo múltiplos campos comuns
const extractSaleValue = (item: any): number => {
  const candidates = [
    item?.valor_venda,
    item?.valor_total,
    item?.valor_fechamento,
    item?.valor,
    item?.valorNegocio,
    item?.valornegocio,
    item?.valor_proposta,
    item?.valorProposta,
    item?.valorFechamento,
    item?.valor_fechar,
    item?.imovel?.valor,
    item?.imovel?.Valor,
    item?.proposta?.valor,
    item?.proposta?.Valor,
  ];

  for (const candidate of candidates) {
    const parsed = parseCurrencyString(candidate);
    if (parsed > 0) return parsed;
  }

  // Último fallback
  return 0;
};

// Se não tiver chave, não dá para usar API real. Endpoints App_ exigem user/senha.
const HAS_APP_CREDENTIALS = !!(API_USER && API_PASSWORD);
const SHOULD_USE_MOCK = USE_MOCK_DATA || !API_KEY;

// Cliente Axios configurado (usa proxy /api/imoview no browser para evitar CORS)
const createAxiosClient = (): AxiosInstance => {
  const baseURL = IS_BROWSER ? "/api/imoview/" : BASE_URL;
  const client = axios.create({
    baseURL,
    headers: {
      chave: API_KEY,
      "Content-Type": "application/json",
    },
  });

  // Interceptor para logs (opcional)
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Imoview API Error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

// Cliente Axios para endpoints App_ (requer codigoacesso)
const createAppAxiosClient = async (): Promise<AxiosInstance> => {
  const baseClient = createAxiosClient();
  
  // Obtém codigoacesso via autenticação
  let codigoAcesso = "";
  if (API_USER && API_PASSWORD) {
    try {
      const authResponse = await baseClient.get<{ CodigoAcesso?: string; codigoacesso?: string }>(
        "/Usuario/App_ValidarAcesso",
        {
          params: {
            usuario: API_USER,
            senha: API_PASSWORD,
          },
        }
      );
      codigoAcesso = authResponse.data.CodigoAcesso || authResponse.data.codigoacesso || "";
    } catch (error) {
      console.error("Erro ao autenticar na API Imoview:", error);
    }
  }

  const appClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      chave: API_KEY,
      codigoacesso: codigoAcesso,
      "Content-Type": "application/json",
    },
  });

  appClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Imoview App API Error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return appClient;
};

// Adapter: Transforma dados brutos da API em formato interno limpo
const adaptCorretor = (raw: ImoviewCorretorRaw): Broker => {
  const fotoUrl = raw.Foto || raw.foto || raw.FotoUrl || raw.fotoUrl;
  return {
    id: raw.Id || raw.id || "",
    nome: raw.Nome || raw.nome || "",
    email: raw.Email || raw.email || "",
    foto: fotoUrl || DEFAULT_AVATAR_URL, // Sempre usa placeholder padrão se não houver foto
  };
};

const adaptVenda = (raw: ImoviewVendaRaw): Venda => {
  const rawValor = extractSaleValue(raw as any);
  return {
    id: raw.Id || raw.id || "",
    corretorId: raw.CorretorId || raw.corretorId || "",
    valor: parseCurrencyString(rawValor),
    volume: 1,
    visitsCount: 0,
    proposalsCount: 0,
    dataVenda: parseImoviewDate(raw.DataVenda || raw.dataVenda) || new Date(),
    imovelId: raw.ImovelId || raw.imovelId,
    imovelEndereco: raw.ImovelEndereco || raw.imovelEndereco,
  };
};

// Mock Data (dados realistas para desenvolvimento)
const mockCorretores: ImoviewCorretorRaw[] = [
  {
    Id: "1",
    Nome: "Marcio Adriano",
    Email: "marcio.adriano@imoview.com.br",
    FotoUrl: DEFAULT_AVATAR_URL,
  },
  {
    Id: "2",
    Nome: "Lorena Fernandes",
    Email: "lorena.fernandes@imoview.com.br",
    FotoUrl: DEFAULT_AVATAR_URL,
  },
  {
    Id: "3",
    Nome: "Lauanda Azara",
    Email: "lauanda.azara@imoview.com.br",
    FotoUrl: DEFAULT_AVATAR_URL,
  },
  {
    Id: "4",
    Nome: "Carlos Oliveira",
    Email: "carlos.oliveira@imoview.com.br",
    FotoUrl: DEFAULT_AVATAR_URL,
  },
  {
    Id: "5",
    Nome: "Patricia Lima",
    Email: "patricia.lima@imoview.com.br",
    FotoUrl: DEFAULT_AVATAR_URL,
  },
  {
    Id: "6",
    Nome: "Roberto Alves",
    Email: "roberto.alves@imoview.com.br",
    FotoUrl: DEFAULT_AVATAR_URL,
  },
  {
    Id: "7",
    Nome: "Fernanda Souza",
    Email: "fernanda.souza@imoview.com.br",
    FotoUrl: DEFAULT_AVATAR_URL,
  },
  {
    Id: "8",
    Nome: "Lucas Ferreira",
    Email: "lucas.ferreira@imoview.com.br",
    FotoUrl: DEFAULT_AVATAR_URL,
  },
];

const generateMockVendas = (): ImoviewVendaRaw[] => {
  const vendas: ImoviewVendaRaw[] = [];
  const now = new Date();
  
  // Garante que os top 3 (IDs 1, 2, 3) tenham mais vendas e valores maiores
  // Top 1 - Marcio Adriano (ID: 1)
  for (let i = 0; i < 12; i++) {
    const diasAtras = Math.floor(Math.random() * 90); // Últimos 3 meses
    const dataVenda = new Date(now);
    dataVenda.setDate(now.getDate() - diasAtras);
    const valor = Math.floor(Math.random() * 800000) + 1200000; // Valores altos: R$ 1.200.000 - R$ 2.000.000
    
    vendas.push({
      Id: `venda-top1-${i + 1}`,
      CorretorId: "1",
      Valor: valor,
      DataVenda: dataVenda.toISOString(),
      Status: "Vendido",
    });
  }
  
  // Top 2 - Lorena Fernandes (ID: 2)
  for (let i = 0; i < 10; i++) {
    const diasAtras = Math.floor(Math.random() * 90);
    const dataVenda = new Date(now);
    dataVenda.setDate(now.getDate() - diasAtras);
    const valor = Math.floor(Math.random() * 600000) + 1000000; // Valores altos: R$ 1.000.000 - R$ 1.600.000
    
    vendas.push({
      Id: `venda-top2-${i + 1}`,
      CorretorId: "2",
      Valor: valor,
      DataVenda: dataVenda.toISOString(),
      Status: "Vendido",
    });
  }
  
  // Top 3 - Lauanda Azara (ID: 3)
  for (let i = 0; i < 8; i++) {
    const diasAtras = Math.floor(Math.random() * 90);
    const dataVenda = new Date(now);
    dataVenda.setDate(now.getDate() - diasAtras);
    const valor = Math.floor(Math.random() * 500000) + 800000; // Valores altos: R$ 800.000 - R$ 1.300.000
    
    vendas.push({
      Id: `venda-top3-${i + 1}`,
      CorretorId: "3",
      Valor: valor,
      DataVenda: dataVenda.toISOString(),
      Status: "Vendido",
    });
  }
  
  // Gera vendas aleatórias para os outros corretores (menos frequentes e valores menores)
  for (let i = 0; i < 20; i++) {
    const corretorId = mockCorretores[Math.floor(Math.random() * mockCorretores.length)].Id!;
    // Evita os top 3 para não competir
    if (corretorId === "1" || corretorId === "2" || corretorId === "3") continue;
    
    const diasAtras = Math.floor(Math.random() * 180);
    const dataVenda = new Date(now);
    dataVenda.setDate(now.getDate() - diasAtras);
    
    // Valores menores para os outros: R$ 200.000 e R$ 800.000
    const valor = Math.floor(Math.random() * 600000) + 200000;
    
    vendas.push({
      Id: `venda-${i + 1}`,
      CorretorId: corretorId,
      Valor: valor,
      DataVenda: dataVenda.toISOString(),
      Status: "Vendido",
    });
  }
  
  return vendas;
};

// Service Class
export class ImoviewService {
  private client: AxiosInstance;

  constructor() {
    this.client = createAxiosClient();
  }

  async fetchCorretores(): Promise<Broker[]> {
    const baseBrokers = buildBrokersFromTeams();

    const mergeBrokers = (list: Broker[]): Broker[] => {
      const map = new Map<string, Broker>();
      [...baseBrokers, ...list].forEach((b) => {
        const id = b.id || slugifyName(b.nome);
        if (!map.has(id)) {
          map.set(id, { ...b, id, foto: b.foto || DEFAULT_AVATAR_URL });
        }
      });
      return Array.from(map.values());
    };

    const deriveFromVendas = async (): Promise<Broker[]> => {
      try {
        const vendas = await this.fetchVendas();
        const extras = new Map<string, Broker>();
        vendas.forEach((v) => {
          const nome = (v as any).corretorNome || (v as any).corretor || "";
          if (!nome) return;
          const id = slugifyName(nome);
          if (!extras.has(id)) {
            extras.set(id, { id, nome, email: "", foto: DEFAULT_AVATAR_URL });
          }
        });
        return mergeBrokers(Array.from(extras.values()));
      } catch (err) {
        console.warn("Falha ao derivar corretores das vendas:", err);
        return mergeBrokers([]);
      }
    };

    if (SHOULD_USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mergeBrokers(mockCorretores.map(adaptCorretor));
    }

    return await deriveFromVendas();
  }

  async fetchVendas(periodo?: { start: Date; end: Date }): Promise<Venda[]> {
    if (SHOULD_USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let mockVendas = generateMockVendas();
      if (periodo) {
        mockVendas = mockVendas.filter((v) => {
          const dataVenda = new Date(v.DataVenda || v.dataVenda || "");
          return dataVenda >= periodo.start && dataVenda <= periodo.end;
        });
      }
      return mockVendas.map(adaptVenda);
    }

    try {
      const PAGE_SIZE = 20; // limite imposto pela API
      const paramsBase: any = {
        numeroRegistros: PAGE_SIZE,
        finalidade: 2, // 2 = venda
        situacao: 3,   // 3 = negócio
      };
      if (periodo) {
        paramsBase.dataInicial = periodo.start.toISOString().split("T")[0];
        paramsBase.dataFinal = periodo.end.toISOString().split("T")[0];
      }

      const allRows: any[] = [];
      let page = 1;
      const MAX_PAGES = 500; // proteção contra loop infinito

      while (page <= MAX_PAGES) {
        const pageParams = { ...paramsBase, numeroPagina: page };
        const response = await this.client.get<any>("/atendimentos", { params: pageParams });
        const lista = response.data?.lista || response.data?.Lista || response.data || [];

        const pageItems = Array.isArray(lista) ? lista : [];
        allRows.push(...pageItems);

        if (pageItems.length < PAGE_SIZE) break;
        page += 1;
      }

      if (allRows.length === 0) {
        throw new Error("Lista de atendimentos vazia");
      }

      // Loga a estrutura real do primeiro item para investigação de campos de valor
      if (allRows.length > 0) {
        console.log("🔥 ESTRUTURA REAL DA API (Primeiro Item):", JSON.stringify(allRows[0], null, 2));
      }

      let loggedSample = false;
      const vendas = allRows.map((item: any) => {
        if (!loggedSample) {
          console.log("Exemplo de Venda Raw:", item);
          loggedSample = true;
        }

        const negocios = Array.isArray(item.imoveisnegocio) ? item.imoveisnegocio : [];
        const visitas = Array.isArray(item.imoveisvisita) ? item.imoveisvisita : [];
        const propostas = Array.isArray(item.imoveisproposta) ? item.imoveisproposta : [];

        // Calcula VGV e volume a partir dos negócios
        let vgvTotal = 0;
        let volume = 0;
        negocios.forEach((negocio: any) => {
          const v = extractSaleValue(negocio);
          if (v > 0) {
            vgvTotal += v;
            volume += 1;
          }
        });

        // Fallback: se não veio em imoveisnegocio, tenta valor direto no item
        const mainValor = extractSaleValue(item);
        if (vgvTotal === 0 && mainValor > 0) {
          vgvTotal = mainValor;
          volume = volume || 1;
        }

        const visitsCount = visitas.length;
        const proposalsCount = propostas.length;

        const corretorNome = item.corretor || item.nomecorretor || item.corretorNome || item.nomeCorretor || "";
        const corretorId = corretorNome ? slugifyName(corretorNome) : "corretor";

        const rawDate =
          item.datanegocio ||
          item.datafechamento ||
          item.data ||
          item.datahora ||
          item.dataHora ||
          item.dataVenda ||
          item.DataVenda;
        const dataVenda = parseImoviewDate(rawDate) || new Date();

        return {
          id: String(item.codigonegocio || item.codigo || item.id || `${corretorId}-${item.datanegocio || item.datafechamento || item.data || ""}`),
          corretorId,
          valor: vgvTotal,
          volume,
          visitsCount,
          proposalsCount,
          dataVenda,
          imovelId: item.codigoimovel || item.imovelcodigo || undefined,
          imovelEndereco: item.endereco || item.imovelendereco || undefined,
          // Campos auxiliares para corretores
          corretorNome,
        } as Venda & { corretorNome?: string };
      });

      // Filtra por período se for necessário (caso backend ignore datas)
      const filtradas = periodo
        ? vendas.filter((v) => v.dataVenda && v.dataVenda >= periodo.start && v.dataVenda <= periodo.end)
        : vendas;

      return filtradas;
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      console.warn("Usando dados mockados como fallback");
      let mockVendas = generateMockVendas();
      if (periodo) {
        mockVendas = mockVendas.filter((v) => {
          const dataVenda = new Date(v.DataVenda || v.dataVenda || "");
          return dataVenda >= periodo.start && dataVenda <= periodo.end;
        });
      }
      return mockVendas.map(adaptVenda);
    }
  }
}

// Singleton instance
export const imoviewService = new ImoviewService();

