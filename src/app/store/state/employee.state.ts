import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { employeeDetails } from './../../shared/interface/employeeDetails';

export interface EmployeeState extends EntityState<employeeDetails>{}

export const employeeAdaptor = createEntityAdapter<employeeDetails>();

export const employeeDetailsInitialState: EmployeeState =  employeeAdaptor.getInitialState();
