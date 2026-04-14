import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './my-profile.component';

const routes: Routes = [
  { path: '', component: MyProfileComponent }
];

@NgModule({
  declarations: [MyProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MyProfileModule { }
