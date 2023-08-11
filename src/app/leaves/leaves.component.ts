import { Observable, Subscription, filter, map, tap } from 'rxjs';
import { leaves } from './../shared/interface/leaves';
import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../shared/services/utility/utility.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css', '../shared/css/commonstyles.css'],
})
export class LeavesComponent implements OnInit {
  leavesData$: Subscription;
  leavesData: leaves;
  workFromHome: string | null;
  workFromOffice: string;
  constructor(private utilityService: UtilityService) {}

  ngOnInit(): void {
    this.leavesData$ = this.utilityService.getEmployeedsLeavesInfo.subscribe(
      (leaveData: leaves) => (this.leavesData = leaveData)
    );

    this.utilityService.getEmployeesData.subscribe((employeeList) => {
      
      if (employeeList && employeeList.length) {
        this.workFromHome = employeeList?.filter((val: any) => val.workingfrom === 'home');
        this.workFromOffice = employeeList?.filter((val: any) => val.workingfrom === 'office');
      }
    });
  }
}
