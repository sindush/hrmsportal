import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/apiendpoint/api.service';
import { employeeDetails } from '../shared/interface/employeeDetails';
import { Observable, map } from 'rxjs';
import { UtilityService } from '../shared/services/utility/utility.service';
import { leaves } from '../shared/interface/leaves';
import { TableColumn } from '../shared/interface/column';
import { Router } from '@angular/router';
import { SpinnerService } from '../shared/services/spinner/spinner.service';
import { setEmployeeDetails } from '../store/state/employee.actions';
import { Store } from '@ngrx/store';
import { EmployeeState } from '../store/state/employee.state';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
})
export class ContainerComponent implements OnInit {
  employeesDetails$: Observable<employeeDetails[]>;
  employeeProfile$: Observable<employeeDetails>;
  employeeLeaves$: Observable<leaves>;
  employeedData: employeeDetails[] = [];
  columns: Array<TableColumn> = [];
  mobileQuery: MediaQueryList;
  constructor(
    media: MediaMatcher,
    private apiService: ApiService,
    private utilityService: UtilityService,
    private router: Router,
    private spinnerService: SpinnerService,
    private store: Store<EmployeeState>
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
    // this.getEmployeeDetails();
    this.getEmployeesList();

    // this.employeeProfile$.subscribe((profileData: employeeDetails) =>
    //   this.utilityService.setEmployeeProfile.next(profileData)
    // );
    // this.employeeLeaves$.subscribe((leaves: leaves) =>
    //   this.utilityService.setEmployeeLeaves.next(leaves)
    // );
  }

  getEmployeeDetails() {
    this.employeeProfile$ = this.apiService.getEmployeeProfile();
    this.employeeLeaves$ = this.apiService.getEmployeeLeaves();
  }
  getEmployeesList() {
    this.spinnerService.setLoading(true);
    this.apiService
      .getEmployeeData()
      .pipe(
        map((data: any) => {
          const empData: employeeDetails[] = [];
          for (let key in data) {
            empData.push({ ...data[key], id: key });
          }
          return empData;
        })
      )
      .subscribe((data: employeeDetails[]) => {
        this.employeedData = data;
        this.spinnerService.setLoading(false);
        this.store.dispatch(setEmployeeDetails({ employeDetails: data }));
        // this.utilityService.setEmployeeData.next(data);
        this.columns = Object.keys(this.employeedData[0]).map((val) => {
          return {
            columnDef: val,
            header: this.utilityService.getName(val),
          };
        });
      });
  }
  navigate(url: string) {
    this.router.navigate([url]);
  }
}
