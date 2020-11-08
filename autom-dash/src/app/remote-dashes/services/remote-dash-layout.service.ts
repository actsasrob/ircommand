import { Injectable } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { UUID } from 'angular2-uuid';
import { RIComponent } from '../components/ri.component';
import { RIItem } from '../components/ri-item';
import { GenericItemComponent } from '../components/generic-item.component';

export interface IComponent {
  id: string;
  componentRef: string;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteDashLayoutService {  
  public options: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: 'always',
    draggable: {
      enabled: true
    },
    pushItems: true,
    resizable: {
      enabled: true
    }
  };  
   public layout: GridsterItem[] = [];  
   //public layout: GridsterItem[] = [{"cols":5,"id":"5d5bd504-45ed-b0cd-ef84-dfe5c148368c","rows":5,"x":0,"y":0},{"cols":5,"id":"229098d2-a233-f0ba-20ed-c91e1cf55aad","rows":5,"x":0,"y":5},{"cols":5,"id":"8646833d-8cc9-4f32-5021-c564cba5ccea","rows":5,"x":5,"y":0},{"cols":5,"id":"e8318ac0-42d6-cdda-e7d9-71c7873a3cfb","rows":5,"x":0,"y":0}];  

   public components: RIComponent[] = [];
   public componentsObjs: RIItem[] = [];

   dropId: string;

   constructor() { }  

   addItem(): void {
       //console.log("LayoutService.addItem()");
       let myUUID = UUID.UUID();
       this.layout.push({
         cols: 5,
         id: myUUID,
         rows: 5,
         x: 0,
         y: 0
       });
    
      let tmpComponent: RIItem = new RIItem(GenericItemComponent, {id: myUUID, name: 'testName', body: 'Brave as they come'});
       console.log("RemoteDashLayoutService.addItem(): tmpComponent=" + tmpComponent.toString());
       //this.components.push(JSON.parse(JSON.stringify(tmpComponent)));
       this.components.push(JSON.parse(tmpComponent.toString()));
       this.componentsObjs.push(tmpComponent);

     //console.log("LayoutService.addItem(): id=" + myUUID);
     //console.log("LayoutService.addItem: layout" + JSON.stringify(this.layout));
     //console.log("LayoutService.addItem: components" + JSON.stringify(this.components));
     }  

   deleteItem(id: string): void {
       console.log("LayoutService.deleteItem(): id=" + JSON.stringify(id));
       let jsonObject = JSON.parse(JSON.stringify(id));
       const item = this.layout.find(d => d.id === jsonObject.id);
       this.layout.splice(this.layout.indexOf(item), 1);
       const comp = this.components.find(c => c.data.id === jsonObject.id);
       //console.log("LayoutService.deleteItem(): comp=" + JSON.stringify(comp));
       this.components.splice(this.components.indexOf(comp), 1);
       const comp1 = this.componentsObjs.find(c => c.data.id === jsonObject.id);
       this.componentsObjs.splice(this.componentsObjs.indexOf(comp1), 1);
   }
   
   setDropId(dropId: string): void {
     //console.log("LayoutService.setDropId()");
     this.dropId = dropId;
   }
   
   dropItem(dragId: string): void {  
     //console.log("LayoutService.dropItem()");
     //const { components } = this;  
     //const comp: RIComponent = components.find(c => c.data.id === this.dropId);
     //
     //const updateIdx: number = comp ? components.indexOf(comp) : components.length;  
     //const componentItem: RIComponent = {
     //  id: this.dropId,
     //  componentRef: dragId,
     //};  
     //this.components = Object.assign([], components, { [updateIdx]: componentItem });
   }
   
   getComponentRef(id: string): string {
     //console.log("RemoteDashLayoutService.getComponentRef()");
     const comp = this.components.find(c => c.data.id === id);
     return comp ? comp.data.componentRef : null;
   }

   getComponent(id: string): RIItem {
     console.log("RemoteDashLayoutService.getComponent()");
     this.componentsObjs.find(c => { console.log("RemoteDashLayoutService.getComponent(): " + c.toString())});
     const comp = this.componentsObjs.find(c => c.data.id === id);
     return comp ? comp : null;
   }
}
