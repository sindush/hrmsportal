import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GlobalInterceptor } from './global.interceptor';
import { SnackbarService } from './shared/services/snackbar/snackbar.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpResponse } from '@angular/common/http';

describe('GlobalInterceptor', () => {
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['success', 'error', 'info']);


    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: HTTP_INTERCEPTORS, useClass: GlobalInterceptor, multi: true },
        GlobalInterceptor
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    spyOn(window,'alert');
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    const interceptor: GlobalInterceptor = TestBed.inject(GlobalInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should pass the request through normally on a standard 200 response', () => {
    // Act
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    
    // Simulate a successful server response
    req.flush({ data: 'success' }, { status: 200, statusText: 'OK' });

    // Assert
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockSnackbarService.error).not.toHaveBeenCalled();
  });

  it('should trigger window.alert when an HttpResponse has a 401 status in the success stream', () => {
      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');

      req.event(new HttpResponse({body:null, status:401}));

      expect(window.alert).toHaveBeenCalledOnceWith('Unauthorized access!');

      expect(mockSnackbarService.error).not.toHaveBeenCalled();
  });

  it('should call SnackbarService.error when an HttpErrorResponse occurs', () => {
    httpClient.get('/api/test').subscribe({
      error : () => {}
    });

    const req = httpMock.expectOne('/api/test');

    req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error' });

    expect(mockSnackbarService.error).toHaveBeenCalledOnceWith('Internal Server Error');
    expect(window.alert).not.toHaveBeenCalled();
  })
});
