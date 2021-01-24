import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

import {AuthService} from "../services/auth.service";
import {tap} from "rxjs/operators";
import {noop} from "rxjs";
import {Router} from "@angular/router";

import { PasswordValidator } from './password.validator';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

   form: FormGroup;
   matching_passwords_group: FormGroup;

   errors:string[] = [];

   messagePerErrorCode = {
       min: 'The minimum length is 10 characters',
       uppercase: 'At least one upper case character',
       digits: 'At least one numeric character',
       "err_user": 'Could not create user'
   };
 
   constructor(
       private fb:FormBuilder,
       private authService: AuthService,
       private router:Router) {
 
       this.form = fb.group({
           email: new FormControl('', Validators.compose([
   	     Validators.required,
   	     Validators.email
 	  ])),
           password: ['', Validators.required],
           confirm: ['', Validators.required],
       }, { validators: PasswordValidator});
 
   }
 
   ngOnInit() {
 
   }

    signUp() {
        const val = this.form.value;

        if (val.email && val.password && val.password === val.confirm) {

            this.authService.signUp(val.email, val.password)
                .subscribe(
                    () => {
                        this.router.navigateByUrl('/remoteDashes');

                        console.log("User created successfully")
                    },
                    response => this.errors = response.error.errors
                );

        }

   }
}

