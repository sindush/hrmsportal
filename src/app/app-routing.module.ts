import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ContainerComponent } from './container/container.component';

const routes: Routes = [
  
  // {
  //   path: '',
  //   component: ContainerComponent,
  //   children: [
  //     { path: '', component: DashboardComponent, pathMatch: 'full' },
  //   ],
  //   pathMatch: 'full'
  // },
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'create', component: CreateEmployeeComponent },
  { path: 'employeeList', component: StatisticsComponent },
  // {
  //   path: 'container',
  //   component: ContainerComponent,
  //   children: [
  //     { path: '', component: DashboardComponent, pathMatch: 'full' },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
