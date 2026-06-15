import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedtableComponent } from './sharedtable.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/apiendpoint/api.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { ExcelService } from '../../services/excell/excel.service';
import { UtilityService } from '../../services/utility/utility.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { of, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

let mockEmployeeData = [{
  "first_name": "darshan",
  "last_name": "velagaleti",
  "gender": "male",
  "dob": "1992-06-24T18:30:00.000Z",
  "address": "14 Taylor St",
  "city": "Vijayawada",
  "county": "India",
  "postal": "520004",
  "phone1": "1234567890",
  "phone2": "01944-369967",
  "email": "123123@hotmail.com",
  "web": "asdasdsad",
  "workingfrom": "home",
  "id": "32123"
},]

fdescribe('SharedtableComponent', () => {
  let component: SharedtableComponent;
  let fixture: ComponentFixture<SharedtableComponent>;

  let mockExcellService: jasmine.SpyObj<ExcelService>;
  let mockDialog: any;
  let mockApiService: jasmine.SpyObj<ApiService>
  // let mockUtilityService: jasmine.SpyObj<UtilityService>;
  let mockUtilityService: any;
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSpinnerService: jasmine.SpyObj<SpinnerService>;

  let dialogStatusSubject: Subject<boolean>

  beforeEach(async () => {
    dialogStatusSubject = new Subject<boolean>();

    mockExcellService = jasmine.createSpyObj('ExcelService', ['exportAsExcelFile']);
    // mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockApiService = jasmine.createSpyObj('ApiService', ['getEmployeeData']);
    mockApiService.getEmployeeData.and.returnValue(of([]));

    // mockUtilityService = jasmine.createSpyObj('UtilityService', ['getName'], {
    //   getDialogStatus: new Subject<boolean>()
    // });
    mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['success', 'error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSpinnerService = jasmine.createSpyObj('SpinnerService', ['setLoading']);

    // mockUtilityService.getDialogStatus = new Subject<boolean>();

    mockUtilityService = {
      getName: jasmine.createSpy('getName'),
      getDialogStatus: dialogStatusSubject,
      setEmployeeData: new Subject<any>()
    }

    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        close: jasmine.createSpy('close'),
        afterClosed: () => of({})
      })
    }

    await TestBed.configureTestingModule({
      declarations: [SharedtableComponent],
      imports: [],
      providers: [
        { provide: ExcelService, useValue: mockExcellService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ApiService, useValue: mockApiService },
        { provide: UtilityService, useValue: mockUtilityService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: Router, useValue: mockRouter },
        { provide: SpinnerService, useValue: mockSpinnerService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SharedtableComponent);
    component = fixture.componentInstance;
    component.tableSourceData = [];
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeDialog when getDialogStatus emits true', () => {
    spyOn(component, 'closeDialog');

    (mockUtilityService.getDialogStatus as Subject<boolean>).next(true);

    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('It should call ngonchanges', () => {
    component.tableSourceData = mockEmployeeData;

    const mockChanges = {
      tableSourceData: new SimpleChange(null, mockEmployeeData, false)
    }
    component.ngOnChanges(mockChanges);

    expect(component.displayedColumns).toContain('action');
    expect(component.displayedColumns).toContain('id');

    expect(component.resultsLength).toBe(1);
  });


  fit('should apply lowercase and trimmed filter to dataSource and reset paginator', () => {
    const mockPaginator = jasmine.createSpyObj<MatPaginator>('MatPaginator', ['firstPage']);
    spyOnProperty(component.dataSource, 'paginator', 'get').and.returnValue(mockPaginator);
    const mockEvent = {
      target: { value: ' Darshan ' }
    } as unknown as Event;


    // component.dataSource.paginator = mockPaginator;

    component.applyFilter(mockEvent);

    expect(component.dataSource.filter).toBe('darshan');
    expect(mockPaginator.firstPage).toHaveBeenCalled();
  });

  xit('should call apply downloadExcell', () => {

  })


  xit('should call apply onFileSelected', () => {

  })
});
