import { Component, Input } from '@angular/core';

import { RIComponent } from './RI.component';

@Component({
  template: `
    <div class="generic-item">
      <h4>Generic Item{{data.id}}</h4>

      {{data.body}}
    </div>
  `
})
export class GenericItemComponent implements RIComponent {
  @Input() data: any;

}

