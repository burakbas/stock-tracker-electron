import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { PartModel } from './part.model';

@Injectable()
export class PartService {
  partList: AngularFireList<any>;
  selectedPart: PartModel = new PartModel();
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
    this.partList = this.firebase.list(`parts/${this.userId}`);
    return this.partList;
  }

  // Inserting data into firebase db
  insertPart(part: PartModel) {
    this.partList.push({
      name: part.name,
      stock: part.stock,
      critical: part.critical
    });
  }

  // Updating data in firebase db
  updatePart(part: PartModel) {
    this.partList.update(part.$key, {
      name: part.name,
      stock: part.stock,
      critical: part.critical
    });
  }

  // Removing an item in firebase db
  removePart($key: string) {
    this.partList.remove($key);
  }

}
