import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RemoteDash} from '../model/remote-dash';
import {Observable} from 'rxjs';
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditRemoteDashDialogComponent} from '../edit-remote-dash-dialog/edit-remote-dash-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {tap,map} from 'rxjs/operators';
import {RemoteDashEntityService} from '../services/remote-dash-entity.service';
import { SidenavService } from '../../shared/services/sidenav.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    RemoteDashes$: Observable<RemoteDash[]>;

    constructor(
      private dialog: MatDialog,
      private RemoteDashService: RemoteDashEntityService,
      private sidenavService: SidenavService) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {

    this.RemoteDashes$ = this.RemoteDashService.entities$;
    /*this.RemoteDashes$ = this.RemoteDashService.entities$
      .pipe(
        tap(RemoteDashes => console.log("RemoteDash.HomeComponent.reload(): " + JSON.stringify(RemoteDashes))),
        map(RemoteDashes => RemoteDashes.filter(RemoteDash => RemoteDash.userId == JSON.parse(localStorage.getItem('user')).id))
      );
     */

  }

  onAddRemoteDash() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create RemoteDash",
      mode: 'create'
    };

    //this.dialog.open(EditRemoteDashDialogComponent, dialogConfig);
    const dialogRef = this.dialog.open(EditRemoteDashDialogComponent, dialogConfig);

    
  }

  toggleSidenav() {
     this.sidenavService.toggle();
  }

}
