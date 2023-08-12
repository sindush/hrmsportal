import { filter } from 'rxjs';
import { employeeDetails } from './../../shared/interface/employeeDetails';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.state';

export const EMPLOYEE_STATE_NAME = 'employeDetails';

const getEmployeesState =
  createFeatureSelector<EmployeeState>(EMPLOYEE_STATE_NAME);

export const getEmployeeDetailsList = createSelector(
  getEmployeesState,
  (state) => {
    return state?.employeeDetails;
  }
);

export const getEmployeeDetailsById = createSelector(
  getEmployeesState,
  (state: any, props: any) => {
    return state.employeeDetails.find(
      (emp: employeeDetails) => emp.id === props.id
    );
  }
);


// export const getPostById = createSelector(
//   getPostEntities,
//   getCurrentRoute,
//   (posts, route: RouterStateUrl) => {
//     debugger
//     return posts ? posts[route.params['id']] : null;
//   }
// );