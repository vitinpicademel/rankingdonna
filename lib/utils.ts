import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function getPeriodDates(period: string): { start: Date; end: Date } {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const startOfWeek = (base: Date) => {
    const d = new Date(base);
    const day = d.getDay(); // 0 domingo, 1 segunda
    const diff = day === 0 ? 6 : day - 1; // iniciar na segunda
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const endOfWeek = (base: Date) => {
    const s = startOfWeek(base);
    const e = new Date(s);
    e.setDate(e.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return e;
  };

  let start = todayStart;
  let end = todayEnd;

  switch (period) {
    case "todos": {
      start = new Date(1970, 0, 1, 0, 0, 0, 0);
      end = todayEnd;
      break;
    }
    case "vencidos": {
      // Histórico recente/acumulado: início do ano até hoje
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      end = todayEnd;
      break;
    }
    case "mes-anterior": {
      const firstPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      const lastPrev = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      start = firstPrev;
      end = lastPrev;
      break;
    }
    case "ontem": {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - 1);
      start = new Date(d);
      end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      break;
    }
    case "hoje": {
      start = todayStart;
      end = todayEnd;
      break;
    }
    case "amanha": {
      const d = new Date(todayStart);
      d.setDate(d.getDate() + 1);
      start = new Date(d);
      end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      break;
    }
    case "esta-semana": {
      start = startOfWeek(now);
      end = todayEnd; // até hoje
      break;
    }
    case "proxima-semana": {
      const nextWeekStart = startOfWeek(now);
      nextWeekStart.setDate(nextWeekStart.getDate() + 7);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      nextWeekEnd.setHours(23, 59, 59, 999);
      start = nextWeekStart;
      end = nextWeekEnd;
      break;
    }
    case "este-mes": {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    case "proximo-mes": {
      start = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
      break;
    }
    case "selecionar-periodo":
    default: {
      start = todayStart;
      end = todayEnd;
      break;
    }
  }

  return { start, end };
}


