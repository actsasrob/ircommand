import { Type } from '@angular/core';

export class RIItem {
  constructor(public component: Type<any>, public data: any) {}
}
