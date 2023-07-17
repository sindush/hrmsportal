import { NgModule } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { SidenavbarComponent } from '../components/sidenavbar/sidenavbar.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    NgIf,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    NgFor,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSnackBarModule,  
    MatProgressSpinnerModule  
  ],
  exports: [
    MatSlideToggleModule,
    NgIf,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    NgFor,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],

})
export class SharedMaterialModule {}
