import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pastDate',
  standalone: true,
})
export class PastDatePipe implements PipeTransform {
  transform(value: string | null): string {
    if (value) {
      const now = new Date();
      const date = new Date(value);
      const offset = now.getTimezoneOffset();
      const tzDate = date.getTime() - offset * 60 * 1000;
      const differenceInMilliseconds = now.getTime() - tzDate;

      if (isNaN(differenceInMilliseconds) || differenceInMilliseconds < 0) {
        return 'Некорректная дата';
      }

      const seconds = Math.floor(differenceInMilliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) {
        return seconds === 1 ? '1 секунду назад' : `${seconds} секунд назад`;
      } else if (minutes < 60) {
        return minutes === 1 ? '1 минуту назад' : `${minutes} минут назад`;
      } else if (hours < 24) {
        return hours === 1 ? '1 час назад' : `${hours} часов назад`;
      } else {
        return days === 1 ? '1 день назад' : `${days} дней назад`;
      }
    } else {
      return 'Дата неизвестна';
    }
  }
}
