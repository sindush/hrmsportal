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
import { employeeDetails } from '../../interface/employeeDetails';
import { TableColumn } from '../../interface/column';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CreateEmployeeComponent } from 'src/app/create-employee/create-employee.component';
import { ApiService } from '../../services/apiendpoint/api.service';
import { UtilityService } from '../../services/utility/utility.service';
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
  resultsLength = 0;

  ngAfterViewInit() {
    this.resultsLength = this.tableSourceData.length;
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private excelService: ExcelService,
    public dialog: MatDialog,
    private apiService: ApiService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.utilityService.getDialogStatus.subscribe((val) => {
      console.log(
        'this.utilityService.getDialogStatus',
        this.utilityService.getDialogStatus
      );
      if (val) {
        this.closeDialog();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes',changes)
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
    debugger;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      // this.displayedColumns = Object.keys(jsonData[0]);
      this.createEmployee(jsonData);
      // this.dataSource.data = jsonData;
    };
    // reader.readAsArrayBuffer(file);
    // this.dataSource.data = this.dataSource.data;
    // console.log('this.dataSource.data', this.dataSource.data);
  }
  createEmployee(employeeDetails: employeeDetails[]) {
    debugger

    employeeDetails.forEach((eachEmployee,i) => {
      this.apiService
      .createEmployeeDetails(eachEmployee)
      .subscribe((response: any) => {
        debugger;
        console.log(response);
        if (response.status === 201 && i === employeeDetails.length) {
          this.callGetCustomerDetails();
        }
      });
    })
    
    
  }
  callGetCustomerDetails() {
    this.apiService.getEmployeeData().subscribe((details) => {
      this.dataSource = new MatTableDataSource(details)
      this.utilityService.setEmployeeData.next(details);
      this.closeDialog();
    });
  }

  openDialog(employee: employeeDetails) {
    debugger;
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      height: '80%',
      width: '30%',
      data: {
        dataKey: employee,
        action: 'Update',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  closeDialog() {
    console.log('close d');
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
    this.apiService.deleteEmployeeById(employee.id).subscribe((value) => {
      debugger;
      if (value.status === 200) {
        this.apiService
          .getEmployeeData()
          .subscribe((details) =>
            this.utilityService.setEmployeeData.next(details)
          );
      }
      console.log(value);
    });
  }
}
