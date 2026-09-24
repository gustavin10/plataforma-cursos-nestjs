import { ApiService } from "./api";
import type { ITrilha } from "../models/trilha.model";

export const trilhaService = new ApiService<ITrilha>("trilhas");
