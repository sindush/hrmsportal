import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/sharedmodules/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeavesComponent } from './leaves/leaves.component';
import { SharedMaterialModule } from './shared/sharedmodules/sharedmaterial.module';
import { StatisticsComponent } from './statistics/statistics.component';
import { ApiService } from './shared/services/apiendpoint/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ContainerComponent } from './container/container.component';
import { UtilityService } from './shared/services/utility/utility.service';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LeavesComponent,
    StatisticsComponent,
    ContainerComponent,
    CreateEmployeeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    SharedMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers: [ApiService,UtilityService],
  bootstrap: [AppComponent],
  exports:[]
})
export class AppModule { }
