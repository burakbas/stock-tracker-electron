import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PartService } from '../common/part.service';
import { NgForm } from '@angular/forms';
import { PartModel } from '../common/part.model';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html'
})
export class PartComponent implements OnInit {
  partList: PartModel[];

  constructor(public partService: PartService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.resetForm();
    setTimeout(() => this.getData(), 500);
  }

  onSubmit(partForm: NgForm) {
    console.log(partForm.value);
    if (partForm.value.$key == null) {
      this.partService.insertPart(partForm.value);
      this.toastr.success('Saved successfully', 'Part added');
    } else {
      this.partService.updatePart(partForm.value);
      this.toastr.success('Saved successfully', 'Part updated');
    }
    this.resetForm(partForm);
  }

  resetForm(partForm?: NgForm) {
    if (partForm != null) {
      partForm.reset();
    }
    this.partService.selectedPart = {
      $key: null,
      name: '',
      stock: undefined,
      critical: undefined
    };
  }

  onUpdate(part: PartModel) {
    this.partService.selectedPart = Object.assign({}, part);
  }

  onRemove(key: string) {
    if (confirm('Are you sure want to remove this part?') === true) {
      this.partService.removePart(key);
      this.toastr.warning('Removed successfully', 'Part removed');
    }
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
  }

}
