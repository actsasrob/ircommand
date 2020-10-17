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
    RemoteDashes: RemoteDash[];

    @Output()
    RemoteDashChanged = new EventEmitter();

    constructor(
      private dialog: MatDialog,
      private RemoteDashService: RemoteDashEntityService) {
    }

    ngOnInit() {

    }

    editRemoteDash(RemoteDash:RemoteDash) {

        const dialogConfig = defaultDialogConfig();

        dialogConfig.data = {
          dialogTitle:"Edit RemoteDash",
          RemoteDash,
          mode: 'update'
        };

        this.dialog.open(EditRemoteDashDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => this.RemoteDashChanged.emit());

    }

  onDeleteRemoteDash(RemoteDash:RemoteDash) {

        this.RemoteDashService.delete(RemoteDash)
            .subscribe(
                () => console.log("Delete completed"),
                err => console.log("Deleted failed", err)
            );


  }

}


