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
import { StoreModule } from '@ngrx/store';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { getEmployeeDetailsReducer } from './store/state/employee.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { EmployeesEffects } from './store/state/employee.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './custom-route-serializer';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LeavesComponent,
    StatisticsComponent,
    ContainerComponent,
    CreateEmployeeComponent,
    ViewEmployeeComponent,
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
    StoreModule.forRoot({ employeDetails: getEmployeeDetailsReducer }),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forRoot([EmployeesEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
    }),
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
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
