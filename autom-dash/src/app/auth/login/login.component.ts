import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {AuthService} from "../services/auth.service";
import {tap} from "rxjs/operators";
import {noop} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

   form: FormGroup;

   messagePerErrorCode = {
      loginfailed: "Invalid credentials"
   };

   errors = [];

   constructor(
       private fb:FormBuilder,
       private authService: AuthService,
       private router:Router) {
 
       this.form = fb.group({
           email: ['test2@automdash.com', Validators.required],
           password: ['', Validators.required],
       });
 
   }
 
   ngOnInit() {
 
   }

   login() {

        const val = this.form.value;

        if (val.email && val.password) {

            this.authService.login(val.email, val.password)
                .subscribe(
                    () => {
                        console.log("User is logged in");
                        this.router.navigateByUrl('/remoteDashes');
                    },
                    response => this.errors = response.error.errors
                );

        }
   }
}

