import type { Sala } from "../models/sala.model";

export interface CriarSala extends Sala{
    equipamentoId: number[],
    softwaresId: number[]
}