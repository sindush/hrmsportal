import { getEmployeeDetailsReducer } from './store/state/employee.reducer';
import { EmployeeState } from './store/state/employee.state';

export interface AppState {
  employee: EmployeeState;
}

export const appReducer = {
  employeeReducer: getEmployeeDetailsReducer,
};
