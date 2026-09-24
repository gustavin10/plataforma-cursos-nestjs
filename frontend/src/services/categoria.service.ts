import { ApiService } from "./api";
import type { ICategoria } from "../models/categoria.model";

export const categoriaService = new ApiService<ICategoria>("categorias");
