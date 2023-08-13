import { employeeDetails } from './../shared/interface/employeeDetails';
import { Observable, map, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/apiendpoint/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EmployeeState } from '../store/state/employee.state';
import { getEmployeeDetailsById } from '../store/state/employee.selector';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
})
export class ViewEmployeeComponent implements OnInit {
  userDetails: employeeDetails | undefined;
  // userDetails$ = Observable<employeeDetails>
  constructor(
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<EmployeeState>,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((params) => {
      if (params.id) {
        this.getEmployeeDetails(params.id);
      }
    });
  }

  getEmployeeDetails(id: string) {
    this.employeeService.entities$.subscribe((employees) => {
      this.userDetails = employees.find((employee) => employee.id == id);
    });
    // this.store.select(getEmployeeDetailsById, { id }).subscribe((employee) => {
    //   this.userDetails = employee;
    // });

    // this.apiService
    //   .getEmployeeDetailsById(id)
    //   .pipe(
    //     map((response) => {
    //       if (response.status === 200) {
    //         return response.body;
    //       }
    //       return null;
    //     })
    //   )
    //   .subscribe((employee) => {
    //     // console.log(employee);
    //     this.userDetails = employee
    //   });
  }

  navigateBack() {
    this.router.navigate(['/']);
  }
}
