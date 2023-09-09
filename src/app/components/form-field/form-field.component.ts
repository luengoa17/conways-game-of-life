import { AfterContentInit, Component, ContentChild, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, filter, map } from 'rxjs';
import { ShowErrorDirective } from 'src/app/directives/show-error.directive';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css']
})
export class FormFieldComponent implements AfterContentInit {
  @ContentChild(ShowErrorDirective, {static: true}) errorDirective?: ShowErrorDirective

  error$?: Observable<string | null>;

  ngAfterContentInit(): void {
    if (!this.errorDirective?.controlDirective) {
      return;
    }
    const control = this.errorDirective.controlDirective;
    this.error$ = this.errorDirective.controlDirective?.statusChanges?.pipe(
      map(status => {
        if (status === 'INVALID') {
          return this.getErrorMessage(control);
        } else {
          return null;
        }
      }));
  }

  private getErrorMessage(control: NgControl) : string {
    if (control.errors?.['required']) {
      return 'Please enter a value'
    }
    if (control.errors?.['min']) {
      return `Minimum value is ${control.errors?.['min']}`
    }
    if (control.errors?.['max']) {
      return `Maximum value is ${control.errors?.['max']}`
    }
    return 'There has been an error';
  }

}
