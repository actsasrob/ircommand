import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IRSignal} from '../model/ir-signal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
//import {IRSignalsHttpService} from '../services/ir-signals-http.service';
import {IRSignalEntityService} from '../services/ir-signal-entity.service';

@Component({
    selector: 'ir-signal-dialog',
    templateUrl: './edit-ir-signal-dialog.component.html',
    styleUrls: ['./edit-ir-signal-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditIRSignalDialogComponent {

    form: FormGroup;

    dialogTitle: string;

    IRSignal: IRSignal;

    mode: 'create' | 'update';

    loading$: Observable<boolean>;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditIRSignalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private IRSignalsService: IRSignalEntityService) {

        this.dialogTitle = data.dialogTitle;
        this.IRSignal = data.IRSignal;
        this.mode = data.mode;

        const formControls = {
            iconUrl: ['', Validators.required],
            name: ['', Validators.required],
            signal: ['', Validators.required],
            seqNo: ['', Validators.required],
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
            });
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    onSave() {

        const IRSignal: IRSignal = {
            ...this.IRSignal,
            ...this.form.value,
        };

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


}
