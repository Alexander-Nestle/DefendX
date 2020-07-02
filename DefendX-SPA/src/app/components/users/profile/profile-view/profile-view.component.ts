import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { currentUser, isAdmin } from 'src/app/ngrx/selectors/auth.selector';
import { takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { MatDialog } from '@angular/material';
import { RequestAccounttypeDialogComponent } from '../request-accounttype-dialog/request-accounttype-dialog.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  @ViewChild('cnv') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  public currentUser: User;
  private destroyed$: Subject<{}> = new Subject();
  public isAdmin: boolean;

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>
  ) { }

  //#region Lifecycle Hook Functions

  ngOnInit() {
    combineLatest(
      this.store.pipe(select(isAdmin)),
      this.store.pipe(select(currentUser)))
    .pipe(takeUntil(this.destroyed$))
    .subscribe(([isAdmin, currentUser]) => {
      this.isAdmin = isAdmin;
      this.currentUser = currentUser;
      // delay needed for template to update and render canvas for admin
      setTimeout(() => {
        if (this.currentUser.signatureData && this.isAdmin) {
          this.displaySigOnCanvas(this.currentUser.signatureData);
        }
      },100);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(); /* Emit a notification on the subject. */
  }

  //#endregion Lifecycle Hook Functions

  public onRequestAccountClick() {
    this.dialog.open(RequestAccounttypeDialogComponent, {
      width: '15%',
      minWidth: 500,
      autoFocus: false,
      disableClose: true
    });
  }

  private displaySigOnCanvas(sigData: string): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    this.context.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);

    let image = new Image();
    image.onload = () => {
      this.context.drawImage(image, 0, 0);
      this.currentUser.signatureData = (<HTMLCanvasElement>this.myCanvas.nativeElement).toDataURL('image/png');
    };
    image.src = sigData;
  }

}
