import {
  deleteEmployee,
  deleteEmployeeSuccess,
  updateEmployee,
  updateEmployeeSuccess,
} from 'src/app/store/state/employee.actions';
import { employeeDetails } from './../../shared/interface/employeeDetails';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addEmployee,
  addEmployeeSuccess,
  loadEmployeeDetails,
  loadEmployeeDetailsSuccess,
} from './employee.actions';
import { map, mergeMap, retry } from 'rxjs';
import { ApiService } from 'src/app/shared/services/apiendpoint/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateEmployeeComponent } from 'src/app/create-employee/create-employee.component';

@Injectable()
export class EmployeesEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CreateEmployeeComponent>
  ) {}

  loadEmployees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadEmployeeDetails),
      mergeMap((action) => {
        return this.apiService.getEmployeeData().pipe(
          map((data: any) => {
            const empData: employeeDetails[] = [];
            for (let key in data) {
              empData.push({ ...data[key], id: key });
            }
            return empData;
          }),
          map((employee: employeeDetails[]) => {
            return loadEmployeeDetailsSuccess({ employeDetails: employee });
          })
        );
      })
    );
  });

  addEmploye$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addEmployee),
      mergeMap((action) => {
        return this.apiService
          .createEmployeeDetails(action.employeDetails)
          .pipe(
            map((response: any) => {
              const employeeData = {
                ...action.employeDetails,
                id: response.name,
              };
              // this.dialogRef.close();
              return addEmployeeSuccess({ employeDetails: employeeData });
            })
          );
      })
    );
  });

  deleteEmployee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteEmployee),
      mergeMap((action) => {
        return this.apiService
          .deleteEmployeeById(action.employeDetails.id)
          .pipe(
            map((response: any) => {
              return deleteEmployeeSuccess({
                employeDetails: action.employeDetails,
              });
            })
          );
      })
    );
  });

  updateEmployee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateEmployee),
      mergeMap((action) => {
        return this.apiService
          .updateEmployeeDetails(action.employeDetails)
          .pipe(
            map((response: any) => {
              return updateEmployeeSuccess({
                employeDetails: action.employeDetails,
              });
            })
          );
      })
    );
  });
}
