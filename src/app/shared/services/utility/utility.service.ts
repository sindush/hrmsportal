import { employeeDetails } from './../../interface/employeeDetails';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { leaves } from '../../interface/leaves';
import { ApiService } from '../apiendpoint/api.service';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(public apiService: ApiService) {}

  public setEmployeeProfile = new BehaviorSubject({});
  getCurrentProfile = this.setEmployeeProfile.asObservable();

  public setEmployeeLeaves = new BehaviorSubject<leaves>({
    employeeOnLeave: [],
  });
  getEmployeedsLeavesInfo = this.setEmployeeLeaves.asObservable();

  public setEmployeeData = new BehaviorSubject<any>({});
  getEmployeesData = this.setEmployeeData.asObservable();

  public closeDialog = new BehaviorSubject<boolean>(false);
  getDialogStatus = this.closeDialog.asObservable();

  getName(str: string) {
    var i,
      frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  // createEmployee(employeeDetails: employeeDetails) {
  //   this.apiService
  //     .createEmployeeDetails(employeeDetails)
  //     .subscribe((response: any) => {
  //       debugger;
  //       console.log(response);
  //       if (response.status === 201) {
  //         this.callGetCustomerDetails();
  //       }
  //     });
  // }
}
