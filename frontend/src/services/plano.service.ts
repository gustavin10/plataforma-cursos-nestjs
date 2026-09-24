import { ApiService } from "./api";
import type { IPlano } from "../models/plano.model";

export const planoService = new ApiService<IPlano>("planos");
