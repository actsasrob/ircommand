import { Injectable } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { UUID } from 'angular2-uuid';
import { RIComponent } from '../components/ri.component';
import { RIItem } from '../components/ri-item';
import { GenericItemComponent } from '../components/generic-item.component';
import { ButtonItemComponent } from '../components/button-item.component';

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
    
      let tmpComponent: RIItem = new RIItem(ButtonItemComponent, {id: myUUID, IRSignalId: ''});
       console.log("RemoteDashLayoutService.addItem(): tmpComponent=" + tmpComponent.toString());
       //this.components.push(JSON.parse(JSON.stringify(tmpComponent)));
       this.components.push(JSON.parse(tmpComponent.toString()));
       this.componentsObjs.push(tmpComponent);

     //console.log("LayoutService.addItem(): id=" + myUUID);
     //console.log("LayoutService.addItem: layout" + JSON.stringify(this.layout));
     //console.log("LayoutService.addItem: components" + JSON.stringify(this.components));
     }  

   deleteItem(id: string): void {
       console.log("RemoteDashLayoutService.deleteItem(): id=" + JSON.stringify(id));
       let jsonObject = JSON.parse(JSON.stringify(id));
       const item = this.layout.find(d => d.id === jsonObject.id);
       this.layout.splice(this.layout.indexOf(item), 1);
       const comp = this.components.find(c => c.data.id === jsonObject.id);
       this.components.splice(this.components.indexOf(comp), 1);
       const comp1 = this.componentsObjs.find(c => c.data.id === jsonObject.id);
       this.componentsObjs.splice(this.componentsObjs.indexOf(comp1), 1);
   }
   
   setDropId(dropId: string): void {
     console.log("RemoteDashLayoutService.setDropId(): dropId=" + dropId);
     this.dropId = dropId;
   }
   
   dropItem(dragId: string): void {  
     console.log("RemoteDashLayoutService.dropItem(): dragId=" + dragId);
     var tmpComponent: RIItem;
     const comp = this.components.find(c => c.data.id === this.dropId); 
     const comp1:RIItem = this.componentsObjs.find(c => c.data.id === this.dropId);
     switch(dragId) { 
        case "ButtonItemComponent": { 
             if(!(comp.data.component == "ButtonItemComponent")) {
                this.components.splice(this.components.indexOf(comp), 1);
                this.componentsObjs.splice(this.componentsObjs.indexOf(comp1), 1);
                tmpComponent = new RIItem(ButtonItemComponent, {id: this.dropId, IRSignalId: ''});
                this.components.push(JSON.parse(tmpComponent.toString()));
                this.componentsObjs.push(tmpComponent);
             }
           break; 
        } 
        case "GenericItemComponent": { 
             if(!(comp.data.component == "GenericItemComponent")) {
                this.components.splice(this.components.indexOf(comp), 1);
                this.componentsObjs.splice(this.componentsObjs.indexOf(comp1), 1);
                tmpComponent = new RIItem(GenericItemComponent, {id: this.dropId, name: ''});
                this.components.push(JSON.parse(tmpComponent.toString()));
                this.componentsObjs.push(tmpComponent);
             }
           break; 
        } 
        default: { 
           console.log("RemoteDashLayoutService.dropItem(): ALERT: SHOULD NEVER GET HERE");
           break; 
        } 
     } 
   }
   
   getComponentRef(id: string): string {
     //console.log("RemoteDashLayoutService.getComponentRef()");
     const comp = this.components.find(c => c.data.id === id);
     return comp ? comp.data.componentRef : null;
   }

   getComponent(id: string): RIItem {
     //console.log("RemoteDashLayoutService.getComponent()");
     //this.componentsObjs.find(c => { console.log("RemoteDashLayoutService.getComponent(): " + c.toString())});
     const comp = this.componentsObjs.find(c => c.data.id === id);
     return comp ? comp : null;
   }

   updateComponent(data: any): void {
     console.log("RemoteDashLayoutService.updateComponent(): data=" + JSON.stringify(data));
     //this.componentsObjs.find(c => { console.log("RemoteDashLayoutService.updateComponent(): " + c.toString())});
     let myData = JSON.parse(data);
     const comp = this.componentsObjs.find(c => c.data.id === myData.id);
     if (comp) {
        console.log("RemoteDashLayoutService.updateComponent(): found component");
        comp.data.name = myData.name;
        comp.data.IRSignalId = myData.IRSignalId;
        console.log("RemoteDashLayoutService.updateComponent(): found component: comp.data=" + JSON.stringify(comp.data));
     }
   }
}
