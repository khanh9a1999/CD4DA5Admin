import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;
@Component({
  selector: 'app-bangtin',
  templateUrl: './bangtin.component.html',
  styleUrls: ['./bangtin.component.css']
})
export class BangTinComponent extends BaseComponent implements OnInit {
  public Editor = ClassicEditor;
  // public onReady( editor ) {
  //       editor.ui.getEditableElement().parentElement.insertBefore(
  //           editor.ui.view.toolbar.element,
  //           editor.ui.getEditableElement()
  //       );
  //   }
  menus:any;
  menus1:any;
  public bantins: any;
  public bantin: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public abc: any;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tieude': [''],
    });
    this._api.get('/api/theloai/get-category').takeUntil(this.unsubscribe).subscribe(res => {
      this.menus = res;
    }); 
   this.search();
  }
  
  loadPage(page) { 
    this._api.post('/api/bangtin/search-bantin',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.bantins = res.data;
      // this.bantins.ngaydang = Date.now();
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/bangtin/search-bantin',{page: this.page, pageSize: this.pageSize, tieude: this.formsearch.get('tieude').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.bantins = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  // pwdCheckValidator(control){
  //   var filteredStrings = {search:control.value, select:'@#!$%&*'}
  //   var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
  //   if(control.value.length < 6 || !result){
  //       return {matkhau: true};
  //   }
  // }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          anh:data_image,
          idbantin:Number.parseInt(value.idbantin),
          tieude:value.tieude,
          noidung:value.noidung,
          idtheloai:value.idtheloai,
          ngaydang: value.ngaydang,
          // lanxem:Number.parseInt(value.lanxem),       
          };
          console.log(tmp);
        this._api.post('/api/bangtin/create-bantin',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           anh:data_image,
           tieude:value.tieude,
           noidung:value.noidung,
           idtheloai:value.idtheloai,
           ngaydang:value.ngaydang,
          //  lanxem:value.lanxem,      
           idbantin:this.bantin.idbantin,   
          };
        this._api.post('/api/bangtin/update-bantin',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/bangtin/delete-bantin',{idbantin:row.idbantin}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.bantin = null;
    this.formdata = this.fb.group({
      'idbantin':['', Validators.required],
      'tieude':['', Validators.required],
        'noidung':['', Validators.required],
        'idtheloai':['', Validators.required],
        'ngaydang':[this.today, Validators.required],
        'lanxem':['', Validators.required],  
    }, {
      validator: MustMatch('matkhau', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.bantin = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'idbantin':['', Validators.required],
        'tieude':['', Validators.required],
        'idtheloai': ['', Validators.required],
         'noidung':['', Validators.required],
        'ngaydang':[''],
        // 'lanxem':['', Validators.required],  
      }, {
      });
      this.formdata.get('ngaydang').setValue(this.today);
      // this.formdata.get('gioitinh').setValue(this.genders[0].value); 
      // this.formdata.get('role').setValue(this.roles[0].value);
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/bangtin/get-by-id/'+ row.idbantin).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.bantin = res;
        let ngaydang = new Date(this.bantin.ngaydang);
          this.formdata = this.fb.group({
            'idbantin': [this.bantin.idbantin, Validators.required],
            'tieude': [this.bantin.tieude, Validators.required],
            'noidung': [this.bantin.noidung, Validators.required],
            'idtheloai': [this.bantin.idtheloai],
            'ngaydang': [ngaydang],
            
          });
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}