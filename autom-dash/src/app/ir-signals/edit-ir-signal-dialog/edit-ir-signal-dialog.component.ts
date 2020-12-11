import {ChangeDetectionStrategy, Component, Inject, OnInit, ElementRef} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IRSignal} from '../model/ir-signal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../reducers';
import { EntityCollectionServiceFactory,EntityCollectionService, EntityServices, EntityAction, EntityActionFactory, EntityOp } from '@ngrx/data';
import {IRSignalEntityService} from '../../shared/services/ir-signal-entity.service';
import {LearnIR} from '../../learn-irs/model/learn-ir';
import {LearnIREntityService} from '../../shared/services/learn-ir-entity.service';
import { IRService } from '../../shared/services/ir.service';
import {  takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlexaMetadataService } from '../../shared/services/alexa-metadata.service';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'ir-signal-dialog',
    templateUrl: './edit-ir-signal-dialog.component.html',
    styleUrls: ['./edit-ir-signal-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditIRSignalDialogComponent implements OnInit {

    form: FormGroup;

    dialogTitle: string;

    IRSignal: IRSignal = undefined;

    learnIRsService: EntityCollectionService<LearnIR>; 
    entityActionFactory: EntityActionFactory; 
    learnIRs$: Observable<LearnIR[]>;

    mode: 'create' | 'update';

    learnIR$: Observable<LearnIR>;

    loading$: Observable<boolean>;

    IRSignalName: string = "";

    rawIRSignal: string = "";

    IRSignalIOMessage: string = "";

    selectedIntent: any = '';
    selectedAction: any = '';
    selectedComponent: any = '';
    selectedToggle: boolean = false;
    selectedDigit: any = '';
   
    destroy$: Subject<boolean> = new Subject<boolean>();

    selectedLearnIRAddress: string = "";

    alexaMetadata$: Observable<any>;
    intents: Array<any> = [];
    digits: Array<any> = [];

    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditIRSignalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private IRSignalsService: IRSignalEntityService,
        EntityCollectionServiceFactory: EntityCollectionServiceFactory,
        private irService: IRService,
        private ref: ChangeDetectorRef,
        private alexaMetadataService: AlexaMetadataService) {
        this.entityActionFactory = new EntityActionFactory();

        this.learnIRsService = EntityCollectionServiceFactory.create<LearnIR>('LearnIR');
        this.dialogTitle = data.dialogTitle;
        this.IRSignal = data.IRSignal;
        this.mode = data.mode;

        const formControls = {
            iconUrl: ['', Validators.required],
            name: ['', Validators.required],
            signal: ['', Validators.required],
            seqNo: ['', Validators.required],
            learnIRId: ['', !Validators.required],
            alexaIntent: ['', !Validators.required],
            alexaAction: ['', !Validators.required],
            alexaComponent: ['', !Validators.required],
            alexaToggle: [false, Validators.required],
            alexaDigit: ['', !Validators.required],
        };

        if (this.mode == 'update') {
            this.form = this.fb.group(formControls);
            this.form.patchValue({...data.IRSignal});
        } else if (this.mode == 'create') {
            this.form = this.fb.group({
                ...formControls,
                iconUrl: ['https://angular-university.s3-us-west-1.amazonaws.com/course-images/ngrx-v2.png', Validators.required],
                name: ['', Validators.required],
                signal: ['', Validators.required],
                seqNo: [2, Validators.required],
                alexaIntent: ['', !Validators.required],
                alexaAction: ['', !Validators.required],
                alexaComponent: ['', !Validators.required],
                alexaToggle: [false, Validators.required],
                alexaDigit: ['', !Validators.required],
            });
        }
    }

    ngOnInit() {
        console.log("EditIRSignalDialogComponent.ngOnInit() this.IRSignal=" + JSON.stringify(this.IRSignal));        
        this.IRSignalName = (this.IRSignal && this.IRSignal.name ? this.IRSignal.name : '');
        this.selectedToggle = (this.IRSignal && this.IRSignal.alexaToggle ? this.IRSignal.alexaToggle : false);
        this.selectedDigit = (this.IRSignal && this.IRSignal.alexaDigit ? this.IRSignal.alexaDigit : '');

        this.learnIRs$ = this.learnIRsService.entities$
        this.learnIRs$.subscribe(result => { 
           console.log("EditIRSignalDialogComponent.ngOnInit(): here here here: " + JSON.stringify(result.length)) 
        });
        
        const action = this.entityActionFactory.create<LearnIR>(
           'LearnIR',
           EntityOp.QUERY_ALL
        );

        this.store.dispatch(action);

        this.loading$ = this.learnIRsService.loading$.pipe(delay(0));

        this.rawIRSignal = this.form.get('signal').value;

        this.alexaMetadata$ = this.alexaMetadataService.getMetadata(); 
        this.alexaMetadata$.subscribe(metadata => {
           this.intents = metadata.intents;
           this.digits = metadata.digits;
           console.log("EditIRSignalDialogComponent.ngOnInit() intents=", this.intents);
           console.log("EditIRSignalDialogComponent.ngOnInit() digits=", this.digits);

           metadata.intents.find(intent => {
              //console.log("EditIRSignalDialogComponent.ngOnInit() intent=" + JSON.stringify(intent));
              if (this.IRSignal && (intent.intent.name === this.IRSignal.alexaIntent)) {
                 this.selectedIntent = intent;
                 //console.log("EditIRSignalDialogComponent.ngOnInit() this.selectedIntent" + JSON.stringify(this.selectedIntent));
                 intent.actions.find(action => {
                    if (action.id === this.IRSignal.alexaAction) {
                       this.selectedAction = action.id;
                    }
                 });
                 intent.components.find(component => {

                    if (component.id === this.IRSignal.alexaComponent) {
                       this.selectedComponent = component.id;
                    }
                 });
              }
           })
        });

        console.log("EditIRSignalDialogComponent.ngOnInit() at end");        
    }

    onClose() {
        this.dialogRef.close();
    }

    onSave() {

        const IRSignal: IRSignal = {
            ...this.IRSignal,
            ...this.form.value,
        };

        IRSignal.alexaIntent = (this.selectedIntent ? this.selectedIntent.intent.name : '');
 
        if (this.mode == 'update') {

            this.IRSignalsService.update(IRSignal);

            this.dialogRef.close();
        } else if (this.mode == 'create') {
            IRSignal.userId = JSON.parse(localStorage.getItem('user')).id;
            console.log("IRSignal before IRSignalsService.add(): " + JSON.stringify(IRSignal));
            this.IRSignalsService.add(IRSignal)
                .subscribe(
                    newIRSignal => {

                        console.log('New IRSignal', newIRSignal);

                        this.dialogRef.close();

                    }
                );

        }


    }

    captureIRSignal() {
       this.irService.sendGetRequest(this.selectedLearnIRAddress)
         .pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
           console.log(res);
           let regexp =  /.*<body>(.*)<\/body.*/mg;
           let match = regexp.exec(JSON.stringify(res));

           let response="";
           if(match.length > 0 && match[1] != 'error') {
              response=match[1];
              this.rawIRSignal = response;
              this.IRSignalIOMessage="Success";
           }
           else {
              this.rawIRSignal = "";
              this.IRSignalIOMessage="No IR Signal Detected. Please try again.";
           }

           // mark component for change detection
           this.ref.markForCheck(); 
       })  
    }

    sendIRSignal() {
       this.irService.sendPostRequest(this.selectedLearnIRAddress, this.form.get('signal').value)
         .pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
           console.log(res);
           this.IRSignalIOMessage = res.body;

           // mark component for change detection
           this.ref.markForCheck(); 
       })  
    }

    computeName() {
       var action: string = undefined; 
       var component: string = undefined;

        if (this.selectedIntent && this.selectedAction) {
           action = this.selectedIntent.actions.find(action => action.id === this.selectedAction).name.value;
           if (this.selectedDigit) {
              action = this.digits.find(digit => digit.id === this.selectedDigit).name.value;
           }

           this.IRSignalName = action;
           if (this.selectedComponent) {
              component = this.selectedIntent.components.find(component => component.id === this.selectedComponent).name.value;
           }

           this.IRSignalName = (this.selectedToggle ? 'toggle ' : '') + action + (component ? ` ${component}` : '');
        }
    }

    onSelectChangedAction(selected) {
        //console.log("EditIRSignalDialog.onSelectChangedAction(): " + " selected.value=" + JSON.stringify(selected.value));
       this.computeName();
    }

    onSelectChangedComponent(selected) {
       this.computeName();
    }

    onChangedToggle() {
       this.selectedToggle = !this.selectedToggle;
       this.computeName();
    }

    onSelectChangedDigit(selected) {
       this.computeName();
    }

    onSelectChangedLearnIR(selected) {
        console.log("EditIRSignalDialog.onSelectChangedLearnIR(): " + " selected.value=" + JSON.stringify(selected.value));
        this.selectedLearnIRAddress=selected.value;
      }
}
