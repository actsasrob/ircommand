import { Component, Input } from '@angular/core';

import { RIComponent } from './ri.component';

@Component({
  template: `
    <div class="button-item">
      <h4>ButtonItem {{data?.label}}</h4>

      <p>IRSignal: {{data?.IRSignal}}</p>
      <p>id: {{data.id}}</p>
    </div>
  `
})
export class ButtonItemComponent implements RIComponent {
  @Input() data: any;

}

