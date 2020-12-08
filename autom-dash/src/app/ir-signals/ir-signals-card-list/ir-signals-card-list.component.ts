import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {IRSignal} from "../model/ir-signal";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditIRSignalDialogComponent} from "../edit-ir-signal-dialog/edit-ir-signal-dialog.component";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {IRSignalEntityService} from '../../shared/services/ir-signal-entity.service';
import { AlexaMetadataService } from '../../shared/services/alexa-metadata.service';

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
      private IRSignalService: IRSignalEntityService,
      private alexaMetadataService: AlexaMetadataService) {
    }

    ngOnInit() {
        this.alexaMetadataService.getMetadata().subscribe(metadata => {
           //metadata.intents.find(intent => {
           //})
        });
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


