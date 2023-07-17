import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SnackbarService } from './shared/services/snackbar/snackbar.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
 
  constructor(private snackBarService: SnackbarService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            if(event.status == 401) {
              alert('Unauthorized access!')
            }
          }
          return event;
        },
        error: (error) => {
          this.snackBarService.error(error.statusText)
        }
      }));
  }
}
