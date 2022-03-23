import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuickSearchHistoryItem} from "../component/list-filter/list-filter.component";

@Component({
  selector: 'lib-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {

  favourites: QuickSearchHistoryItem[];
  form: FormGroup;
  duplicate = false;

  constructor(
    private dialogRef: MatDialogRef<FavouritesComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
     this.favourites = data;
   }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void  {

    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });

  }

  onSave(): void {
    this.dialogRef.close(this.form.value);
  }

  onCancel(): void  {
    this.dialogRef.close();
  }

  checkDuplicate(): void {
    this.duplicate = false;
    if (this.favourites != null && this.favourites.length > 0) {
      for (const fav of this.favourites) {
        if (fav.title.toLowerCase() === this.form.value.name.toLowerCase()) {
          this.duplicate = true;
        }
      }
    }
  }
}
