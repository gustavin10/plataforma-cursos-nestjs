import { ApiService } from "./api";
import type { ICertificado } from "../models/certificado.model";

export const certificadoService = new ApiService<ICertificado>("certificados");
