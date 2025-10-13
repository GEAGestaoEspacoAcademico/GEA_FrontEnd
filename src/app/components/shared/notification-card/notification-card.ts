import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-card',
  standalone: false,
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCard {
  @Input() source!: string;
  @Input() title!: string;
  @Input() date!: Date | string;
  @Input() snippet!: string;
}