import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-homecoord',
  standalone: false,
  templateUrl: './homecoord.html',
  styleUrl: './homecoord.css',
})
export class Homecoord implements OnInit {
  private titleService = inject(HeaderTitleService);

  ngOnInit(): void {
    this.titleService.hideBack();
  }
}
