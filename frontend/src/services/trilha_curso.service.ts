import { ApiService } from "./api";
import type { ITrilhaCurso } from "../models/trilha_curso.model";

export const trilhaCursoService = new ApiService<ITrilhaCurso>("trilhas-cursos");
