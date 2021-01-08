import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

import {Store} from "@ngrx/store";

import {AuthService} from "../auth.service";
import {tap} from "rxjs/operators";
import {noop} from "rxjs";
import {Router} from "@angular/router";
import {AppState} from '../../reducers';
import {login} from '../auth.actions';
import {AuthActions} from '../action-types';

import { PasswordValidator } from './password.validator';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  matching_passwords_group: FormGroup;

  constructor(
      private fb:FormBuilder,
      private auth: AuthService,
      private router:Router,
      private store: Store<AppState>) {

      this.form = fb.group({
          email: new FormControl('', Validators.compose([
  	     Validators.required,
  	     Validators.email
	  ])),
          username: ['', Validators.required],
          password: ['', Validators.required],
          verify_password: ['', Validators.required],
      }, { validators: PasswordValidator});

  }

  ngOnInit() {

  }

  signup() {
      const val = this.form.value;

      //console.log("signup.signup(): val=" + JSON.stringify(val));
      this.auth.signup(val.email, val.username, val.password)
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

}

