import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { Post } from './../models/post.model';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { employeeDetails } from './shared/interface/employeeDetails';
import { leaves } from './shared/interface/leaves';
import { Update } from '@ngrx/entity';

@Injectable()
export class EmployeeDataService extends DefaultDataService<employeeDetails> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('EmployeeDetails', http, httpUrlGenerator);
  }

  override getAll(): Observable<employeeDetails[]> {
    return this.http
      .get<employeeDetails[]>(
        'https://hrmsportal-67715-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        map((data) => {
          debugger;
          console.log(data);
          const empDetails: employeeDetails[] = [];
          for (let key in data) {
            empDetails.push({ ...data[key], id: key });
          }
          console.log(empDetails);
          return empDetails;  
          // ! always it should be return in array format
        })
      );
  }

  override add(post: employeeDetails): Observable<employeeDetails> {
    return this.http
      .post<{ name: string }>(
        `https://vue-completecourse.firebaseio.com/posts.json`,
        post
      )
      .pipe(
        map((data) => {
          return { ...post, id: data.name };
        })
      );
  }

  override update(post: Update<employeeDetails>): Observable<employeeDetails> {
    return this.http.put<employeeDetails>(
      `https://vue-completecourse.firebaseio.com/employeeDetailss/${post.id}.json`,
      { ...post.changes }
    );
  }

  override delete(id: string): Observable<string> {
    return this.http
      .delete(`https://vue-completecourse.firebaseio.com/posts/${id}.json`)
      .pipe(
        map((data) => {
          return id;
        })
      );
  }

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
