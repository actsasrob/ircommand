import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RemoteDash} from '../model/remote-dash';
import {Observable} from 'rxjs';
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditRemoteDashDialogComponent} from '../edit-remote-dash-dialog/edit-remote-dash-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    remoteDashes$: Observable<RemoteDash[]>;

    constructor(
      private dialog: MatDialog,
      private remoteDashService: RemoteDashEntityService) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {

    this.remoteDashes$ = this.remoteDashService.entities$
      .pipe(
        map(remoteDashes => remoteDashes.filter(remoteDash => remoteDash.category == 'BEGINNER'))
      );

    this.advancedRemoteDashes$ = this.remoteDashService.entities$
      .pipe(
        map(remoteDashes => remoteDashes.filter(remoteDash => remoteDash.category == 'ADVANCED'))
      );

    this.promoTotal$ = this.remoteDashService.entities$
        .pipe(
            map(remoteDashes => remoteDashes.filter(remoteDash => remoteDash.promo).length)
        );

  }

  onAddRemoteDash() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create RemoteDash",
      mode: 'create'
    };

    this.dialog.open(EditRemoteDashDialogComponent, dialogConfig);

  }


}
