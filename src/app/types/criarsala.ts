
import type { Sala } from "../models/sala.model";

export interface CriarSala extends Sala {
    equipamentoId: number[];
    softwaresId: number[];
    equipamentos: Array<{ id: number; name: string }>;
    softwares: Array<{ id: number; name: string }>;
  }