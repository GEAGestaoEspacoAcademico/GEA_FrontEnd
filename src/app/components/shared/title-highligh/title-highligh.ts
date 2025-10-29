import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Componente de apresentação (dumb component) reutilizável.
 * Exibe uma string de título com um estilo de "destaque"
 * pré-definido no CSS.
 *
 * @usage
 * <app-title-highlight [title]="'Minha Seção de Destaque'"></app-title-highlight>
 */
@Component({
  selector: 'app-title-highligh',
  standalone: false,
  templateUrl: './title-highligh.html',
  styleUrl: './title-highligh.css',
  /**
   * (Opcional, mas recomendado)
   * OnPush: O componente só será verificado (e re-renderizado)
   * quando sua propriedade @Input 'title' mudar.
   */
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleHighligh {
  /**
   * O texto (string) que será exibido como o título principal.
   * Este @Input é obrigatório.
   */
  @Input ({required: true}) title!: string;
}