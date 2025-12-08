export class FormatUtils {
  /**
   * Converte string de data (ex: "2025-03-15T00:00:00Z") para formato yyyy-MM-dd
   * usado em inputs <input type="date">.
   * @param date
   */
  static formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Retorna hora formatada (HH:mm) a partir de string "HH:mm:ss" ou "H:mm".
   * @param h
   */
  static formatHour(h: string): string {
    const partes = h.split(':');
    const hora = parseInt(partes[0], 10).toString().padStart(2,'0');
    const minutos = partes[1].padStart(2,'0');
    return `${hora}:${minutos}`;
  }

  /**
   * Normaliza hora para padrão HH:mm (mantém consistência nos dados de backend).
   * @param horas
   */
  static normalizeHour(horas: string): string {
    const [h, m] = horas.split(':');
    const date = new Date();
    date.setHours(Number(h));
    date.setMinutes(Number(m));

    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minutes}`;
  }

  /**
   * Formata data no padrão YYYY-MM-DD (ex: usada para IDs únicos no componente de calendário).
   * @param date
   * @returns retorna a data no formato yyyy-mm-dd
   */
  static toId(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Retorna o dia do mês (ex: "05").
   * @param date
   * @returns retorna o dia do mês
   */
  static formatDayLabel(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(date);
  }

  /**
   * Retorna o nome do dia da semana abreviado (ex: "seg", "ter", "qua").
   * @param date
   * @returns retorna o dia da semana formato com o nome curto
   */
  static formatWeekdayLabel(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
      .format(date)
      .toLowerCase()
      .replace('.', '');
  }

  static colocarSegundos(horario: string): string {
    horario = this.normalizeHour(horario);
    return `${horario}:00`;
  }

  static formatTime(inicio: string, fim: string): string {
    const inicioSemSegundos = inicio.substring(0, 5);
    const fimSemSegundos = fim.substring(0, 5);

    return `${inicioSemSegundos} - ${fimSemSegundos}`;
  }
}
