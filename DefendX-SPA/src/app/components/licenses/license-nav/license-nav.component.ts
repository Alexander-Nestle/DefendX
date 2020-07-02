import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-license-nav',
  templateUrl: './license-nav.component.html',
  styleUrls: ['./license-nav.component.css']
})
export class LicenseNavComponent implements OnInit {

  // navLinks = [
  //   {path: '/licenses', label: 'View Licenses'},
  //   {path: '/licenses/search', label: 'Search'}
  // ];

  // TODO add ngrx condition to hide the trail
  constructor() {
  }

  ngOnInit() {
  }

}
