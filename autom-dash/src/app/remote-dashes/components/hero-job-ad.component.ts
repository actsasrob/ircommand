import { Component, Input } from '@angular/core';

import { RIComponent } from './ri.component';

@Component({
  template: `
    <div class="job-ad">
      <h4>{{data.headline}}</h4>

      {{data.body}}
    </div>
  `
})
export class HeroJobAdComponent implements RIComponent {
  @Input() data: any;

}

