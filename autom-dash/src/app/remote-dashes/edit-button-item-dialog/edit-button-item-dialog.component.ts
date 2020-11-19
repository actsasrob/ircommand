import {ChangeDetectionStrategy, Component, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../reducers';
import { EntityCollectionServiceFactory,EntityCollectionService, EntityServices, EntityAction, EntityActionFactory, EntityOp } from '@ngrx/data';
import {IRSignal} from '../../ir-signals/model/ir-signal';
import {IRSignalEntityService} from '../../shared/services/ir-signal-entity.service';

@Component({
    selector: 'button-item-dialog',
    templateUrl: './edit-button-item-dialog.component.html',
    styleUrls: ['./edit-button-item-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditButtonItemDialogComponent implements OnInit {

    form: FormGroup;

    dialogTitle: string;

    myData: any;

    IRSignalsService: EntityCollectionService<IRSignal>; 
    entityActionFactory: EntityActionFactory; 
    IRSignals$: Observable<IRSignal[]>;
    loading$: Observable<boolean>;

    mode: 'create' | 'update';

    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditButtonItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        EntityCollectionServiceFactory: EntityCollectionServiceFactory) {
        this.entityActionFactory = new EntityActionFactory();
        this.IRSignalsService = EntityCollectionServiceFactory.create<IRSignal>('IRSignal');
        this.dialogTitle = data.dialogTitle;
        this.myData = data.data;
        this.mode = data.mode;

        const formControls = {
            //name: ['', Validators.required],
            //IRSignal: ['', Validators.required],
            IRSignalId: ['', Validators.required],
        };

        if (this.mode == 'update') {
            this.form = this.fb.group(formControls);
            this.form.patchValue({...data.data});
        } else if (this.mode == 'create') {
            this.form = this.fb.group({
                ...formControls,
                //name: ['', Validators.required],
                //IRSignal: ['', Validators.required],
                IRSignalId: ['', Validators.required],
            });
        }
    }

    ngOnInit() {
        console.log("EditButtonItemDialogComponent.ngOnInit()");        
        this.IRSignals$ = this.IRSignalsService.entities$
        //this.IRSignals$.subscribe(result => { console.log("EditButtonItemDialogComponent.ngOnInit(): " + JSON.stringify(result.length)) });
        
        const action = this.entityActionFactory.create<IRSignal>(
          'IRSignal',
          EntityOp.QUERY_ALL
        );
        
        this.store.dispatch(action);

        this.loading$ = this.IRSignalsService.loading$.pipe(delay(0));

        //console.log("EditButtonItemDialogComponent.ngOnInit() at end");        
    }

    onClose(event: Event) {
        event.stopPropagation();
        this.dialogRef.close();
    }

    onSave(event: Event) {
        event.stopPropagation();
        const myData: any = {
            ...this.myData,
            ...this.form.value,
        };
        console.log("EditButtonItemDialog.onSave(): myData=" + JSON.stringify(myData) + " this.mode=" + this.mode);
        if (this.mode == 'update') {
            this.dialogRef.close(myData);
        } else if (this.mode == 'create') {
            this.dialogRef.close(myData);
        }
    }


    //IRSignalChangeAction(selectedIRSignal) {
    //  //this.exam_title="";
    // let dropDownData = this.IRSignals$
    //   .subscribe(IRSignals => IRSignals.forEach(IRSignal => IRSignal.id == selectedIRSignal.id)); 
    //  if (dropDownData) {
    //     console.log("EditButtonItemDialog.IRSignalChangeAction(): deopDownData =" + JSON.stringify(dropDownData));
    //  }
    //}
}
