import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_IMOVIEW_API_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_IMOVIEW_BASE_URL || "https://api.imoview.com.br/";

export async function GET(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key não configurada" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  try {
    const response = await axios.get(`${BASE_URL}Atendimento/RetornarAtendimentos`, {
      params,
      headers: {
        chave: API_KEY,
        "Content-Type": "application/json",
      },
      // Evita erro em ambientes sem TLS estrito
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { message: error?.message || "Erro na API Imoview" };
    return NextResponse.json({ error: data }, { status });
  }
}

