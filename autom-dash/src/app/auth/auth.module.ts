import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {AdminComponent} from './admin/admin.component';
import {MatCardModule} from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import {Router, RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { StoreModule } from '@ngrx/store';
import {AuthService} from "./services/auth.service";
import {AuthorizationGuard} from "./services/authorization.guard";
import {EffectsModule} from '@ngrx/effects';

import {RbacAllowDirective} from "./common/rbac-allow.directive";


export function createAdminOnlyGuard(authService:AuthService, router:Router) {
    return new AuthorizationGuard(['ADMIN'], authService, router);
}

export function createUsersGuard(authService:AuthService, router:Router) {
    return new AuthorizationGuard(['USER'], authService, router);
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        RouterModule.forChild([{path: '', component: LoginComponent},
                               {path: 'signup', component: SignupComponent},
                               {path: 'admin', component: AdminComponent}]),
    ],
    declarations: [LoginComponent,
                   SignupComponent,
                   AdminComponent,
                   RbacAllowDirective
                  ],
    exports: [LoginComponent,
              SignupComponent,
              AdminComponent
             ]
})
export class AuthModule {
    static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
               AuthService,
               {
                   //provide: 'adminsOnlyGuard',
                   //useFactory: createAdminOnlyGuard,
                   provide: 'usersGuard',
                   useFactory: createUsersGuard,
                   deps: [
                       AuthService,
                       Router
                   ]

               }
            ]
        }
    }
}
