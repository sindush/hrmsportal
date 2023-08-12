import { employeeDetails } from './../../interface/employeeDetails';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExcelService } from '../../services/excell/excel.service';
import * as XLSX from 'xlsx';
import { TableColumn } from '../../interface/column';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CreateEmployeeComponent } from 'src/app/create-employee/create-employee.component';
import { ApiService } from '../../services/apiendpoint/api.service';
import { UtilityService } from '../../services/utility/utility.service';
import { MatSort } from '@angular/material/sort';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { EmployeeState } from 'src/app/store/state/employee.state';
import { Store } from '@ngrx/store';
import { deleteEmployee } from 'src/app/store/state/employee.actions';
// import { employeesListSelector } from 'src/app/store/state/employee.selector';
// import {MAT_DIALOG_DATA} from '@angular/material';

export interface PeriodicElement {
  department: string;
  emailAddress: string;
  jobStatus: string;
  joiningDate: string;
  monthlySalary: string;
  name: string;
}

const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-sharedtable',
  templateUrl: './sharedtable.component.html',
  styleUrls: ['./sharedtable.component.css'],
})
export class SharedtableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() tableSourceData: employeeDetails[] = [];
  @Input() columns: Array<TableColumn> = [];
  isLoadingResults = true;
  isRateLimitReached = false;

  displayedColumns: any[] = [];
  dataSource: any = new MatTableDataSource<employeeDetails>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  resultsLength: number;

  ngAfterViewInit() {
    this.resultsLength = this.tableSourceData?.length;
    // this.dataSource.paginator = this.paginator;
  }
  constructor(
    private excelService: ExcelService,
    public dialog: MatDialog,
    private apiService: ApiService,
    private utilityService: UtilityService,
    private snackBarService: SnackbarService,
    private router: Router,
    public spinnerService: SpinnerService,
    private store: Store<EmployeeState>
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.tableSourceData) {
      this.resultsLength = this.tableSourceData?.length;
      this.dataSource = new MatTableDataSource(this.tableSourceData);
    }

    this.utilityService.getDialogStatus.subscribe((val) => {
      if (val) {
        this.closeDialog();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.tableSourceData);
    if (this.tableSourceData && this.tableSourceData.length) {
      this.displayedColumns = Object.keys(this.tableSourceData[0]);
      this.displayedColumns.push('action');
      this.resultsLength = this.tableSourceData.length;
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadExcell() {
    this.excelService.exportAsExcelFile(
      this.dataSource.filteredData,
      'EmployeeData'
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.createEmployee(jsonData);
    };
    reader.readAsArrayBuffer(file);
  }
  createEmployee(employeeDetails: employeeDetails[]) {
    this.spinnerService.setLoading(true);
    employeeDetails.forEach((eachEmployee, i) => {
      this.apiService.createEmployeeDetails(eachEmployee).subscribe(
        (response: any) => {
          this.spinnerService.setLoading(false);
          if (response.status === 201 && i === employeeDetails.length - 1) {
            this.callGetCustomerDetails();
          }
        },
        (err) => {
          this.spinnerService.setLoading(false);
          this.snackBarService.error(err.statusText);
        }
      );
    });
  }
  callGetCustomerDetails() {
    this.spinnerService.setLoading(true);
    this.apiService
      .getEmployeeData()
      .subscribe((details: employeeDetails[]) => {
        this.spinnerService.setLoading(false);
        this.dataSource = new MatTableDataSource(details);
        this.sortGrid(details, 'id');
        // this.store.dispatch(setEmployeeDetails({ employeDetails: details }));
        // this.utilityService.setEmployeeData.next(details);
        this.closeDialog();
      });
  }

  openDialog(employee: employeeDetails) {
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      height: '80%',
      width: '30%',
      data: {
        dataKey: employee,
        action: 'Update',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  closeDialog() {
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      height: '80%',
      width: '30%',
      data: {
        dataKey: {},
      },
    });
    dialogRef.close();
  }

  deleteEmployee(employee: employeeDetails) {
    debugger;
    this.store.dispatch(deleteEmployee({employeDetails: employee }))
    // this.apiService.deleteEmployeeById(employee.id).subscribe((value) => {
    //   if (value.status === 200) {
    //     this.apiService.getEmployeeData().subscribe(
    //       (details) => {
    //         // this.utilityService.setEmployeeData.next(details);
    //         this.store.dispatch(deleteEmployee({ employeDetails: employee }));
    //       },
    //       (err) => {
    //         this.snackBarService.error(err.statusText);
    //       }
    //     );
    //   }
    // });
  }

  viewEmployee(employee: employeeDetails) {
    this.router.navigate(['view'], { queryParams: { id: employee.id } });
  }

  sortGrid(item: any, property: any) {
    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'id':
          return new Date(item.id);
        default:
          return item[property];
      }
    };
  }
}
