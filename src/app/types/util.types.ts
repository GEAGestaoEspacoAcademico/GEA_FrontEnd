import type { CriarSalaRequest, RecursoAdiconarSala} from "./sala.type";

export interface CriarSalaFormulario extends CriarSalaRequest {
  equipamentos: RecursoAdiconarSala[]
}