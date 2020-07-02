import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

constructor(
    public snackBar: MatSnackBar,
) { }

    //#region Public Interface Functions

    public displaySuccessFeedback(
        message: string,
        buttonmessage: string = null,
        callback: (x: any) => any = null,
        data: any = null
    ): MatSnackBarRef<SimpleSnackBar> {
        const config = new MatSnackBarConfig();
        config.panelClass = ['snackbar-success', 'button'];
        config.duration = 5000;

        if (!callback) {
            return this.openSnackBar(message, buttonmessage, config);
        } else {
            const sub = this.openSnackBar(message, buttonmessage, config).onAction().subscribe(() => callback(data));

            setTimeout(() => sub.unsubscribe(), 5000);
        }
    }

    public  displayErrorFeedback(error: string): void {
        console.log(error);
        const config = new MatSnackBarConfig();
        config.panelClass = ['snackbar-error', 'button'];
        config.duration = 3000;

        this.openSnackBar(error, null, config);
    }

    //#endregion Public Interface Functions

    //#region Private Implementation Functions

    private openSnackBar(message: string, action: string = null, config: MatSnackBarConfig = null): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, action || null, config);
    }

    //#endregion Private Implementation Functions
}
