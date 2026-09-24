import { ApiService } from "./api";
import type { IAssinatura } from "../models/assinatura.model";

export const assinaturaService = new ApiService<IAssinatura>("assinaturas");
