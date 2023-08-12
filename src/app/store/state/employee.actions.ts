import { employeeDetails } from './../../shared/interface/employeeDetails';
import { createAction, props } from '@ngrx/store';

export const getEmployeeDetailsById = createAction(
  '[employee] Get employee Details',
  props<{ id: string }>()
);

export const setEmployeeDetails = createAction(
  '[employee] set employee Details',
  props<{ employeDetails: employeeDetails[] }>()
);

export const addEmployee = createAction(
  '[employee] Add Employee',
  props<{ employeDetails: employeeDetails }>()
);


export const deleteEmployee = createAction(
  '[employee] Delete Employee',
  props<{employeDetails: employeeDetails}>()
)
export const updateEmployee = createAction(
  '[employee] update Employee',
  props<{employeDetails: employeeDetails}>()
)