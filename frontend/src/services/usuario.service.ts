import { ApiService } from "./api";
import type { IUsuario } from "../models/usuario.model";

export const usuarioService = new ApiService<IUsuario>("usuarios");
