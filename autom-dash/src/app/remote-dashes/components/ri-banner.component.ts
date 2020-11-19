import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { RIDirective } from '../directives/ri.directive';
import { RIItem } from './ri-item';
import { RIComponent } from './ri.component';

@Component({
  selector: 'app-ri-banner',
  template: `
              <div class="ri-banner-example">
                <!--<h3>Remote Item</h3>-->
                <ng-template riHost>
                </ng-template>
              </div>
            `
})
export class RIBannerComponent implements OnInit, OnDestroy {
  @Input() ric: RIItem;
  @ViewChild(RIDirective, {static: true}) riHost: RIDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.ric.component);

    const viewContainerRef = this.riHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<RIComponent>(componentFactory);
    componentRef.instance.data = this.ric.data;
  }
}
