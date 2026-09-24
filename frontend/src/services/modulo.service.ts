import { ApiService } from "./api";
import type { IModulo } from "../models/modulo.model";

export const moduloService = new ApiService<IModulo>("modulos");
