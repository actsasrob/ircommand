import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from './reducers';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router'; 
import {isLoggedIn, isLoggedOut} from './auth/auth.selectors';
import {login, logout} from './auth/auth.actions';
import {MatSidenav} from '@angular/material/sidenav';
import { SidenavService } from './shared/services/sidenav.service';

import { AuthService as Auth0AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

import { environment } from '../environments/environment';  

@Component({
    selector: 'app-root',      
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('sidenav') public sidenav: MatSidenav;

    env = environment;
 
    loading = true;

    isLoggedIn$: Observable<boolean>;           

    isLoggedOut$: Observable<boolean>;      

    constructor(private router: Router,
                private store: Store<AppState>,
                public auth0: Auth0AuthService,
                @Inject(DOCUMENT) private doc: Document,
                private sidenavService: SidenavService
    ) {

    }

    ngOnInit() {

        //this.sidenavService.setSidenav(this.sidenav);
        const userProfile = localStorage.getItem("user");

        if (userProfile) {
            this.store.dispatch(login({user: JSON.parse(userProfile)}));
        }

        this.router.events.subscribe(event => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });

        this.isLoggedIn$ = this.store
            .pipe(
                select(isLoggedIn)
            );

        this.isLoggedOut$ = this.store
            .pipe(
                select(isLoggedOut)
            );

    }

    ngAfterViewInit (): void {
       this.sidenavService.setSidenav(this.sidenav);

    }

    login() {

    }

    logout() {
        this.store.dispatch(logout());
    }

    loginAuth0() {
      this.auth0.loginWithRedirect();
    }

    logoutAuth0() {
       this.auth0.logout({ returnTo: this.doc.location.origin });
       this.store.dispatch(logout());
    }


}

