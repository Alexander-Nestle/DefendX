import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { AllServicesRequested, UnitsByNameRequested } from '../../../ngrx/actions/appData.actions';
import { Observable, Subscription } from 'rxjs';
import { Service } from '../../../models/mil/service';
import { selectServices, selectUnitByName } from '../../../ngrx/selectors/appData.selector';
import { tap, map, startWith, filter } from 'rxjs/operators';
import { Rank } from 'src/app/models/mil/rank';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Unit } from 'src/app/models/mil/unit';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GenericDialogComponent, DialogTypes } from 'src/app/components/common/generic-dialog/generic-dialog.component';
import { LicenseService } from 'src/app/services/licenses/license.service';
import { LicenseAdded, LicenseUpdated, LicensePrintQueueEntryAdded } from 'src/app/ngrx/actions/license.actions';
import { License } from 'src/app/models/license/license';
import { Update } from '@ngrx/entity';
import { SnackbarService } from 'src/app/services/common/snackbar.service';
import { currentUser } from 'src/app/ngrx/selectors/auth.selector';
import { ProgressbarService } from 'src/app/services/common/progressbar.service';
import { PendingScanDialogComponent } from '../../common/pending-scan-dialog/pending-scan-dialog.component';
import { User } from 'src/app/models/user/user';
import { ACCOUNT_TYPES } from 'src/app/models/user/accountType';
import { DodId } from 'src/app/models/mil/dod';

export interface Gender {
  value: string;
}

export interface Color {
  displayValue: string;
  abbreviation: string;
}

// TODO Delete
// declare function SetDisplayXSize(v): any;
// declare function SetDisplayYSize(v): any;
// declare function SetTabletState(v, ctx, tv): any;
// declare function SetJustifyMode(v): any;
// declare function ClearTablet(): any;

@Component({
  selector: 'app-license-addEdit',
  templateUrl: './license-addEdit.component.html',
  styleUrls: ['./license-addEdit.component.css']
})
export class LicenseAddEditComponent implements OnInit, OnDestroy {

  //#region Class Variables

    //#region Public

    @ViewChild('file') file;
    @ViewChild('cnv') myCanvas: ElementRef;
    public context: CanvasRenderingContext2D;
    public isDependent: boolean;
    public submitLoading: boolean;
    public hasPermitNumber: boolean;
    public isAdmin: boolean;
    public isBasicUser: boolean;

    public license: License;
    public services: Service[];
    public selectedService: Service;
    public ranks: Rank[];
    public selectedRank: Rank;
    public units$: Observable<Unit[]>;

    public form: FormGroup;
    public readonly genders: Gender[] = [
      { value: 'Male' },
      { value: 'Female' }
    ];

    public readonly hairColors: Color[] = [
      { displayValue: 'Bald', abbreviation: 'BAL' },
      { displayValue: 'Black', abbreviation: 'BLK' },
      { displayValue: 'Blond', abbreviation: 'BLN' },
      { displayValue: 'Blue', abbreviation: 'BLU' },
      { displayValue: 'Brown', abbreviation: 'BRO' },
      { displayValue: 'Gray', abbreviation: 'GRY' },
      { displayValue: 'Green', abbreviation: 'GRN' },
      { displayValue: 'Orange', abbreviation: 'ONG' },
      { displayValue: 'Pink', abbreviation: 'PNK' },
      { displayValue: 'Purple', abbreviation: 'PLE' },
      { displayValue: 'Red', abbreviation: 'RED' },
      { displayValue: 'Sandy', abbreviation: 'SDY' },
      { displayValue: 'Unknown', abbreviation: 'XXX' },
      { displayValue: 'White', abbreviation: 'WHI' }
    ];

    public readonly eyeColors: Color[] = [
      { displayValue: 'Black', abbreviation: 'BLK' },
      { displayValue: 'Blue', abbreviation: 'BLU' },
      { displayValue: 'Brown', abbreviation: 'BRO' },
      { displayValue: 'Gray', abbreviation: 'GRY' },
      { displayValue: 'Green', abbreviation: 'GRN' },
      { displayValue: 'Hazel', abbreviation: 'HAZ' },
      { displayValue: 'Maroon', abbreviation: 'MUL' },
      { displayValue: 'Multicolored', abbreviation: 'MUL' },
      { displayValue: 'Pink', abbreviation: 'PNK' },
      { displayValue: 'Unknown', abbreviation: 'XXX' }
    ];

    public readonly minDobDate = new Date(1900, 0, 1);
    public readonly maxDobDate = new Date(new Date().setDate(new Date().getDate() - (365 * 10)));
    public readonly minExpDate = new Date();
    public readonly maxExpDate = new Date(new Date().setDate(new Date().getDate() + (365 * 50)));
    public readonly DodId = DodId;

    //#endregion Public

    //#region Private

    private snackbarSub: Subscription;
    private subCurrentUser: Subscription;
    public servicesSub: Subscription;
    public formChangeSub: Subscription;
    
    private unitsRequested: boolean; // stops action dispatch in results are [];

    private permitNumberPattern = '1-+.*[0-9]';
    private currentUser: User;
    private addToPrintQueueCallBack: (x: any) => any;

    //#endregion Private

  //#endregion Class Variables

  constructor(
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private progressbarService: ProgressbarService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private licenseService: LicenseService
  ) {
    this.form = fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleInitial: [''],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      height: ['', [Validators.required, Validators.max(999), Validators.min(1)]],
      weight: ['', [Validators.required, Validators.max(999), Validators.min(1)]],
      hairColor: ['', [Validators.required, this.hairColorConfirm.bind(this)]],
      eyeColor: ['', [Validators.required, this.eyeColorConfirm.bind(this)]],
      dodId: ['', [Validators.required, Validators.max(DodId.MAX), Validators.min(DodId.MIN)]],
      serviceId: [''],
      rankId: [''],
      unitId: ['', [Validators.required, this.unitConfirming.bind(this)]],
      sponsorDodId: [null, [this.sponsorDodIdConfirm.bind(this)]],
      permitNumber: [null, [this.permitNumberConfirm.bind(this)]],
      autoJeep: [false],
      motorCycle: [false],
      motor: [false],
      glasses: [false],
      tdy: [false],
      onBaseOnly: [false],
      dateExpired: ['', [Validators.required]],
      signatureData: [''],
      isAuthenticated: [false],
      remarks: [null, [Validators.max(30)]]
    });

    this.addToPrintQueueCallBack = (license) => {
      if (license.signatureData == null || license.signatureData === '') {
        this.dialog.open(GenericDialogComponent, {
          width: '18%',
          data: { title: 'Missing Signature', message: 'License signature is required prior to printing', type: DialogTypes.Message }
        });
        return;
      }

      this.licenseService
        .addToPrintQueue(license.id).subscribe(
          () => {
            this.store.dispatch(new LicensePrintQueueEntryAdded({ id: license.id }));
            this.snackbarService.displaySuccessFeedback('Successfully Added to Queue');
          }, error => {
            this.snackbarService.displayErrorFeedback(error);
          }
        );
    };
  }

  //#region Lifecycle Hook Functions

  ngOnInit() {
    this.hasPermitNumber = false;
    this.isDependent = false;
    this.submitLoading = false;
    // TODO should not query backend every load
    this.store.dispatch(new AllServicesRequested());
    this.servicesSub = this.store.pipe(select(selectServices))
        .subscribe(
          (services => {
            this.services = services;
            this.onServiceSelected();
          })
        );

    this.formChangeSub = this.form.controls['unitId'].valueChanges
      .pipe(
        startWith<string | Unit>(''),
        map(value => {
          if (value == null) {
            return 'undefined';
          }
          return typeof value === 'string' ? value : value.name;
        }),
        filter(value => typeof value !== 'undefined'),
        map(value => {
          if (typeof value !== null) {
            this.unitsRequested = false;
            this.loadUnits(value);
          }
        })
      ).subscribe();

    this.license = this.route.snapshot.data['license'];
    if (this.license) {
      this.mapLicenseToForm(this.license);
    }
    this.setCurrentUser();
  }

  ngOnDestroy() {
    this.subCurrentUser.unsubscribe();
    this.servicesSub.unsubscribe();
    this.formChangeSub.unsubscribe();
    if (this.snackbarSub) {
      this.snackbarSub.unsubscribe();
    }
  }

  //#endregion Lifecycle Hook Functions

  //#region Public Interface Functions

    //#region Form Event Functions

    public onDisplayUnit(unit?: Unit): string | undefined {
      return unit ? unit.name : undefined;
    }

    public onUploadSigBtnClick(): void {
      this.file.nativeElement.click();
    }
  
    public onSigFileSelected(event: any): void {
      const reader = new FileReader();
      const file: File = this.file.nativeElement.files[0];
  
      if (file == null || !file.name.toLowerCase().endsWith('.sig')) {
        const dialogRef = this.dialog.open(GenericDialogComponent, {
          width: '25%',
          data: { title: 'Invalid File Type', message: 'Please select a .SIG file', type: DialogTypes.Message }
        });
        return;
      }
  
      reader.onload = (e) => {
        this.displaySigOnCanvas(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }

    public onSubmit(): void {
      if (!this.isFormValid()) {
        return;
      }

      if (!this.hasPermitNumber) {
        this.form.patchValue({
          permitNumber: null
        });
      }

      if (!this.isDependent) {
        this.form.patchValue({
          sponsorDodId: null
        });
      }
  
      this.progressbarService.simProgressUpdate(0, 95, 1000);
      this.submitLoading = true;
      if (this.license) {
        if (!this.isDependent) {
          this.license.sponsorDodId = null;
        }
        // Update License
        this.mapFormToLicense(this.license);
        this.licenseService
          .updateLicense(this.license)
          .subscribe(
            (license) => {
              if (license !== null && (<License>license).id) {
                const changes = license as License;
  
                const updatedLicense: Update<License> = {
                  id: this.license.id,
                  changes
                };
                this.store.dispatch(new LicenseUpdated({ license: updatedLicense }));
                if (this.isAdmin) {
                  this.snackbarService.displaySuccessFeedback(
                    'Save Successful', 'Click to Add to print queue', this.addToPrintQueueCallBack, license);
                } else {
                  this.snackbarService.displaySuccessFeedback('Save Successful');
                }
                this.progressbarService.updateProgress(100);
                this.submitLoading = false;
                this.router.navigateByUrl('/licenses');
              }
            }, error => {
              this.snackbarService.displayErrorFeedback(error);
              this.progressbarService.updateProgress(100);
              this.submitLoading = false;
            }
          );
      } else {
        // Save New License
        this.licenseService
          .saveLicense(this.form.value)
          .subscribe(
            (license) => {
              if (license !== null && (<License>license).id) {
                const newLicense = license as License;
  
                this.store.dispatch(new LicenseAdded({ license: newLicense }));
                if (this.isAdmin) {
                  this.snackbarService.displaySuccessFeedback(
                    'Save Successful', 'Click to Add to print queue', this.addToPrintQueueCallBack, newLicense
                  );
                } else {
                  this.snackbarService.displaySuccessFeedback('Save Successful');
                }
                this.progressbarService.updateProgress(100);
                this.submitLoading = false;
                this.router.navigateByUrl('/licenses');
              }
            }, error => {
              this.snackbarService.displayErrorFeedback(error);
              this.progressbarService.updateProgress(100);
              this.submitLoading = false;

            }
          );
      }
    }

    public onCancel(): void {
      this.router.navigateByUrl('/licenses');
    }

    //#endregion Form Event Functions

  //#endregion Public Interface Functions

  //#region Private Implementation Functions

    //#region Form Data Functions

    private onServiceSelected(): void {
    // if service already selected on initial load
    if (this.form.get('serviceId').value) {
      const service = this.services.find(s => s.id === this.form.get('serviceId').value);
      if (service) { this.ranks = service.ranks; }
    }

      this.form.get('serviceId').valueChanges.subscribe(val => {
        const service = this.services.find(s => s.id === val);
        if (service) { this.ranks = service.ranks; }
      });
    }

    private setCurrentUser() {
      this.subCurrentUser = this.store
      .pipe(select(currentUser))
      .subscribe(user => {
        this.currentUser = user;
        if (user.account.accountTypeId !== ACCOUNT_TYPES.Administrator) {
          this.isAdmin = false;
          if (user.account.accountTypeId === ACCOUNT_TYPES.User) {
            this.isBasicUser = true;
          }
          if (!this.license) {
            this.form.patchValue({unitId: user.unit});
          }
        } else {
          this.isAdmin = true;
        }
      });
    }

    private loadUnits(name: string): void {
      this.units$ = this.store
        .pipe(
          select(selectUnitByName(name)),
          tap(units => {
            if (units.length === 0 && !this.unitsRequested && name.length >= 2) {
              this.unitsRequested = true;
              this.store.dispatch(new UnitsByNameRequested({ name }));
            }
          })
        );
    }

    private displaySigOnCanvas(sigData: string): void {
      this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
      this.context.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
  
      let image = new Image();
      image.onload = () => {
        this.context.drawImage(image, 0, 0);
        this.form.patchValue({ signatureData: (<HTMLCanvasElement>this.myCanvas.nativeElement).toDataURL('image/png') });
      };
      image.src = sigData;
    }

    //#endregion For Data Functions

    //#region Form Mapping Functions

    private mapLicenseToForm(newLicense: License): void {
      this.form.patchValue({
        firstName: newLicense.firstName,
        middleInitial: newLicense.middleInitial,
        lastName: newLicense.lastName,
        gender: newLicense.gender,
        dob: newLicense.dob,
        height: newLicense.height,
        weight: newLicense.weight,
        hairColor: newLicense.hairColor,
        eyeColor: newLicense.eyeColor,
        dodId: newLicense.dodId,
        serviceId: newLicense.serviceId,
        rankId: newLicense.rankId,
        unitId: newLicense.unit,
        dateExpired: newLicense.dateExpired,
        autoJeep: newLicense.autoJeep,
        motorCycle: newLicense.motorCycle,
        motor: newLicense.motor,
        other: newLicense.other,
        glasses: newLicense.glasses,
        tdy: newLicense.tdy,
        onBaseOnly: newLicense.onBaseOnly,
        isAuthenticated: newLicense.isAuthenticated,
        remarks: newLicense.remarks
      });

      if (newLicense.sponsor && newLicense.sponsor.dodId) {
        this.form.patchValue({ sponsorDodId: newLicense.sponsor.dodId });
        this.isDependent = true;
      }

      this.displaySigOnCanvas(newLicense.signatureData);
    }

    private mapFormToLicense(license: License): void {
      license.firstName = this.form.get('firstName').value;
      license.middleInitial = this.form.get('middleInitial').value;
      license.lastName = this.form.get('lastName').value;
      license.gender = this.form.get('gender').value;
      license.dob = this.form.get('dob').value;
      license.height = this.form.get('height').value;
      license.weight = this.form.get('weight').value;
      license.hairColor = this.form.get('hairColor').value;
      license.eyeColor = this.form.get('eyeColor').value;
      license.dodId = this.form.get('dodId').value;
      license.serviceId = this.form.get('serviceId').value;
      license.rankId = this.form.get('rankId').value;
      license.unitId = this.form.value['unitId'];
      license.sponsorDodId = this.form.get('sponsorDodId').value;
      license.autoJeep = this.form.get('autoJeep').value;
      license.motorCycle = this.form.get('motorCycle').value;
      license.motor = this.form.get('motor').value;
      license.glasses = this.form.get('glasses').value;
      license.tdy = this.form.get('tdy').value;
      license.onBaseOnly = this.form.get('onBaseOnly').value;
      license.dateExpired = this.form.get('dateExpired').value;
      license.signatureData = this.form.get('signatureData').value;
      license.isAuthenticated = this.form.get('isAuthenticated').value;
      license.remarks = this.form.get('remarks').value;
    }

    //#endregion Form Mapping Functions

    //#region Form Validation Functions

    private hairColorConfirm(c: AbstractControl): { [s: string]: boolean } {
      const color = c.value;
      if (this.hairColors.find(h => h.displayValue === color || h.abbreviation === color)) {
        return null;
      }
      return { invalid: true };
    }

    private eyeColorConfirm(c: AbstractControl): { [s: string]: boolean } {
      const color = c.value;
      if (this.eyeColors.find(h => h.displayValue === color || h.abbreviation === color)) {
        return null;
      }
      return { invalid: true };
    }

    private unitConfirming(c: FormControl): { [s: string]: boolean } {
      const unit = c.value;
      if ((unit !== '') && (unit != null) && !(<Unit>unit).id) {
        return { invalid: true };
      }
      return null;
    }

    private permitNumberConfirm(c: AbstractControl):  { [s: string]: boolean } {
      const value = c.value;
      if (this.hasPermitNumber == false || ( value != null && value.match(this.permitNumberPattern))) {
        return null;
      }
      return { invalid: true };
    }

    private sponsorDodIdConfirm(c: AbstractControl): { [s: string]: boolean } {
      const value = c.value;
      if ((value <= DodId.MAX && value >= DodId.MIN) || value === null || this.isDependent === false) {
        return null;
      }
      return { invalid: true };
    }

    private isFormValid(): boolean {
      if (!this.form.valid) {
        this.dialog.open(GenericDialogComponent, {
          width: '25%',
          data: { title: 'Invalid Values', message: 'Please ensure all mandatory fields have values and all provided values are valid', type: DialogTypes.Message }
        });
        return false;
      }

      if ((<Unit>this.form.get('unitId').value).id) {
        this.form.patchValue({
          unitId: this.form.get('unitId').value.id
        });
      } else {
        this.dialog.open(GenericDialogComponent, {
          width: '25%',
          data: { title: 'Invalid Unit', message: 'Please enter a valid unit', type: DialogTypes.Message }
        });
        return false;
      }

      if (this.currentUser.account.accountTypeId === ACCOUNT_TYPES.Css &&
          this.currentUser.unit.id !== this.form.get('unitId').value) {
            console.log(this.form.value);
            this.dialog.open(GenericDialogComponent, {
              width: '25%',
              data: { title: 'Invalid Unit', message: 'License must be from same unit as user', type: DialogTypes.Message }
            });
            return false;
      }
  
      if (
        this.form.get('autoJeep').value === false &&
        this.form.get('motorCycle').value === false &&
        this.form.get('motor').value === false
      ) {
        this.dialog.open(GenericDialogComponent, {
          width: '25%',
          data: { title: 'Missing Values', message: 'Please select at least one license type', type: DialogTypes.Message }
        });
        return false;
      }
  
      if (this.form.get('isAuthenticated').value && !this.form.get('signatureData').value) {
        this.dialog.open(GenericDialogComponent, {
          width: '25%',
          data: { title: 'Missing Values', message: 'License must have signature to be authenticated', type: DialogTypes.Message }
        });
        return false;
      }
  
      return true;
    }

    // TODO cleanup dialog scan code
    pendingScan() {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
  
      dialogConfig.data = {
        title: 'Awaiting ID Scan',
        timer: 1500,
        licensee: {
          dodId: null,
          firstName: '',
          lastName: '',
          middleInitial: '',
          service: '',
          rank: '',
          isDependent: false,
          sponsorDodId: null
        } 
      };
  
      const dialogRef = this.dialog.open(PendingScanDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data != null) {
        
          this.form.controls['dodId'].patchValue(data.dodId);

          if (data.firstName != '')
            this.form.controls['firstName'].patchValue(data.firstName);
          
          if (data.lastName != '')
            this.form.controls['lastName'].patchValue(data.lastName);
          
          if (data.middleInitial != '')
            this.form.controls['middleInitial'].patchValue(data.middleInitial);

          let serviceList = this.services.filter(s => s.name == data.service);
          this.selectedService = serviceList[0];
          
          if (this.selectedService != null) {
            this.form.controls['serviceId'].patchValue(this.selectedService.id);
            let rankList = this.selectedService.ranks.filter(r => r.name.toUpperCase() == data.rank.toUpperCase());
            this.selectedRank = rankList[0];
            if (this.selectedRank != null) 
              this.form.controls['rankId'].patchValue(this.selectedRank.id);
          } else {
            this.form.controls['serviceId'].patchValue(null);
          }

          this.isDependent = data.isDependent;
          this.form.controls['sponsorDodId'].patchValue(data.sponsorDodId);
          }
      });

    //#endregion Form Validation Functions
    }

    pendingDLScan() {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
  
      dialogConfig.data = {
        title: 'Awaiting License Scan',
        timer: 5000,
        driver: {
          firstName: '',
          lastName: '',
          middleInitial: '',
          weight: null,
          height: null,
          eyeColor: null,
          hairColor: null,
          dateOfBirth: '',
          expDate: '',
          gender: '',
          glasses: false
        } 
      };
  
      const dialogRef = this.dialog.open(PendingScanDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data != null) {
          if (data.firstName != '')
              this.form.controls['firstName'].patchValue(data.firstName);
            
            if (data.lastName != '')
              this.form.controls['lastName'].patchValue(data.lastName);
            
            if (data.middleInitial != '')
              this.form.controls['middleInitial'].patchValue(data.middleInitial);

          this.form.patchValue({
            gender: data.gender,
            dob: data.dateOfBirth,
            height: data.height,
            weight: data.weight,
            hairColor: data.hairColor,
            eyeColor: data.eyeColor,
            dateExpired: data.expDate,
            glasses: data.glasses
          });
        }
      });

    }
  //#endregion Private Implementation Functions
}
