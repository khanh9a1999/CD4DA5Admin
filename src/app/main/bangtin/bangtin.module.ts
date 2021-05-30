import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BangTinComponent } from './bangtin/bangtin.component';
import { TypeComponent } from './type/type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { AdsComponent } from './ads/ads.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
@NgModule({
  declarations: [ 
    BangTinComponent,TypeComponent, AdsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FileUploadModule,
    CKEditorModule,
    RouterModule.forChild([
      {
        path: 'bangtin',
        component: BangTinComponent,
      },
      {
        path: 'type',
        component: TypeComponent,
      },
      {
        path: 'ads',
        component: AdsComponent,
      },
      
  ]),  
  ]
})
export class BangTinModule { }
