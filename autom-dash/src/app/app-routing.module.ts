import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LearnirsComponent } from './components/learnirs/learnirs.component';

const routes: Routes = [
  { path: 'learnirs', component: LearnirsComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
