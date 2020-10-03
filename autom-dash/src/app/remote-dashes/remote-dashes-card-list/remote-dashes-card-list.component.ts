import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {RemoteDash} from "../model/remote-dash";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditRemoteDashDialogComponent} from "../edit-remote-dash-dialog/edit-remote-dash-dialog.component";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';

@Component({
    selector: 'remote-dashes-card-list',
    templateUrl: './remote-dashes-card-list.component.html',
    styleUrls: ['./remote-dashes-card-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDashesCardListComponent implements OnInit {

    @Input()
    remoteDashes: RemoteDash[];

    @Output()
    remoteDashChanged = new EventEmitter();

    constructor(
      private dialog: MatDialog,
      private remoteDashService: RemoteDashEntityService) {
    }

    ngOnInit() {

    }

    editRemoteDash(remoteDash:RemoteDash) {

        const dialogConfig = defaultDialogConfig();

        dialogConfig.data = {
          dialogTitle:"Edit RemoteDash",
          remoteDash,
          mode: 'update'
        };

        this.dialog.open(EditRemoteDashDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => this.remoteDashChanged.emit());

    }

  onDeleteRemoteDash(remoteDash:RemoteDash) {

        this.remoteDashService.delete(remoteDash)
            .subscribe(
                () => console.log("Delete completed"),
                err => console.log("Deleted failed", err)
            );


  }

}









