import { inject, Injectable } from '@angular/core';
import type { MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  private createConfig(panelClass: string, duration: number): MatSnackBarConfig {
    return {
      duration,
      horizontalPosition: this.horizontalPosition,
      panelClass: [panelClass],
    };
  }

  showSuccess(message: string): void {
    const config = this.createConfig('toast-success', 3000);
    this.snackBar.open(message, 'Fechar', config);
  }

  showError(message: string): void {
    const config = this.createConfig('toast-error', 3000);
    this.snackBar.open(message, 'Fechar', config);
  }
}
