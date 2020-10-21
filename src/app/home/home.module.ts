import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { UserComponent } from './user/user.component';
import { ProductComponent } from './product/product.component';


@NgModule({
    declarations: [
        HomeComponent,
        UserComponent,
        ProductComponent

    ],
    imports: [
      CommonModule,
      HomeRoutingModule,
    ]
  })
  export class HomeModule { }