import { Injector } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { BaseComponent } from 'src/app/lib/base-component';
declare var $: any;
@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent extends BaseComponent implements OnInit {

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
  menus : any;
  ads:any;
  adss:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'noidung': [''],
    });
    this._api.get('/api/theloai/get-category').takeUntil(this.unsubscribe).subscribe(res => {
      this.menus = res;
    }); 
   this.search();
  }
  
  loadPage(page) { 
    this._api.post('/api/ads/search-ads',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.adss = res.data;
      // this.bantins.ngaydang = Date.now();
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/ads/search-ads',{page: this.page, pageSize: this.pageSize, noidung: this.formsearch.get('noidung').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.adss = res.data;
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
          idads:Number.parseInt(value.idads),
          noidung:value.noidung,
          idtheloai:value.idtheloai,    
          };
          console.log(tmp);
        this._api.post('/api/ads/create-ads',tmp).takeUntil(this.unsubscribe).subscribe(res => {
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
           noidung:value.noidung,
           idtheloai:value.idtheloai,   
           idads:this.ads.idads,   
          };
        this._api.post('/api/ads/update-ads',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/ads/delete-ads',{idads:row.idads}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.ads = null;
    this.formdata = this.fb.group({
      'idads':['', Validators.required],
        'noidung':['', Validators.required],
        'idtheloai':['', Validators.required], 
    }, {
      validator: MustMatch('matkhau', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.ads = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'idads':['', Validators.required],
        'idtheloai': ['', Validators.required],
         'noidung':['', Validators.required],
      }, {
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/ads/get-by-id/'+ row.idads).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.ads = res;
          this.formdata = this.fb.group({
            'idads': [this.ads.idads, Validators.required],
            'noidung': [this.ads.noidung, Validators.required],
            'idtheloai': [this.ads.idtheloai],
            
          });
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}