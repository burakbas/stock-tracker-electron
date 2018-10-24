import { Component, OnInit } from '@angular/core';
import { PartModel } from '../common/part.model';
import { PartService } from '../common/part.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ProductService } from '../common/product.service';
import { PartItem, ProductModel } from '../common/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  partList: PartModel[];
  productList: ProductModel[];
  partToAdd: string;
  amountToAdd: number;

  constructor(public productService: ProductService, public partService: PartService, private toastr: ToastrService) {
    this.partToAdd = null;
  }

  ngOnInit() {
    this.resetForm();
    setTimeout(() => this.getData(), 500);
  }

  addPart() {
    this.productService.selectedProduct.parts.push(new PartItem(this.partToAdd, this.amountToAdd));
    this.amountToAdd = null;
    this.partToAdd = null;
  }

  onSubmit(productForm: NgForm) {
    if (productForm.value.$key == null) {
      this.productService.insertProduct(this.productService.selectedProduct);
      this.toastr.success('Saved successfully', 'Product added');
    } else {
      this.productService.updateProduct(this.productService.selectedProduct);
      this.toastr.success('Saved successfully', 'Product updated');
    }
    this.resetForm(productForm);
  }

  resetForm(productForm?: NgForm) {
    if (productForm != null) {
      productForm.reset();
    }
    this.productService.selectedProduct = {
      $key: null,
      name: '',
      parts: []
    };
  }

  onUpdate(product: ProductModel) {
    this.productService.selectedProduct = Object.assign({}, product);
  }

  onRemove(key: string) {
    if (confirm('Are you sure want to remove this product?') === true) {
      this.productService.removeProduct(key);
      this.toastr.warning('Removed successfully', 'Product removed');
    }
  }

  removePart(index: number) {
    this.productService.selectedProduct.parts.splice(index, 1);
  }

  getData() {
    const x = this.partService.getData();
    x.snapshotChanges().subscribe(item => {
      this.partList = [];
      item.forEach(elem => {
        const y = elem.payload.toJSON();
        y['$key'] = elem.key;
        this.partList.push(y as PartModel);
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
    this.productService.selectedProduct.parts = [];
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
