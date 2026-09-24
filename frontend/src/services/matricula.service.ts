import { ApiService } from "./api";
import type { IMatricula } from "../models/matricula.model";

export const matriculaService = new ApiService<IMatricula>("matriculas");
