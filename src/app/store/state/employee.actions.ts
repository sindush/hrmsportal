import { Update } from '@ngrx/entity';
import { employeeDetails } from './../../shared/interface/employeeDetails';
import { createAction, props } from '@ngrx/store';

export const LOAD_EMPLOYEE_DETAILS = '[employee] Load employee Data';
export const LOAD_EMPLOYEE_DETAILS_SUCCESS =
  '[employee] Load employee Details Success';

export const ADD_EMPLOYEE_ACTION = '[employee] Add employee Data';
export const ADD_EMPLOYEE_DETAILS_SUCCESS =
  '[employee] Add employee Details Success';

export const DELETE_EMPLOYEE_ACTION = '[employee] Delete Employee';
export const DELETE_EMPLOYEE_DETAILS_SUCCESS =
  '[employee] Delete employee Details Success';


export const UPDATE_EMPLOYEE = '[employee] update Employee';
export const UPDATE_EMPLOYEE_SUCCESS = '[employee] update Employee Success';


export const getEmployeeDetailsById = createAction(
  '[employee] Get employee Details',
  props<{ id: string }>()
);

export const loadEmployeeDetails = createAction(LOAD_EMPLOYEE_DETAILS);

export const loadEmployeeDetailsSuccess = createAction(
  LOAD_EMPLOYEE_DETAILS_SUCCESS,
  props<{ employeDetails: employeeDetails[] }>()
);

export const addEmployee = createAction(
  ADD_EMPLOYEE_ACTION,
  props<{ employeDetails: employeeDetails }>()
);

export const addEmployeeSuccess = createAction(
  ADD_EMPLOYEE_DETAILS_SUCCESS,
  props<{ employeDetails: employeeDetails }>()
);

export const updateEmployee = createAction(
  UPDATE_EMPLOYEE,
  props<{ employeDetails: employeeDetails }>()
);
export const updateEmployeeSuccess = createAction(
  UPDATE_EMPLOYEE_SUCCESS,
  props<{ employeDetails: Update<employeeDetails> }>()
);

export const deleteEmployee = createAction(
  DELETE_EMPLOYEE_ACTION,
  props<{ employeDetails: employeeDetails }>()
);

export const deleteEmployeeSuccess = createAction(
  DELETE_EMPLOYEE_DETAILS_SUCCESS,
  props<{ id:string }>()
);
