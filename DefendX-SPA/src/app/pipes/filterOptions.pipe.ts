import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOptions',
  pure: false
})
export class FilterOptionsPipe implements PipeTransform {

  transform(values: any[], filterString: string, propName: string): any {
    if (!filterString) {
      return null;
    } else if (!values) {
      return values;
    }

   return values.filter(value => value[propName].toUpperCase().indexOf(filterString.toUpperCase()) !== -1);
  }
}
