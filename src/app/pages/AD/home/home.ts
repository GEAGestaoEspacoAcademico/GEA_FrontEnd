import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private headerService = inject(HeaderTitleService);

  ngOnInit(): void {
    this.headerService.hideBack();
  }
}
