import { employeeDetails } from './../../interface/employeeDetails';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { leaves } from '../../interface/leaves';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  createEmployeeDetails(
    employeDetails: employeeDetails
  ): Observable<{ employeDetails: employeeDetails }> {
    return this.http.post<{ employeDetails: employeeDetails }>(
      `https://hrmsportal-67715-default-rtdb.firebaseio.com/posts.json`,
      employeDetails
    );
  }

  getEmployeeData(): Observable<employeeDetails[]> {
    return this.http.get<employeeDetails[]>(
      'https://hrmsportal-67715-default-rtdb.firebaseio.com/posts.json'
    );
  }
  getEmployeeProfile(): Observable<employeeDetails> {
    return this.http.get<employeeDetails>('http://localhost:3000/profile');
  }
  getEmployeeLeaves(): Observable<leaves> {
    return this.http.get<leaves>('http://localhost:3000/leavesData');
  }

  deleteEmployeeById(id: string) {
    debugger;
    return this.http.delete(
      `https://hrmsportal-67715-default-rtdb.firebaseio.com/posts/${id}.json`,
      {
        observe: 'response',
      }
    );
  }

  updateEmployeeDetails(employeeDetails: employeeDetails) {
    return this.http.put(
      `https://hrmsportal-67715-default-rtdb.firebaseio.com/posts/${employeeDetails.id}.json`,
      employeeDetails
    );
  }

  getEmployeeDetailsById(
    id: string
  ): Observable<HttpResponse<employeeDetails>> {
    return this.http.get<employeeDetails>(
      `https://hrmsportal-67715-default-rtdb.firebaseio.com/posts/${id}.json`,
      { observe: 'response' }
    );
  }
}
