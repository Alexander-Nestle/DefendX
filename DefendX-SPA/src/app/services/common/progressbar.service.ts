import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgressbarService {
  private progress = new BehaviorSubject(0);
  public currentProgress = this.progress.asObservable();

  constructor() { }

    //#region Public Interface Functions

    public updateProgress(progress: number): void {
      this.progress.next(progress);
    }

    public simProgressUpdate(startPer: number, endPer: number = 100 , duration: number): void {
      this.updateProgress(startPer); // resets, if this.progress == 100 observable will not run
      let percentage = startPer;
      const delay = duration / (endPer - startPer);

      const source = timer(0, delay);
      const sub = source.pipe(
        takeWhile(() => percentage <= endPer && this.progress.value !== 100)
      ).subscribe((val) => {
        this.updateProgress(percentage);
        percentage++;
      });
    }

    //#endregion Public Interface Functions

}
