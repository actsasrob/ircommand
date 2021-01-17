import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {Store} from "@ngrx/store";

import {AuthService} from "../auth.service";
import {AuthService as Auth0AuthService} from '@auth0/auth0-angular';

import {tap} from "rxjs/operators";
import {noop} from "rxjs";
import {Router} from "@angular/router";
import {AppState} from '../../reducers';
import {login} from '../auth.actions';
import {AuthActions} from '../action-types';

import { SidenavService } from '../../shared/services/sidenav.service';

import {environment} from '../../../environments/environment';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  env = environment;

  constructor(
      private sidenavService: SidenavService,
      private fb:FormBuilder,
      private auth: AuthService,
      public auth0: Auth0AuthService,
      private router:Router,
      private store: Store<AppState>) {

      this.form = fb.group({
          email: ['test@autom-dash.com', Validators.required],
          password: ['test', Validators.required],
      });

  }

  ngOnInit() {

  }

  login() { // local login
      const val = this.form.value;

      this.auth.login(val.email, val.password)
          .pipe(
              tap(user => {

                  console.log(user);

                  this.store.dispatch(login({user}));

                  this.router.navigateByUrl('/remoteDashes');

              })
          )
          .subscribe(
              noop,
              () => alert('Login Failed')
          );
  }

  loginAuth0() { // auth0 login
     this.auth0.loginWithRedirect();
  }

  logoutAuth0() {
     console.log("login: logoutAuth0");
     //this.auth0.logout({ returnTo: this.doc.location.origin });
     //this.store.dispatch(logout());
  }

  toggleSidenav() {
     this.sidenavService.toggle();
  }
}

