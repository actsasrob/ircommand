import { Component, Input } from '@angular/core';

import { RIComponent } from './ri.component';

@Component({
  template: `
    <div class="generic-item">
      <h4>Generic Item {{data?.label}}</h4>

      <p>id: {{data.id}}</p>
    </div>
  `
})
export class GenericItemComponent implements RIComponent {
  @Input() data: any;

}

