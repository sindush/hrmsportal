import { Inject, Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { employeeDetails } from './shared/interface/employeeDetails';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends EntityCollectionServiceBase<employeeDetails> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('EmployeeDetails', serviceElementsFactory);
  }
}
