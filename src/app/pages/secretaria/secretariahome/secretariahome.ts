import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-secretariahome',
  standalone: false,
  templateUrl: './secretariahome.html',
  styleUrl: './secretariahome.css'
})
export class Secretariahome implements OnInit{
  private headerService = inject(HeaderTitleService)
  
  ngOnInit(): void {
    this.headerService.setTitle('Home')
    this.headerService.hideBack()
  }

}
