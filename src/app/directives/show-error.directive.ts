import { Directive, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appShowError]'
})
export class ShowErrorDirective {
  constructor(@Optional() @Self() public controlDirective : NgControl | null) {}
}
