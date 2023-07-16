import { Observable, Subscription } from 'rxjs';
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
  constructor(private utilityService: UtilityService) {}

  ngOnInit(): void {
    this.leavesData$ = this.utilityService.getEmployeedsLeavesInfo.subscribe((leaveData:leaves) => this.leavesData = leaveData);
  }
}
