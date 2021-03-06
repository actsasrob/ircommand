import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {Observable} from "rxjs";
import {MatSidenav} from '@angular/material/sidenav';

import {AppState} from './reducers';
import {AuthService} from "./auth/services/auth.service";
import {User} from "./auth/model/user";
import { SidenavService } from './shared/services/sidenav.service';
import {select, Store} from '@ngrx/store';
import {login, logout} from './auth/auth.actions';    
  
@Component({
    selector: 'app-root',      
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('sidenav') public sidenav: MatSidenav;

    loading: boolean = false;
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;
    user$: Observable<User>;

    constructor(private router:Router,
                private authService: AuthService,
                private sidenavService: SidenavService,
                private store: Store<AppState>
    ) {

    }

    ngOnInit() {
        this.sidenavService.setSidenav(this.sidenav);

        this.isLoggedIn$ = this.authService.isLoggedIn$;
        this.isLoggedOut$ = this.authService.isLoggedOut$;
        this.user$ = this.authService.user$;
    }

    logout() {

        this.authService.logout().subscribe();
        this.store.dispatch(logout());
        this.router.navigateByUrl('/');
    }

    ngAfterViewInit (): void {
       this.sidenavService.setSidenav(this.sidenav);
    }

}

