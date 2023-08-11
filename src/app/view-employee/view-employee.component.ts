import { employeeDetails } from './../shared/interface/employeeDetails';
import { Observable, map, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/apiendpoint/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
})
export class ViewEmployeeComponent implements OnInit {
  userDetails: employeeDetails | null;
  // userDetails$ = Observable<employeeDetails>
  constructor(
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((params) => {
      console.log(params.id);
      if (params.id) {
        this.getEmployeeDetails(params.id);
      }
    });
  }

  getEmployeeDetails(id: string) {
    this.apiService
      .getEmployeeDetailsById(id)
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response.body;
          }
          return null;
        })
      )
      .subscribe((employee) => {
        // console.log(employee);
        this.userDetails = employee
      });
  }

  navigateBack(){
    this.router.navigate(['/'])
  }
}
