import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { RIDirective } from '../directives/ri.directive';
import { RIItem } from './ri-item';
import { RIComponent } from './ri.component';

@Component({
  selector: 'app-ri-banner',
  template: `
              <div class="ri-banner-example">
                <h3>Remote Item</h3>
                <ng-template riHost></ng-template>
              </div>
            `
})
export class RIBannerComponent implements OnInit, OnDestroy {
  @Input() ris: RIItem[];
  currentRIIndex = -1;
  @ViewChild(RIDirective, {static: true}) riHost: RIDirective;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.loadComponent();
    this.getRIs();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadComponent1() {
  }

  loadComponent() {
    this.currentRIIndex = (this.currentRIIndex + 1) % this.ris.length;
    const riItem = this.ris[this.currentRIIndex];

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(riItem.component);

    const viewContainerRef = this.riHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<RIComponent>(componentFactory);
    componentRef.instance.data = riItem.data;
  }

  getRIs() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
}
