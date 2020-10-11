import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {LearnIR} from "../model/learn-ir";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditLearnIRDialogComponent} from "../edit-learn-ir-dialog/edit-learn-ir-dialog.component";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {LearnIREntityService} from '../services/learn-ir-entity.service';

@Component({
    selector: 'learn-irs-card-list',
    templateUrl: './learn-irs-card-list.component.html',
    styleUrls: ['./learn-irs-card-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LearnIRsCardListComponent implements OnInit {

    @Input()
    learnIRs: LearnIR[];

    @Output()
    learnIRChanged = new EventEmitter();

    constructor(
      private dialog: MatDialog,
      private learnIRService: LearnIREntityService) {
    }

    ngOnInit() {

    }

    editLearnIR(learnIR:LearnIR) {

        const dialogConfig = defaultDialogConfig();

        dialogConfig.data = {
          dialogTitle:"Edit LearnIR",
          learnIR,
          mode: 'update'
        };

        this.dialog.open(EditLearnIRDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => this.learnIRChanged.emit());

    }

  onDeleteLearnIR(learnIR:LearnIR) {

        this.learnIRService.delete(learnIR)
            .subscribe(
                () => console.log("Delete completed"),
                err => console.log("Deleted failed", err)
            );


  }

}


