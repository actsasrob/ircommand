import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {IRSignal} from "../model/ir-signal";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditIRSignalDialogComponent} from "../edit-ir-signal-dialog/edit-ir-signal-dialog.component";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {IRSignalEntityService} from '../services/ir-signal-entity.service';

@Component({
    selector: 'ir-signals-card-list',
    templateUrl: './ir-signals-card-list.component.html',
    styleUrls: ['./ir-signals-card-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IRSignalsCardListComponent implements OnInit {

    @Input()
    IRSignals: IRSignal[];

    @Output()
    IRSignalChanged = new EventEmitter();

    constructor(
      private dialog: MatDialog,
      private IRSignalService: IRSignalEntityService) {
    }

    ngOnInit() {

    }

    editIRSignal(IRSignal:IRSignal) {

        const dialogConfig = defaultDialogConfig();

        dialogConfig.data = {
          dialogTitle:"Edit IRSignal",
          IRSignal,
          mode: 'update'
        };

        this.dialog.open(EditIRSignalDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => this.IRSignalChanged.emit());

    }

  onDeleteIRSignal(IRSignal:IRSignal) {

        this.IRSignalService.delete(IRSignal)
            .subscribe(
                () => console.log("Delete completed"),
                err => console.log("Deleted failed", err)
            );


  }

}


