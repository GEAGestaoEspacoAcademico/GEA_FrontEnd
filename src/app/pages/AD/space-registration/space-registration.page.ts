import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { SalaService } from '../../../services/salas/sala.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import type { Sala } from '../../../models/sala.model';

@Component({
  selector: 'app-space-registration',
  standalone: false,
  templateUrl: './space-registration.page.html',
  styleUrl: './space-registration.page.css'
})
export class SpaceRegistrationPage implements OnInit {

  private route = inject(ActivatedRoute);
  private salaService = inject(SalaService);
  private router = inject(Router);
 
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + "/salas";
 
  isEditMode = false;
  spaceId: number | null = null;
 
  initialData: any;
 
 
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
 
      if (idParam) {
        this.spaceId = Number(idParam);
        this.isEditMode = true;
 
        this.salaService.getSalaId(this.spaceId).subscribe({
          next: (data: Sala) => this.initialData = data,
          error: err => console.error('Erro ao carregar espaço:', err)
        });
 
      } else {
        this.isEditMode = false;
      }
    });
  }
 
  onFormSubmit(payload: Sala) {
    if (this.isEditMode && this.spaceId) {
      this.updateSala(this.spaceId, payload);
    } else {
      this.createSala(payload);
    }
  }
 
  private createSala(payload: Sala) {
    this.http.post(`${this.baseUrl}`, payload).subscribe({
      next: () => {
        alert('Espaço criado com sucesso!');
        this.router.navigate(['/ad/cadastrar-espaco']);
      },
      error: err => console.error('Erro ao criar sala:', err)
    });
  }
 
  private updateSala(id: number, payload: Sala) {
    this.http.put(`${this.baseUrl}/${id}`, payload).subscribe({
      next: () => {
        alert('Espaço atualizado com sucesso!');
        this.router.navigate(['/ad/cadastrar-espaco']);
      },
      error: err => console.error('Erro ao atualizar sala:', err)
    });
  }


}
