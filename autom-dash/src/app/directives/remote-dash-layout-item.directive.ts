import {
  Directive,
  Input,
  OnChanges,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';
import { GenericItemComponent } from '../remote-dashes/components/generic-item.component';
import { ButtonItemComponent } from '../remote-dashes/components/button-item.component';

const components = {
  genericItem: GenericItemComponent,
  buttonItem: ButtonItemComponent,
};

@Directive({
  selector: '[appLayoutItem1]'
})

export class RemoteDashLayoutItemDirective implements OnChanges {
  @Input() componentRef: string;
  component: ComponentRef<any>;
  
  constructor(
    private container: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) { }  

  ngOnChanges(): void {
    console.log("RemoteDashLayouItemDirective.ngOnChages()");
    const component = components[this.componentRef];
    
    if (component) {
      const factory = this.resolver.resolveComponentFactory<any>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.label = "wow2";
    }
  }
}
