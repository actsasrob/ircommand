// tslint:disable: directive-selector

// Remote Item Directive
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[riHost]',
})
export class RIDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

