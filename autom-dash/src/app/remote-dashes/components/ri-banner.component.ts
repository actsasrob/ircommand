import { Component, Input, OnInit, OnChanges, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

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
export class RIBannerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ric: RIItem;
  @ViewChild(RIDirective, {static: true}) riHost: RIDirective;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.loadComponent();
    //this.getRIs();

  }

  ngOnChanges() {
    
    //console.log("ri-banner: ngOnChanges()");
    this.loadComponent();

  }
  ngOnDestroy() {
     clearInterval(this.interval);
  }

  loadComponent() {
    //let myData: any = JSON.parse(this.ric.toString());
    //console.log("RIBanner: this.ric.component=" + myData.component + " this.ric.data=" + JSON.stringify(myData.data) );
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.ric.component);

    const viewContainerRef = this.riHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<RIComponent>(componentFactory);
    //let tmpData: any = { ...this.ric.data };
    //componentRef.instance.data = tmpData;
    componentRef.instance.data = this.ric.data;
  }

  getRIs() {
    this.interval = setInterval(() => {
      //console.log("ri-banner: getRIs()");
      this.loadComponent();
    }, 10000);
  }
}
