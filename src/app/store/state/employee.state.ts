import { employeeDetails } from './../../shared/interface/employeeDetails';

export interface EmployeeState {
  employeeDetails: employeeDetails[];
}

export const employeeDetailsInitialState: EmployeeState = {
  employeeDetails: [],
};
