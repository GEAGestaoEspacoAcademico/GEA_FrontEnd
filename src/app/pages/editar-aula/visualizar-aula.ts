import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-aula',
  standalone: false,
  templateUrl: './editar-aula.html',
  styleUrl: './editar-aula.css'
})
export class EditarAula implements OnInit{
  private route = inject(ActivatedRoute)
  
  aulaId: string | null = null;
  
  ngOnInit(): void {
    this.aulaId = this.route.snapshot.paramMap.get('id');
    console.log('ID da aula a ser visualizada:', this.aulaId);
  }


}
