import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.css']
})
export class AccountSearchComponent implements OnInit {

  form: FormGroup;
  search: string;

  constructor(
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      search: [null]
    });
  }

  ngOnInit() {}

  onSearch() {
    this.search = this.form.get('search').value;
  }

}
