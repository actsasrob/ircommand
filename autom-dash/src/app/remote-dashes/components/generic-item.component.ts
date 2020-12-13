import { Component, Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { RIComponent } from './ri.component';

import { Subscription } from 'rxjs';
import {RemoteDashItemMessageService} from '../services/remote-dash-item-message.service';

@Component({
  template: `
    <div class="generic-item">
      <h4>Generic Item {{data?.name}}</h4>

      <p>id: {{data.id}}</p>
    </div>
  `
})
export class GenericItemComponent implements RIComponent {
    @Input() data: any;

    //subscription: Subscription;

    constructor(
      private ref: ChangeDetectorRef,
      private messageService: RemoteDashItemMessageService) {
         //this.subscription = messageService.toChildren$.subscribe(
         //  message => {
         //    console.log("GenericItem.messageService.toChildren$()");
         //    this.ref.markForCheck();
         //    this.ref.detectChanges();
         //});
    }
}

