import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LearnIR} from '../model/learn-ir';
import {Observable} from 'rxjs';
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditLearnIRDialogComponent} from '../edit-learn-ir-dialog/edit-learn-ir-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {LearnIREntityService} from '../services/learn-ir-entity.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    promoTotal$: Observable<number>;

    beginnerLearnIRs$: Observable<LearnIR[]>;

    advancedLearnIRs$: Observable<LearnIR[]>;

    constructor(
      private dialog: MatDialog,
      private learnIRService: LearnIREntityService) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {

    this.beginnerLearnIRs$ = this.learnIRsService.entities$
      .pipe(
        map(learnIRs => learnIRs.filter(learnIR => learnIR.category == 'BEGINNER'))
      );

    this.advancedLearnIRs$ = this.learnIRsService.entities$
      .pipe(
        map(learnIRs => learnIRs.filter(learnIR => learnIR.category == 'ADVANCED'))
      );

    this.promoTotal$ = this.learnIRsService.entities$
        .pipe(
            map(learnIRs => learnIRs.filter(learnIR => learnIR.promo).length)
        );

  }

  onAddLearnIR() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create LearnIR",
      mode: 'create'
    };

    this.dialog.open(EditLearnIRDialogComponent, dialogConfig);

  }


}
