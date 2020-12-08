import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { OnInit } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlexaMetadataService {  

   //public metadata: any = {};
   private metadata: BehaviorSubject<any> = new BehaviorSubject({});

   constructor(private httpClient: HttpClient) { 
      //console.log("AlexaMetadataService.constructor():");
      let metadata:any = { intents: [] };

      this.httpClient.get("assets/alexa_en-US.json").subscribe(
        (data:any) => {
           //console.log("AlexaMetadataService.constructor(): data=", data);
           data.interactionModel.languageModel.intents.forEach(intent => {
              if (intent.name.includes("_action")) {
                 //console.log("AlexaMetadataService.constructor().intent.name=" + intent.name);  
                 var myIntent = intent;
                 let tag = intent.name.match(/^([^_]+).*/);
                 var shortName = tag[1];
                 var myActions;
                 var myComponents;
                 intent.slots.forEach(slot => {
                    if (slot.type.includes("_ACTION")) {
                       let slotType = slot.type;
                       data.interactionModel.languageModel.types.forEach(type => {
                          if (type.name === slotType) {
                             myActions = type.values; 
                          }
                       });
                    }   
                    if (slot.type.includes("_DEVICE") || slot.type.includes("_COMPONENT")) {
                       let slotType = slot.type;
                       data.interactionModel.languageModel.types.forEach(type => {
                          if (type.name === slotType) {
                             myComponents = type.values; 
                          }
                       });
                    }
                 });
                 metadata.intents.push({ name: shortName, intent: myIntent, actions: myActions, components: myComponents });
              }
              this.metadata.next(metadata);
           });
         },
         err => {
           console.log("AlexaMetadataService.constructor(): err", JSON.stringify(err));
         }
      );
   }

   getMetadata(): Observable<any> {
      return this.metadata;
   }
 }
 
 
 
 
