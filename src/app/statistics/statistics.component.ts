import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/apiendpoint/api.service';
import { employeeDetails } from '../shared/interface/employeeDetails';
import { Observable, filter } from 'rxjs';
import { TableColumn } from '../shared/interface/column';
import { UtilityService } from '../shared/services/utility/utility.service';
import { CreateEmployeeComponent } from '../create-employee/create-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmployeeState } from '../store/state/employee.state';
import { Store } from '@ngrx/store';
import { getEmployeeDetailsList } from '../store/state/employee.selector';
// import { employeesListSelector } from '../store/state/employee.selector';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css', '../shared/css/commonstyles.css'],
})
export class StatisticsComponent implements OnInit {
  employeedData: employeeDetails[] = [];
  employeesData$: Observable<employeeDetails[]>;
  columns: Array<TableColumn> = [];

  constructor(
    public dialog: MatDialog,
    private store: Store<EmployeeState>
  ) {}

  ngOnInit(): void {
    this.store.select(getEmployeeDetailsList)
    .subscribe(data =>{
      this.employeedData = data;
    })
  }

  createEmployee() {
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      height: '80%',
      width: '30%',
      data: {
        dataKey: {},
        action: 'Update',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
