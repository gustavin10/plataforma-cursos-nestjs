import { ApiService } from "./api";
import type { IPagamento } from "../models/pagamento.model";

export const pagamentoService = new ApiService<IPagamento>("pagamentos");
