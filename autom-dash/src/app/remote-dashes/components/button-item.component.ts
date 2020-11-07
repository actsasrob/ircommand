import { Component, Input } from '@angular/core';

import { RIComponent } from './RI.component';

@Component({
  template: `
    <div class="button-item">
      <h4>{{data.id}}</h4>

      {{data.body}}
    </div>
  `
})
export class ButtonItemComponent implements RIComponent {
  @Input() data: any;

}

