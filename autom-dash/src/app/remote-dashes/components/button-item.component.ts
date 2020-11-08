import { Component, Input } from '@angular/core';

import { RIComponent } from './ri.component';

@Component({
  template: `
    <div class="button-item">
      <h4>id: {{data.id}}</h4>

      label: {{data?.label}}
      IRSignal: {{data?.IRSignal}}
    </div>
  `
})
export class ButtonItemComponent implements RIComponent {
  @Input() data: any;

}

