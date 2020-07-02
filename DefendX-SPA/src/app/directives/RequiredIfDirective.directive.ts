import { Directive, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[requiredIf]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: RequiredIfDirective, multi: true }
  ]
})
export class RequiredIfDirective implements Validator, OnChanges {
  @Input('requiredIf')
  requiredIf: boolean;

  private _onChange: () => void;

  registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

  ngOnChanges(changes: SimpleChanges): void {
    if ('requiredIf' in changes) {

      if (this._onChange) {
        this._onChange();
      }
    }
  }

  validate(c: AbstractControl) {
    const value = c.value;
    if ((value == null || value == undefined || value == '') && this.requiredIf) {
      return {
        requiredIf: { condition: this.requiredIf }
      };
    }
    return null;
  }

}
