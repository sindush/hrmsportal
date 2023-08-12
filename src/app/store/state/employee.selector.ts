import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState, employeeAdaptor } from './employee.state';

export const EMPLOYEE_STATE_NAME = 'employeDetails';

const getEmployeesState =
  createFeatureSelector<EmployeeState>(EMPLOYEE_STATE_NAME);
export const employeeSelector = employeeAdaptor.getSelectors();

export const getEmployeeDetailsList = createSelector(
  getEmployeesState,
  employeeSelector.selectAll
);

export const getEmployeeEntities = createSelector(
  getEmployeesState,
  employeeSelector.selectEntities
);

export const getEmployeeDetailsById = createSelector(
  getEmployeeEntities,
  (state: any, props: any) => {
    for (const key in state) {
      if (key === props.id) {
      return state[key]
        
      }
    }
    // return state.find(
    //   (emp: employeeDetails) => emp.id === props.id
    // );
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
