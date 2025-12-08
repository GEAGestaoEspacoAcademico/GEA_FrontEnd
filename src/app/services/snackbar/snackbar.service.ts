import { inject, Injectable } from '@angular/core';
import type { MatSnackBarHorizontalPosition, MatSnackBarConfig, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
/**
 * Serviço responsável pelo gerenciamento das noticações to tipo snackbar da aplicação
 */
@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  /**
   * Cria uma conofiguração para o snackbar
   * @param panelClass Classe associada ao snackbar
   * @param duration Duração em milisegundos do snackbar
   * @returns Retorna a configuração do snackbar
   */
  private createConfig(panelClass: string, duration: number): MatSnackBarConfig {
    return {
      duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [panelClass],
    };
  }

  /**
   * Mostra o snackbar do tipo sucesso
   * @param message Menssagem a aser exibida
   */
  showSuccess(message: string): void {
    const config = this.createConfig('toast-success', 3000);
    this.snackBar.open(message, 'Fechar', config);
  }

  /**
   * Mostra o snackbar do tipo erro
   * @param message Menssagem a ser exibido
   */
  showError(message: string): void {
    const config = this.createConfig('toast-error', 3000);
    this.snackBar.open(message, 'Fechar', config);
  }
}
