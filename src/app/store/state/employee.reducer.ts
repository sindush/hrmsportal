import { filter } from 'rxjs';
import { employeeDetails } from './../../shared/interface/employeeDetails';
import { createReducer, on } from '@ngrx/store';
import { employeeDetailsInitialState } from './employee.state';
import {
  addEmployee,
  deleteEmployee,
  loadEmployeeDetails,
  loadEmployeeDetailsSuccess,
  updateEmployee,
} from './employee.actions';

const _getEmployeeDetailsReducer = createReducer(
  employeeDetailsInitialState,

  on(loadEmployeeDetailsSuccess, (state, action) => {
    return {
      state,
      employeeDetails: action.employeDetails,
    };
  }),

  on(addEmployee, (state: any, action) => {
    debugger;
    return {
      ...state,
      employeeDetails: [...state.employeeDetails, action.employeDetails],
    };
  }),

  on(deleteEmployee, (state: any, action: any) => {
    const updateEmployeeDetails = state.employeeDetails.filter(
      (employee: employeeDetails) => employee.id !== action.employeDetails.id
    );
    return {
      ...state,
      employeeDetails: [...updateEmployeeDetails],
    };
  }),

  on(updateEmployee, (state: any, action: any) => {
    debugger;
    const updatedEmployeeDetails = state.employeeDetails.map(
      (empDetails: employeeDetails) => {
        return empDetails.id === action.employeDetails.id
          ? action.employeDetails
          : empDetails;
      }
    );

    return {
      ...state,
      employeeDetails: updatedEmployeeDetails,
    };
  })
);

export function getEmployeeDetailsReducer(state: any, action: any) {
  return _getEmployeeDetailsReducer(state, action);
}
