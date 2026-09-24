import { ApiService } from "./api";
import type { IAula } from "../models/aula.model";

export const aulaService = new ApiService<IAula>("aulas");
