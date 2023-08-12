import { filter } from 'rxjs';
import { employeeDetails } from './../../shared/interface/employeeDetails';
import { createReducer, on } from '@ngrx/store';
import { employeeAdaptor, employeeDetailsInitialState } from './employee.state';
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
    // return {
    //   state,
    //   employeeDetails: action.employeDetails,
    // };
    return employeeAdaptor.setAll(action.employeDetails, state);
  }),

  on(addEmployee, (state: any, action) => {
    // debugger;
    // return {
    //   ...state,
    //   employeeDetails: [...state.employeeDetails, action.employeDetails],
    // };

    return employeeAdaptor.addOne(action.employeDetails, state);
  }),

  on(deleteEmployee, (state: any, action: any) => {
    // const updateEmployeeDetails = state.employeeDetails.filter(
    //   (employee: employeeDetails) => employee.id !== action.employeDetails.id
    // );
    // return {
    //   ...state,
    //   employeeDetails: [...updateEmployeeDetails],
    // };

    return employeeAdaptor.removeOne(action.employeeDetails.id, state);
  }),

  on(updateEmployee, (state: any, action: any) => {
    return employeeAdaptor.updateOne(action.employeeDetails, state);
  })

  // on(updateEmployee, (state: any, action: any) => {
  //   debugger;
  //   return employeeAdaptor.updateOne(action.employeeDetails, state);

  //   // const updatedEmployeeDetails = state.employeeDetails.map(
  //   //   (empDetails: employeeDetails) => {
  //   //     return empDetails.id === action.employeDetails.id
  //   //       ? action.employeDetails
  //   //       : empDetails;
  //   //   }
  //   // );

  //   // return {
  //   //   ...state,
  //   //   employeeDetails: updatedEmployeeDetails,
  //   };
  // })
);

export function getEmployeeDetailsReducer(state: any, action: any) {
  return _getEmployeeDetailsReducer(state, action);
}
