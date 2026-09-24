import { ApiService } from "./api";
import type { IAvaliacao } from "../models/avaliacao.model";

export const avaliacaoService = new ApiService<IAvaliacao>("avaliacoes");
