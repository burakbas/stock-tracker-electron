import { Component, OnInit } from '@angular/core';
import { ProductService } from '../common/product.service';
import { PartService } from '../common/part.service';
import { ToastrService } from 'ngx-toastr';
import { PartModel } from '../common/part.model';
import { PartItem, ProductModel } from '../common/product.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../common/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  partList: PartModel[];
  productList: ProductModel[];
  selectedProductIndex: number;
  productAmount: number;

  constructor(public productService: ProductService, public partService: PartService,
              private toastr: ToastrService, public authService: AuthService) {
  }

  ngOnInit() {
    this.resetForm();
    setTimeout(() => this.getData(), 500);
  }

  onSubmit() {
    this.decreaseStock();
    this.resetForm();
  }

  resetForm(homeForm?: NgForm) {
    if (homeForm != null) {
      homeForm.reset();
    }
    this.selectedProductIndex = null;
    this.productAmount = null;
  }

  decreaseStock() {
    const product = this.productList[this.selectedProductIndex];
    console.log(product);

    if (this.checkStock(product) === true) {
      for (const prodPart of product.parts) {
        for (const part of this.partList) {
          if (part.name === prodPart.name) {
            part.stock -= (prodPart.amount * this.productAmount);
            this.partService.updatePart(part);
            this.toastr.success('Saved successfully', 'Stocks updated for ' + part.name);
          }
        }
      }
    }
  }

  checkStock(product: ProductModel): boolean {
    let val = true;
    for (const prodPart of product.parts) {
      for (const part of this.partList) {
        if (part.name === prodPart.name) {
          if (part.stock < (prodPart.amount * this.productAmount)) {
            this.toastr.error('Stock error', 'Not enough stock for ' + part.name);
            val = false;
          }
        }
      }
    }
    return val;
  }

  sortList() {
    this.partList.sort((a, b) => {
      return (a.stock - a.critical) - (b.stock - b.critical);
    });
  }

  getData() {
    const x = this.partService.getData();
    x.snapshotChanges().subscribe(item => {
      this.partList = [];
      item.forEach(elem => {
        const y = elem.payload.toJSON();
        y['$key'] = elem.key;
        this.partList.push(y as PartModel);
        this.sortList();
      });
    });
    const a = this.productService.getData();
    a.snapshotChanges().subscribe(item => {
      this.productList = [];
      item.forEach(elem => {
        const b = elem.payload.toJSON();
        b['$key'] = elem.key;
        const parts: PartItem[] = Object.keys(b['parts']).map(function (_) {
          return b['parts'][_];
        });
        b['parts'] = parts;
        this.productList.push(b as ProductModel);
      });
    });
  }

  search() {
    // Declare variables
    let input, filter, table, tr, td, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    table = document.getElementById('myTable');
    tr = table.getElementsByTagName('tr');

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[0];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }

}
