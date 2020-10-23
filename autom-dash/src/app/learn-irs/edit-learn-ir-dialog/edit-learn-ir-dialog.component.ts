import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LearnIR} from '../model/learn-ir';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {LearnIREntityService} from '../../shared/services/learn-ir-entity.service';

@Component({
    selector: 'learn-ir-dialog',
    templateUrl: './edit-learn-ir-dialog.component.html',
    styleUrls: ['./edit-learn-ir-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLearnIRDialogComponent {

    form: FormGroup;

    dialogTitle: string;

    learnIR: LearnIR;

    mode: 'create' | 'update';

    loading$: Observable<boolean>;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditLearnIRDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private learnIRsService: LearnIREntityService) {

        this.dialogTitle = data.dialogTitle;
        this.learnIR = data.learnIR;
        this.mode = data.mode;

        const formControls = {
            location: ['', Validators.required],
            address: ['', Validators.required],
            seqNo: ['', Validators.required],
        };

        if (this.mode == 'update') {
            this.form = this.fb.group(formControls);
            this.form.patchValue({...data.learnIR});
        } else if (this.mode == 'create') {
            this.form = this.fb.group({
                ...formControls,
                location: ['', Validators.required],
                address: ['', Validators.required],
                seqNo: [2, Validators.required],
            });
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    onSave() {

        const learnIR: LearnIR = {
            ...this.learnIR,
            ...this.form.value,
        };

        if (this.mode == 'update') {

            this.learnIRsService.update(learnIR);

            this.dialogRef.close();
        } else if (this.mode == 'create') {
            learnIR.userId = JSON.parse(localStorage.getItem('user')).id;
            console.log("learnIR before learnIRsService.add(): " + JSON.stringify(learnIR));
            this.learnIRsService.add(learnIR)
                .subscribe(
                    newLearnIR => {

                        console.log('New LearnIR', newLearnIR);

                        this.dialogRef.close();

                    }
                );

        }


    }


}
