import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {IRSignal} from '../model/ir-signal';
import {Observable} from 'rxjs';
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditIRSignalDialogComponent} from '../edit-ir-signal-dialog/edit-ir-signal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {tap,map} from 'rxjs/operators';
import {IRSignalEntityService} from '../../shared/services/ir-signal-entity.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    IRSignals$: Observable<IRSignal[]>;

    constructor(
      private dialog: MatDialog,
      private IRSignalService: IRSignalEntityService) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {

    this.IRSignals$ = this.IRSignalService.entities$;
    /*this.IRSignals$ = this.IRSignalService.entities$
      .pipe(
        tap(IRSignals => console.log("IRSignal.HomeComponent.reload(): " + JSON.stringify(IRSignals))),
        map(IRSignals => IRSignals.filter(IRSignal => IRSignal.userId == JSON.parse(localStorage.getItem('user')).id))
      );
     */

  }

  onAddIRSignal() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create IRSignal",
      mode: 'create'
    };

    //this.dialog.open(EditIRSignalDialogComponent, dialogConfig);
    const dialogRef = this.dialog.open(EditIRSignalDialogComponent, dialogConfig);

    
  }


}
