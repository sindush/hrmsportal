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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ContainerComponent } from './container/container.component';
import { UtilityService } from './shared/services/utility/utility.service';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalInterceptor } from './global.interceptor';
import { SnackbarService } from './shared/services/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    ReactiveFormsModule,
  ],
  providers: [
    ApiService,
    UtilityService,
    SnackbarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true,
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} } 
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
