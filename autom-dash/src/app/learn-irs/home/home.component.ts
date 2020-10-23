import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LearnIR} from '../model/learn-ir';
import {Observable} from 'rxjs';
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditLearnIRDialogComponent} from '../edit-learn-ir-dialog/edit-learn-ir-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {tap,map} from 'rxjs/operators';
import {LearnIREntityService} from '../../shared/services/learn-ir-entity.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    learnIRs$: Observable<LearnIR[]>;

    constructor(
      private dialog: MatDialog,
      private learnIRService: LearnIREntityService) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {

    this.learnIRs$ = this.learnIRService.entities$;
    /*this.learnIRs$ = this.learnIRService.entities$
      .pipe(
        tap(learnIRs => console.log("LearnIR.HomeComponent.reload(): " + JSON.stringify(learnIRs))),
        map(learnIRs => learnIRs.filter(learnIR => learnIR.userId == JSON.parse(localStorage.getItem('user')).id))
      );
     */

  }

  onAddLearnIR() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create LearnIR",
      mode: 'create'
    };

    //this.dialog.open(EditLearnIRDialogComponent, dialogConfig);
    const dialogRef = this.dialog.open(EditLearnIRDialogComponent, dialogConfig);

    
  }


}
