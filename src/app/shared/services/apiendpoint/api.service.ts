import { employeeDetails } from './../../interface/employeeDetails';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { leaves } from '../../interface/leaves';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getEmployeeData(): Observable<employeeDetails[]> {
    return this.http.get<employeeDetails[]>(
      'http://localhost:3000/employeeList'
    );
  }
  getEmployeeProfile(): Observable<employeeDetails> {
    return this.http.get<employeeDetails>('http://localhost:3000/profile');
  }
  getEmployeeLeaves(): Observable<leaves> {
    return this.http.get<leaves>('http://localhost:3000/leavesData');
  }

  deleteEmployeeById(id: string) {
    return this.http.delete(`http://localhost:3000/employeeList/${id}`, {observe: 'response'});
  }

  updateEmployeeDetails(employeeDetails:employeeDetails){
    debugger
    return this.http.put(`http://localhost:3000/employeeList/${employeeDetails.id}`,employeeDetails, {observe: 'response'})
  }
  createEmployeeDetails(employeeDetails:employeeDetails){
    debugger
    return this.http.post(`http://localhost:3000/employeeList`,employeeDetails, {observe: 'response'})
  }
}
