import { Component } from '@angular/core';
import type { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-configuracoes',
  standalone: false,
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes {
  logout() {
    console.warn('Professor deslogado');
  }
  mockTeacher: Teacher = {
    nome: "Prof. Dr. Lorem Ipsum",
    disciplinas: [
      "Cálculo 1",
      "Cálculo 2",
      "Álgebra Linear",
    ],
    cursos: [
      {
        semestre: "1º semestre",
        curso: "Engenharia Mecatrônica",
        disciplina: "Cálculo 1",
      },
      {
        semestre: "2º semestre",
        curso: "Análise e Desenvolvimento de Sistemas (ADS)",
        disciplina: "Cálculo 1",
      },
      {
        semestre: "2º semestre",
        curso: "Engenharia de Software",
        disciplina: "Álgebra Linear",
      },
      {
        semestre: "3º semestre",
        curso: "Engenharia Mecatrônica",
        disciplina: "Cálculo 2",
      },
    ],
  };
}
