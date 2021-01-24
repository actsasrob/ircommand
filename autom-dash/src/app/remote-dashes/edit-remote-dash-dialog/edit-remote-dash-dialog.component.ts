import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RemoteDash} from '../model/remote-dash';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../reducers';
import { EntityCollectionServiceFactory,EntityCollectionService, EntityServices, EntityAction, EntityActionFactory, EntityOp } from '@ngrx/data';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';
import {LearnIR} from '../../learn-irs/model/learn-ir';
import {LearnIREntityService} from '../../shared/services/learn-ir-entity.service';

@Component({
    selector: 'remote-dash-dialog',
    templateUrl: './edit-remote-dash-dialog.component.html',
    styleUrls: ['./edit-remote-dash-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRemoteDashDialogComponent implements OnInit {

    form: FormGroup;

    dialogTitle: string;

    RemoteDash: RemoteDash;

    learnIRsService: EntityCollectionService<LearnIR>; 
    entityActionFactory: EntityActionFactory; 
    learnIRs$: Observable<LearnIR[]>;
    loading$: Observable<boolean>;

    mode: 'create' | 'update';

    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditRemoteDashDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private remoteDashesService: RemoteDashEntityService,
        EntityCollectionServiceFactory: EntityCollectionServiceFactory) {
        this.entityActionFactory = new EntityActionFactory();
        this.learnIRsService = EntityCollectionServiceFactory.create<LearnIR>('LearnIR');
        this.dialogTitle = data.dialogTitle;
        this.RemoteDash = data.RemoteDash;
        this.mode = data.mode;

        const formControls = {
            iconUrl: ['', Validators.required],
            name: ['', Validators.required],
            layout: ['', Validators.required],
            components: ['', Validators.required],
            seqNo: ['', Validators.required],
            learnIRId: ['', Validators.required],
        };

        if (this.mode == 'update') {
            this.form = this.fb.group(formControls);
            this.form.patchValue({...data.RemoteDash});
        } else if (this.mode == 'create') {
            this.form = this.fb.group({
                ...formControls,
                iconUrl: ['https://angular-university.s3-us-west-1.amazonaws.com/course-images/ngrx-v2.png', Validators.required],
                name: ['', Validators.required],
                layout: ['[]', Validators.required],
                components: ['[]', Validators.required],
                seqNo: [2, Validators.required],
                learnIRId: ['', Validators.required],
            });
        }
    }
    ngOnInit() {
        console.log("EditRemoteDashDialogComponent.ngOnInit()");        
        this.learnIRs$ = this.learnIRsService.entities$
        this.learnIRs$.subscribe(result => { console.log("EditRemoteDashDialogComponent.ngOnInit(): " + JSON.stringify(result.length)) });
        
        const action = this.entityActionFactory.create<LearnIR>(
          'LearnIR',
          EntityOp.QUERY_ALL
        );
        
        this.store.dispatch(action);

        this.loading$ = this.learnIRsService.loading$.pipe(delay(0));

        console.log("EditRemoteDashDialogComponent.ngOnInit() at end");        
    }

    onClose() {
        this.dialogRef.close();
    }

    onSave() {

        const RemoteDash: RemoteDash = {
            ...this.RemoteDash,
            ...this.form.value,
        };

        if (this.mode == 'update') {

            this.remoteDashesService.update(RemoteDash);

            this.dialogRef.close();
        } else if (this.mode == 'create') {
            //RemoteDash.userId = JSON.parse(localStorage.getItem('user')).id;
            //console.log("RemoteDash before remoteDashesService.add(): " + JSON.stringify(RemoteDash));
            this.remoteDashesService.add(RemoteDash)
                .subscribe(
                    newRemoteDash => {

                        console.log('New RemoteDash', newRemoteDash);

                        this.dialogRef.close();

                    }
                );

        }


    }


    //learnIRChangeAction(selectedLearnIR) {
    // let dropDownData = this.learnIRs$
    //   .subscribe(LearnIRs => LearnIRs.forEach(learnIR => learnIR.id == selectedLearnIR.id)); 
    //  if (dropDownData) {
    //     console.log("EditRemoteDashDialog.learnIRChangeAction(): deopDownData =" + JSON.stringify(dropDownData));
    //    //this.RemoteDash.learnIRId = dropDownData.id;
    //  }
    //}
}
