import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ProductModel } from './product.model';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class ProductService {
  productList: AngularFireList<any>;
  selectedProduct: ProductModel = new ProductModel();
  userId: string;

  constructor(private firebase: AngularFireDatabase, private auth: AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  // Getting data from firebase db
  getData() {
    this.productList = this.firebase.list(`products/${this.userId}`);
    return this.productList;
  }

  // Inserting data into firebase db
  insertProduct(product: ProductModel) {
    this.productList.push({
      name: product.name,
      parts: product.parts
    });
  }

  // Updating data in firebase db
  updateProduct(product: ProductModel) {
    this.productList.update(product.$key, {
      name: product.name,
      parts: product.parts
    });
  }

  // Removing an item in firebase db
  removeProduct($key: string) {
    console.log(this.selectedProduct)
    this.productList.remove($key);
  }

}
