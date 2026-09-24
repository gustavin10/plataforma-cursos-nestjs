import { ApiService } from "./api";
import type { IProgressoAula } from "../models/progresso_aula.model";

export const progressoAulaService = new ApiService<IProgressoAula>("progresso-aulas");
