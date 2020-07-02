import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';
import { Observable, Subject, combineLatest } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { currentUser, isAdmin } from 'src/app/ngrx/selectors/auth.selector';
import { CurrentUserUpdate, Logout } from 'src/app/ngrx/actions/auth.actions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { GenericDialogComponent, DialogTypes } from 'src/app/components/common/generic-dialog/generic-dialog.component';
import { SnackbarService } from 'src/app/services/common/snackbar.service';
import { takeUntil, startWith, map, filter, tap } from 'rxjs/operators';
import { RegexPattern } from 'src/app/models/app/regexPatterns';
import { selectServices, selectUnitByName } from 'src/app/ngrx/selectors/appData.selector';
import { AllServicesRequested, UnitsByNameRequested } from 'src/app/ngrx/actions/appData.actions';
import { Service } from 'src/app/models/mil/service';
import { Rank } from 'src/app/models/mil/rank';
import { Unit } from 'src/app/models/mil/unit';
import { ProgressbarService } from 'src/app/services/common/progressbar.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit, OnDestroy {

  //#region Class Variables

    //#region Public

    @ViewChild('file') file;
    @ViewChild('cnv') myCanvas: ElementRef;
    public context: CanvasRenderingContext2D;
    // TODO remove submit loading 
    public submitLoading: boolean;
    public isAdmin: boolean;
    public form: FormGroup;
    public units$: Observable<Unit[]>;
    public services: Service[];
    public ranks: Rank[];
    public currentUser: User;
    
    //#endregion Public

    //#region Private
    
    private destroyed$: Subject<{}> = new Subject();
    private unitsRequested: boolean; // stops action dispatch in results are [];

    //#endregion Private

  //#endregion Class Variables

  constructor(
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private fb: FormBuilder,
    private userService: UsersService,
    private store: Store<AppState>,
    private router: Router,
    private progressbarService: ProgressbarService
  ) {}

  //#region Lifecycle Hook Functions

  ngOnInit() {
    this.submitLoading = false;
    
    combineLatest(
      this.store.pipe(select(isAdmin)),
      this.store.pipe(select(currentUser)))
    .pipe(takeUntil(this.destroyed$))
    .subscribe(([isAdmin, user])=> {
        this.isAdmin = isAdmin;
        if (user) {
          this.currentUser = user;
          this.form = this.fb.group({
            dodId: [this.currentUser.dodId],
            serviceId: [this.currentUser.serviceId],
            rankId: [this.currentUser.rankId],
            unitId: [this.currentUser.unit, [this.unitConfirming.bind(this)]],
            signatureData: [this.currentUser.signatureData],
            email: [this.currentUser.email, [Validators.maxLength(50), Validators.pattern(RegexPattern.EMAIL)]],
            dsnPhone: [this.currentUser.dsnPhone, [Validators.pattern(RegexPattern.PHONE_NUMBER_ZIP_OPTIONAL)]],
            commPhone: [this.currentUser.commPhone, [Validators.pattern(RegexPattern.PHONE_NUMBER_US_JAP)]]
          });
          // delay needed for template to update and render canvas for admin
          setTimeout(() => {
            if (this.currentUser.signatureData && this.isAdmin) {
              this.displaySigOnCanvas(this.currentUser.signatureData);
            }
          },100);

          this.form.controls['unitId'].valueChanges
          .pipe(
            takeUntil(this.destroyed$),
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
        } else {
          this.store.dispatch(new Logout());
        }

        this.store.pipe(
          takeUntil(this.destroyed$),
          select(selectServices))
        .subscribe(
          (services => {
            if (services.length > 0) {
              this.services = services;
              this.onServiceSelected();
            } else {
              this.store.dispatch(new AllServicesRequested());
            }
          })
        );
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  //#endregion Lifecycle Hook Functions

  //#region Public Interface Functions

    //#region Form Event Functions

    public onUploadSigBtnClick(): void {
      this.file.nativeElement.click();
    }

    public onSigFileSelected(event: any): void {
      const reader = new FileReader();
      const file: File = this.file.nativeElement.files[0];

      if (file == null || !file.name.toLowerCase().endsWith('.sig')) {
        this.dialog.open(GenericDialogComponent, {
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

    public onSubmit() {
      if (!this.isFormValid()) { return; }

      this.submitLoading = true;

      if (this.form.get('unitId').value && (<Unit>this.form.get('unitId').value).id) {
        this.form.patchValue({
          unitId: this.form.get('unitId').value.id
        });
      }

      this.progressbarService.simProgressUpdate(0, 95, 3000);
      this.userService
        .updateUser(this.form.value)
        .subscribe(
          (user) => {
            this.progressbarService.updateProgress(100);
            this.submitLoading = false;
            this.store.dispatch(new CurrentUserUpdate({user}));
            this.snackbarService.displaySuccessFeedback('Save Successful');
            this.router.navigate(['/users/profile']);
          }, (error) => {
            this.progressbarService.updateProgress(100);
            this.submitLoading = false;
            this.snackbarService.displayErrorFeedback(error);
            this.form.patchValue({unitId : this.currentUser.unit});
          }
        );
    }

    public onDisplayUnit(unit?: Unit): string | undefined {
      return unit ? unit.name : undefined;
    }

    //#endregion Form Event Functions

  //#endregion Public Interface Functions

  //#region Private Implementation Functions

  private onServiceSelected(): void {
    // if service already selected on initial load
    if (this.form.get('serviceId').value) {
      const service = this.services.find(s => s.id === this.form.get('serviceId').value);
      if (service) { this.ranks = service.ranks; }
    }

    this.form.get('serviceId').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(val => {
      const service = this.services.find(s => s.id === val);
      if (service) { this.ranks = service.ranks; }
    });
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

  private isFormValid(): boolean {
    if (!this.form.valid) {
      this.dialog.open(GenericDialogComponent, {
        width: '25%',
        data: {
          title: 'Invalid Values',
          message: 'Please ensure all mandatory fields have values and all provided values are valid',
          type: DialogTypes.Message
        }
      });
      return false;
    }
    return true;
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

  private unitConfirming(c: FormControl): { [s: string]: boolean } {
    const unit = c.value;
    if ((unit !== '') && (unit != null) && !(<Unit>unit).id) {
      return { invalid: true };
    }
    return null;
  }

  //#endregion Private Implementation Functions
}
