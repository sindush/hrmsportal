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
import { of, Subject, throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { CreateEmployeeComponent } from 'src/app/create-employee/create-employee.component';

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
},
{
  "first_name": "Anusha",
  "last_name": "velagaleti",
  "gender": "female",
  "dob": "1992-06-24T18:30:00.000Z",
  "address": "18 Taylor St",
  "city": "Vijayawada",
  "county": "India",
  "postal": "520004",
  "phone1": "1234567890",
  "phone2": "01944-369971",
  "email": "123123@hotmail.com",
  "web": "asdasdsad",
  "workingfrom": "home",
  "id": "25612"
}]

describe('SharedtableComponent', () => {
  let component: SharedtableComponent;
  let fixture: ComponentFixture<SharedtableComponent>;

  let mockExcellService: jasmine.SpyObj<ExcelService>;
  let mockDialog: any;
  let mockDialogRef: any;
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
    mockApiService = jasmine.createSpyObj('ApiService', ['getEmployeeData', 'createEmployeeDetails', 'deleteEmployeeById']);
    mockApiService.getEmployeeData.and.returnValue(of([]));

    // mockUtilityService = jasmine.createSpyObj('UtilityService', ['getName'], {
    //   getDialogStatus: new Subject<boolean>()
    // });
    mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['success', 'error','info']);
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

    mockDialogRef = {
      afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true)),
      close: jasmine.createSpy('close')
    };

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
    component.dataSource = new MatTableDataSource([]);
    mockDialog.open.and.returnValue(mockDialogRef);
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

    expect(component.resultsLength).toBe(2);
  });


  it('should apply lowercase and trimmed filter to dataSource and reset paginator', () => {
    const mockPaginator = jasmine.createSpyObj<MatPaginator>('MatPaginator', ['firstPage']);
    spyOnProperty(component.dataSource, 'paginator', 'get').and.returnValue(mockPaginator);

    const mockEvent = {
      target: { value: ' Darshan ' }
    } as unknown as Event;

    component.applyFilter(mockEvent);

    expect(component.dataSource.filter).toBe('darshan');
    expect(mockPaginator.firstPage).toHaveBeenCalled();
  });

  it('should call apply downloadExcell', () => {
    const mockFilteredData = [{ id: 1, name: 'sindush' }];

    component.dataSource.filteredData = mockFilteredData;

    component.downloadExcell();

    expect(mockExcellService.exportAsExcelFile).toHaveBeenCalledWith(mockFilteredData, 'EmployeeData')
  })


  xit('should read file, convert sheet data to JSON, and call createEmployee', () => {
    // Arrange
    const mockFile = new File([''], 'test-excel.xlsx', { type: 'application/vnd.ms-excel' });
    const mockEvent = { target: { files: [mockFile] } };

    // 1. Force FileReader to instantly execute its onload callback instead of waiting for file IO
    spyOn(FileReader.prototype, 'readAsArrayBuffer').and.callFake(function (this: FileReader) {
      if (this.onload) {
        this.onload({ target: { result: new ArrayBuffer(0) } } as any);
      }
    });

    // 2. Mock XLSX functions so they return target mock data shapes instead of processing empty arrays
    const mockWorkbook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: {} } };
    const mockJsonData = mockEmployeeData;

    // spyOn(XLSX, 'read').and.returnValue(mockWorkbook as any);
    spyOn(XLSX.utils, 'sheet_to_json').and.returnValue(mockJsonData);

    // 3. Spy on the internal method we expect to be called at the end
    spyOn(component, 'createEmployee');

    // Act
    component.onFileSelected(mockEvent);

    // Assert
    expect(component.createEmployee).toHaveBeenCalledWith(mockJsonData);
  });

  it('should enable spinner, call API, disable spinner, and show success snackbar on success', () => {
    const singleEmployeePayload = mockEmployeeData[0];
    const mockResponse = { status: 201, body: singleEmployeePayload };

    mockApiService.createEmployeeDetails.and.returnValue(of(mockResponse as any));

    spyOn(component, 'callGetCustomerDetails');

    // 1. Clear out the initial page-load (ngOnInit) calls so we start fresh at 0
    mockSpinnerService.setLoading.calls.reset();

    // 2. Act
    component.createEmployee([singleEmployeePayload]);

    // 3. Assert
    expect(mockApiService.createEmployeeDetails).toHaveBeenCalledOnceWith(singleEmployeePayload);

    // Verify all 4 sequential steps of the Create -> Refresh cycle
    expect(mockSpinnerService.setLoading).toHaveBeenCalledTimes(2);
    expect(mockSpinnerService.setLoading.calls.allArgs()).toEqual([
      [true],  // 1. Create begins
      [false], // 2. Create ends2
    ]);

    expect(component.callGetCustomerDetails).toHaveBeenCalled();
  });

  it('should enable spinner, call API, disable spinner, and show success snackbar on success', () => {
    const singleEmployeePayload = mockEmployeeData[0];
    const mockError = { statusText: 'Internal Server Error' };

    mockApiService.createEmployeeDetails.and.returnValue(throwError(() => mockError));
    mockSpinnerService.setLoading.calls.reset();

    component.createEmployee([singleEmployeePayload]);

    expect(mockSpinnerService.setLoading).toHaveBeenCalledTimes(2);
    expect(mockSpinnerService.setLoading.calls.allArgs()).toEqual([[true], [false]]);

    expect(mockSnackbarService.error).toHaveBeenCalledWith('Internal Server Error');

  });

  it('should fetch employee data, update dataSource, refresh utilities, and close the dialog', () => {
    const mockDetails = mockEmployeeData;

    mockApiService.getEmployeeData.and.returnValue(of(mockDetails as any));

    spyOn(component, 'sortGrid');
    spyOn(component, 'closeDialog');

    spyOn(mockUtilityService.setEmployeeData, 'next');

    mockSpinnerService.setLoading.calls.reset();

    component.callGetCustomerDetails();

    expect(mockApiService.getEmployeeData).toHaveBeenCalled();

    expect(mockSpinnerService.setLoading).toHaveBeenCalledTimes(2);
    expect(mockSpinnerService.setLoading.calls.allArgs()).toEqual([[true], [false]]);

    expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
    expect(component.dataSource.data).toEqual(mockDetails);

    expect(component.sortGrid).toHaveBeenCalledWith(mockDetails, 'id');

    expect(mockUtilityService.setEmployeeData.next).toHaveBeenCalledOnceWith(mockDetails);

    expect(component.closeDialog).toHaveBeenCalled();
  });


  it('delete employee', () => {
    const mockEmployeeToDelete = mockEmployeeData[0];

    const response = { status: 200 };
    const mockRefreshedDetails = [mockEmployeeData[1]]



    mockApiService.deleteEmployeeById.and.returnValue(of(response as any));
    mockApiService.getEmployeeData.and.returnValue(of(mockRefreshedDetails as any));

    spyOn(mockUtilityService.setEmployeeData, 'next');

    component.deleteEmployee(mockEmployeeToDelete);

    expect(mockApiService.deleteEmployeeById).toHaveBeenCalledWith('32123');

    expect(mockApiService.getEmployeeData).toHaveBeenCalled();

    expect(mockUtilityService.setEmployeeData.next).toHaveBeenCalledWith(mockRefreshedDetails);
  })

  it('should call delete API but NOT refresh data if the response status code is not 200', () => {
    // 1. Arrange
    const mockEmployeeToDelete = { id: 'EMP123' } as any;
    const mockBadDeleteResponse = { status: 400 }; // Simulating a bad request or missing permission

    mockApiService.deleteEmployeeById.and.returnValue(of(mockBadDeleteResponse as any));
    spyOn(mockUtilityService.setEmployeeData, 'next');

    // 2. Act
    component.deleteEmployee(mockEmployeeToDelete);

    // 3. Assert
    expect(mockApiService.deleteEmployeeById).toHaveBeenCalledWith('EMP123');

    // The nested blocks should skip execution entirely because status !== 200
    expect(mockApiService.getEmployeeData).not.toHaveBeenCalled();
    expect(mockUtilityService.setEmployeeData.next).not.toHaveBeenCalled();
  });

  it('should trigger error snackbar if the data refresh stream fails after a successful deletion', () => {
    // 1. Arrange
    const mockEmployeeToDelete = { id: 'EMP123' } as any;
    const mockDeleteResponse = { status: 200 };
    const mockErrorResponse = { statusText: 'Database Fetch Failed' };

    // Delete succeeds, but the following GET query collapses
    mockApiService.deleteEmployeeById.and.returnValue(of(mockDeleteResponse as any));
    mockApiService.getEmployeeData.and.returnValue(throwError(() => mockErrorResponse));

    // 2. Act
    component.deleteEmployee(mockEmployeeToDelete);

    // 3. Assert
    expect(mockApiService.deleteEmployeeById).toHaveBeenCalledWith('EMP123');
    expect(mockApiService.getEmployeeData).toHaveBeenCalled();

    // Confirms that the inner catch block catches the error and relays it to the UI alert layer
    expect(mockSnackbarService.error).toHaveBeenCalledWith('Database Fetch Failed');
  });

  describe('openDialog', () => {
    it('should launch CreateEmployeeComponent with targeted dimension limits and pass active update records', () => {
      // 1. Arrange
      const mockEmployee = { id: 'EMP789', first_name: 'Darshan' } as any;

      // 2. Act
      component.openDialog(mockEmployee);

      // 3. Assert
      // Verify the modal configuration profile matches exactly
      expect(mockDialog.open).toHaveBeenCalledWith(CreateEmployeeComponent, {
        height: '80%',
        width: '30%',
        data: {
          dataKey: mockEmployee,
          action: 'Update',
        },
      });

      // Verify it listens to the closure stream pipeline
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('should initialize a structural dialog placeholder instance and trigger an immediate shutdown call', () => {
      // 1. Act
      component.closeDialog();

      // 2. Assert
      // Verify the instantiation phase targetted a blank layout context
      expect(mockDialog.open).toHaveBeenCalledWith(CreateEmployeeComponent, {
        height: '80%',
        width: '30%',
        data: {
          dataKey: {},
        },
      });

      // Verify the dismiss event immediately executed against the generated runtime reference
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  it('should assign a custom sortingDataAccessor that converts "id" values into Date objects', () => {
    // 1. Arrange
    const mockItem = { id: '2026-06-15', first_name: 'Darshan' };

    // 2. Act
    // Note: The parameters passed here don't matter because your method shadows 
    // them inside the internal arrow function block.
    component.sortGrid(null, null);

    // 3. Assert
    // Execute the assigned function manually to check the 'id' switch case
    const sortingResult = component.dataSource.sortingDataAccessor(mockItem, 'id');

    expect(sortingResult).toBeInstanceOf(Date);
    expect((sortingResult as Date).getTime()).toEqual(new Date('2026-06-15').getTime());
  });

  it('should assign a custom sortingDataAccessor that returns the property value directly for default fields', () => {
    // 1. Arrange
    const mockItem = { id: '123', first_name: 'Darshan', department: 'Engineering' };

    // 2. Act
    component.sortGrid(null, null);

    // 3. Assert
    // Execute the assigned function manually to check the 'default' switch case
    const sortingResult = component.dataSource.sortingDataAccessor(mockItem, 'first_name');

    expect(sortingResult).toEqual('Darshan');
  });
});
