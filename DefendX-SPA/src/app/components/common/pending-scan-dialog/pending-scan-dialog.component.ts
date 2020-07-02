import { Component, OnInit, Inject, HostListener, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { Observable ,  fromEvent ,  Subscription } from 'rxjs';

@Component({
  selector: 'app-pending-scan-dialog',
  templateUrl: './pending-scan-dialog.component.html',
  styleUrls: ['./pending-scan-dialog.component.css']
})
export class PendingScanDialogComponent implements OnInit {
  form: FormGroup;
  formSub: Subscription;
  base32Value: string;
  licensee: {
    dodId: number,
    firstName: string,
    lastName: string,
    middleInitial: string,
    service: string,
    rank: string,
    sponsorDodId: number,
    isDependent: boolean };
  driver: {
    firstName: string,
    lastName: string,
    middleInitial: string,
    weight: number,
    height: number,
    eyeColor: string,
    hairColor: string,
    dateOfBirth: Date,
    expDate: Date,
    gender: string,
    glasses: boolean };
  title: string;
  timerToken: any;
  showSpinner = false;
  isValidCAC = true;
  awaitCacRunning = false;
  inAlt: boolean;
  altString: string;
  altCount: number;
  timer: number;

  constructor(
    private dialogRef: MatDialogRef<PendingScanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.licensee = data.licensee;
    this.driver = data.driver;
    this.timer = data.timer;
    this.inAlt = false;
    this.altString = '';
    this.altCount = 0;
  }


  @HostListener('document: keydown', ['$event']) 
    handleKeyboardEvent(event: KeyboardEvent) {
    //License scan uses ASCII/UNICODE so we capture line breaks done through Alt codes
    if (event.key == 'Shift') return;
    if (event.key == 'Alt') {
      this.inAlt = true;
      return;
    }

    if (this.inAlt)
    {
      this.altString += event.key;
      this.altCount++;
      if (this.altCount == 4)
      {
        if (this.altString == '0010' || this.altString == '0013') 
        {
          this.base32Value += '\n';
        }
        this.inAlt = false;
        this.altString = '';
        this.altCount = 0;
      }
      return;
    }

    if(event.ctrlKey || (event.ctrlKey && (event.which == 74))) {
      event.preventDefault();
      if (event.ctrlKey && (event.which == 74)) {
        this.base32Value += '\n';
      }
      return;
    };

    if (event.keyCode == 13)
      this.validateCac();

    this.base32Value = this.base32Value + event.key;
  };

  ngOnInit() {
    this.base32Value = '';
  }

  validateCac() {
      
      if (this.base32Value.length == 89 || this.base32Value.length == 88) {
        this.licensee.dodId = parseInt(this.base32Value.substring(8, 15).trim(), 32);
        this.licensee.firstName = this.base32Value.substring(15, 35).trim();
        this.licensee.lastName = this.base32Value.substring(35, 61).trim();
        this.licensee.middleInitial = this.base32Value.substring(88, 89).trim();

        this.licensee.service = this.getService(this.base32Value.substring(66, 67));
        this.licensee.rank = this.base32Value.substring(69,75).toUpperCase().trim();

        this.licensee.isDependent = false;
        this.dialogRef.close(this.licensee);
      } else if (this.base32Value.length == 18) {
        if (parseInt(this.base32Value.substring(0,1), 10) >= 4) {
          this.licensee.dodId = parseInt(this.base32Value.substring(1, 8).trim(), 32);
          this.licensee.sponsorDodId = parseInt(this.base32Value.substring(8, 15).trim(), 32);
          this.licensee.isDependent = true;
          this.licensee.service = 'Civilian';
        }

        this.dialogRef.close(this.licensee);
      } else if (this.base32Value.substring(0,1) == '@') {
        let lines = this.base32Value.split('\n');

        lines.forEach(line => {
        line = line.trim();
        if (line.length > 3)
        {
          let prefix = line.substring(0,3).toUpperCase();
          let data = line.substring(3);

          switch (prefix) {
            case "DCS":
              this.driver.lastName = data;
              break;
            case "DCT":
            case "DAC":
              this.driver.firstName = data;
              break;
            case "DAU":
              this.driver.height = parseInt(data.substring(0,3), 10);
              break;
            case "DAW":
              this.driver.weight = parseInt(data.substring(0,3), 10);
              break;
            case "DBC":
              if (data == '1') {
                this.driver.gender = 'Male';
              } else if (data == '2') {
                this.driver.gender = 'Female';
              } else {
                this.driver.gender = '';
              }
              break;
            case "DAY":
              if (data == 'BRN') {
                data = 'BRO';
              }
              this.driver.eyeColor = data;
              break;
            case "DAZ":
              if (data == 'BRN') {
                data = 'BRO';
              }
              this.driver.hairColor = data;
              break;
            case "DBA":
            const expdate = new Date(data.substring(0,2) + '/' + data.substring(2,4) + '/' + data.substring(4));
            expdate.setHours(9);
            this.driver.expDate = expdate;
              break;
            case "DBB":
              //Setting format to YYYYMMDD
              const date = new Date(data.substring(0,2) + '/' + data.substring(2,4) + '/' + data.substring(4));
              date.setHours(9);
              this.driver.dateOfBirth = date;
              break;
            case "DAD":
              this.driver.middleInitial = data.substring(0,1);
              break;
            case "DAS":
              if (data.substring(0,1) == 'A')
                this.driver.glasses = true;
              break;
          }
        }
        this.dialogRef.close(this.driver);
      })} else {
        this.isValidCAC = false;
        this.base32Value = ''; 
      }
  }

  getService(service: string){
    switch (service)
    {
      case 'A': {
        return 'Army';
      }
      case 'C': {
        return 'Coast Guard';
      }
      case 'D': {
        return 'Civilian';
      }
      case 'F': {
        return 'Air Force';
      }
      case 'H': {
        return 'Public Health Services';
      }
      case 'M': {
        return 'USMC';
      }
      case 'N': {
        return 'Navy';
      }
      case '0': {
        return 'National Oceanic and Atmospheric Administration';
      }
      case '1': {
        return 'Foreign Army';
      }
      case '2': {
        return 'Foreign Navy';
      }
      case '3': {
        return 'Foreign Marine Corps';
      }
      case '4': {
        return 'Foreign Air Force';
      }
      case 'X': {
        return 'Other';
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

}
