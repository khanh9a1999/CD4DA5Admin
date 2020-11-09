import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { TypeComponent } from './type/type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { BrandComponent } from './brand/brand.component';
@NgModule({
  declarations: [ 
    OrderComponent,ProductComponent,TypeComponent, BrandComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FileUploadModule,
    RouterModule.forChild([
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'type',
        component: TypeComponent,
      },
      {
        path: 'brand',
        component: BrandComponent,
      },
  ]),  
  ]
})
export class ProductModule { }
