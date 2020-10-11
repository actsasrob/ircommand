import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RemoteDash} from '../model/remote-dash';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
//import {RemoteDashesHttpService} from '../services/remote-dashes-http.service';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';

@Component({
    selector: 'remote-dash-dialog',
    templateUrl: './edit-remote-dash-dialog.component.html',
    styleUrls: ['./edit-remote-dash-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRemoteDashDialogComponent {

    form: FormGroup;

    dialogTitle: string;

    remoteDash: RemoteDash;

    mode: 'create' | 'update';

    loading$: Observable<boolean>;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditRemoteDashDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private remoteDashesService: RemoteDashEntityService) {

        this.dialogTitle = data.dialogTitle;
        this.remoteDash = data.remoteDash;
        this.mode = data.mode;

        const formControls = {
            description: ['', Validators.required],
            category: ['', Validators.required],
            longDescription: ['', Validators.required],
            promo: ['', []]
        };

        if (this.mode == 'update') {
            this.form = this.fb.group(formControls);
            this.form.patchValue({...data.remoteDash});
        } else if (this.mode == 'create') {
            this.form = this.fb.group({
                ...formControls,
                url: ['', Validators.required],
                iconUrl: ['', Validators.required]
            });
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    onSave() {

        const remoteDash: RemoteDash = {
            ...this.remoteDash,
            ...this.form.value
        };

        if (this.mode == 'update') {

            this.remoteDashesService.update(remoteDash);

            this.dialogRef.close();
        } else if (this.mode == 'create') {
            remoteDash.userId = JSON.parse(localStorage.getItem('user')).id;
            console.log("remoteDash before remoteDashesService.add(): " + JSON.stringify(remoteDash));

            this.remoteDashesService.add(remoteDash)
                .subscribe(
                    newRemoteDash => {

                        console.log('New RemoteDash', newRemoteDash);

                        this.dialogRef.close();

                    }
                );

        }


    }


}
