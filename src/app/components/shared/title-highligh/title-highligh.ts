import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-highligh',
  standalone: false,
  templateUrl: './title-highligh.html',
  styleUrl: './title-highligh.css'
})
export class TitleHighligh {
  @Input ({required: true}) title!: string;
}
