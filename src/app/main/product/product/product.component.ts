import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseComponent implements OnInit {
  public products: any;
  public product: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
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
      'TenSP': [''],
      'DonGia': [''],     
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/sanpham/search-product',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/sanpham/search-product',{page: this.page, pageSize: this.pageSize, TenSP: this.formsearch.get('TenSP').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }



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
          Anh:data_image,
          TenSP:value.TenSP,
          XuatXu:value.XuatXu,
          MoTa:value.MoTa,
          DonGia:value.DonGia,
          SoLuong:value.SoLuong,
          MaLoai:value.MaLoai,
           MaThuongHieu:value.MaThuongHieu 
          };
        this._api.post('/api/sanpham/create-product',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           Anh:data_image,
           TenSP:value.TenSP,
           XuatXu:value.XuatXu,
           MoTa:value.MoTa,
           DonGia:value.DonGia,
           SoLuong:value.SoLuong,
           MaLoai:value.MaLoai,
            MaThuongHieu:value.MaThuongHieu     ,
            MaSP:this.product.MaSP,     
          };
        this._api.post('/api/sanpham/update-product',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/sanpham/delete-product',{MaSP:row.maSP}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.product = null;
    this.formdata = this.fb.group({
      'TenSP': ['', Validators.required],
        'XuatXu': ['', Validators.required],
        'MoTa': ['', Validators.required],
        'DonGia': ['', Validators.required],
        'SoLuong':['', Validators.required],
        'MaLoai': ['', Validators.required],
        'MaThuongHieu': ['', Validators.required],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.product = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'TenSP': ['', Validators.required],
        'XuatXu': ['', Validators.required],
        'MoTa': ['', Validators.required],
        'DonGia': ['', Validators.required],
        'SoLuong':['', Validators.required],
        'MaLoai': ['', Validators.required],
        'MaThuongHieu': ['', Validators.required],
      });
      
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/sanpham/sp-get-by-id/'+ row.MaSP).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.product = res; 
          this.formdata = this.fb.group({
            'TenSP': ['', Validators.required],
        'XuatXu': ['', Validators.required],
        'MoTa': ['', Validators.required],
        'DonGia': ['', Validators.required],
        'SoLuong':['', Validators.required],
        'MaLoai': ['', Validators.required],
        'MaThuongHieu': ['', Validators.required],

          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}