import { ApiService } from "./api";
import type { ICurso } from "../models/curso.model";

export const cursoService = new ApiService<ICurso>("cursos");
