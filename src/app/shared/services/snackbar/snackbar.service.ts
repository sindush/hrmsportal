import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar) {}

  error(message: string) {
    return this._snackBar.open(message, undefined, {
      duration: 5 * 1000,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      panelClass: ['snackbar-error'],
    });
  }

  success(message: string) {
    return this._snackBar.open(message, undefined, {
      duration: 5 * 1000,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      panelClass: ['snackbar-success'],
    });
  }

  info(message: string) {
    return this._snackBar.open(message, undefined, {
      duration: 5 * 1000,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      panelClass: ['snackbar-info'],
    });
  }
}
