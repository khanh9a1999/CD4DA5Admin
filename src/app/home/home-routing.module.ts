import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';




const routes: Routes = [
    //đây là file link của home module
  {path:'',component:HomeComponent},//link là localhost:4200/home 
  { path:'user',component: UserComponent},//link là localhost:4200/home/details
  { path:'product',component: ProductComponent}
];

@NgModule({
  imports: [CommonModule,RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
