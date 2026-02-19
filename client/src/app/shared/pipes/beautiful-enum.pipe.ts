import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'beautifulEnum',
})
export class BeautifulEnumPipe implements PipeTransform {
  transform(value: string, args?: any): any {
    return value
      ? value
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .trim()
          .replace(/_/g, ' ')
          .toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')
      : '';
  }
}
